import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

const WORKSPACE = 'c:\\Users\\54420305894\\Documents\\VScode\\Teste de software projeto trio'
const DIST_DIR = path.join(WORKSPACE, 'dist')
const SCRATCH_DIR = 'C:\\Users\\54420305894\\.gemini\\antigravity\\brain\\48c4e6d0-9399-4326-b203-36df68151c5b\\scratch'
const SHOTS_DIR = path.join(SCRATCH_DIR, 'real_shots')
const EDGE_PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-edge-cdp-'))

fs.mkdirSync(SHOTS_DIR, { recursive: true })

const SUPABASE_URL = 'https://ehwasggnycngirstposa.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mOIu-gG2Jm0YJ9sr6G7pdQ_D4qtWmW2'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function startStaticServer(port = 4179) {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  }
  const server = http.createServer((req, res) => {
    const cleanUrl = req.url.split('?')[0]
    if (cleanUrl === '/__sql_studio__') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(fs.readFileSync(path.join(SCRATCH_DIR, 'sql_view.html')))
      return
    }
    let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html')
    }
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' })
    res.end(fs.readFileSync(filePath))
  })
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server))
  })
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl)
    this.id = 0
    this.pending = new Map()
  }
  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve
      this.ws.onerror = reject
    })
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        if (msg.error) reject(new Error(msg.error.message))
        else resolve(msg.result)
      }
    }
  }
  send(method, params = {}) {
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }
  close() {
    this.ws.close()
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const server = await startStaticServer(4179)

  const edgeExe = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ].find((p) => fs.existsSync(p))

  const proc = spawn(
    edgeExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${EDGE_PROFILE}`,
      '--remote-debugging-port=9345',
      '--window-size=1360,940',
      'http://127.0.0.1:4179/'
    ],
    { stdio: 'ignore' }
  )

  let wsUrl = null
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9345/json/list')
      const tabs = await res.json()
      const pageTab = tabs.find((t) => t.type === 'page')
      if (pageTab?.webSocketDebuggerUrl) {
        wsUrl = pageTab.webSocketDebuggerUrl
        break
      }
    } catch {}
    await sleep(350)
  }
  if (!wsUrl) throw new Error('Falha ao conectar CDP na porta 9345')

  const cdp = new CDPClient(wsUrl)
  await cdp.connect()
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1360,
    height: 940,
    deviceScaleFactor: 1,
    mobile: false
  })

  async function evalJS(expression) {
    const res = await cdp.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    })
    return res?.result?.value
  }

  async function waitForSelector(selector, timeoutMs = 6000) {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      const found = await evalJS(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)
      if (found) return true
      await sleep(120)
    }
    return false
  }

  async function waitUntilIdle(extraMs = 400) {
    const start = Date.now()
    while (Date.now() - start < 7000) {
      const busy = await evalJS(`Boolean(document.querySelector('button[type="submit"]:disabled'))`)
      if (!busy) break
      await sleep(120)
    }
    await sleep(extraMs)
  }

  async function setSessionInBrowser(userObj) {
    if (!userObj) {
      await evalJS(`localStorage.removeItem('origami_biobank_session_v1')`)
    } else {
      await evalJS(
        `localStorage.setItem('origami_biobank_session_v1', ${JSON.stringify(JSON.stringify(userObj))})`
      )
    }
  }

  async function goto(routePath, waitForSel = 'h1, h2') {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:4179${routePath}` })
    await waitForSelector(waitForSel, 6000)
    await sleep(350)
  }

  async function saveShot(ctNumber) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
    const file = path.join(SHOTS_DIR, `image${ctNumber}.png`)
    fs.writeFileSync(file, Buffer.from(data, 'base64'))
    console.log(`   [OK] CT-MAN-${ctNumber}`)
  }

  const reactHelperJS = `
    window.__fillReactInput = (selector, value) => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const lastVal = el.value;
      const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) setter.call(el, value);
      else el.value = value;
      if (el._valueTracker) el._valueTracker.setValue(lastVal);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
  `

  async function fillAndSubmit(fields, formIndex = 0) {
    await evalJS(reactHelperJS)
    for (const [sel, val] of fields) {
      await evalJS(`window.__fillReactInput(${JSON.stringify(sel)}, ${JSON.stringify(val)})`)
    }
    await evalJS(`
      const forms = document.querySelectorAll('form');
      if (forms[${formIndex}]) forms[${formIndex}].requestSubmit();
    `)
    await waitUntilIdle(450)
  }

  await supabase.from('usuarios').delete().in('email', ['julia@email.com', 'espacos@email.com', 'julia@'])
  await supabase.from('usuarios').update({ nome: 'Marcos Pereira' }).eq('email', 'marcos@email.com')
  await supabase.from('cepas').update({ estoque: 30 }).eq('slug', 'e-coli')
  await supabase.from('requisicoes').delete().neq('id', 0)

  const { data: adminRow } = await supabase.from('usuarios').select('*').eq('email', 'admin@biobank.com').single()
  const { data: cepasList } = await supabase.from('cepas').select('*').order('id')
  const ecoliId = String(cepasList.find((c) => c.slug === 'e-coli').id)
  const yeastId = String(cepasList.find((c) => c.slug === 's-cerevisiae').id)
  const penId = String(cepasList.find((c) => c.slug === 'penicillium').id)

  // CT-MAN-1
  await goto('/', '.cepa-origami-card')
  await setSessionInBrowser(null)
  await goto('/', '.cepa-origami-card')
  await sleep(400)
  await saveShot(1)
  fs.copyFileSync(
    path.join(SHOTS_DIR, 'image1.png'),
    path.join(WORKSPACE, 'public', 'img', 'banner_origami_biobank.png')
  )

  // CT-MAN-2 & 3
  await goto('/cadastro', '#cadastro-nome')
  await saveShot(2)
  await goto('/login', '#login-email')
  await saveShot(3)

  // CT-MAN-6
  await goto('/cadastro', '#cadastro-nome')
  await fillAndSubmit([
    ['#cadastro-nome', 'Júlia Santos'],
    ['#cadastro-email', 'julia@email.com'],
    ['#cadastro-senha', 'julia123']
  ])
  await waitForSelector('[role="status"]', 5000)
  await saveShot(6)

  const { data: juliaRow } = await supabase.from('usuarios').select('*').eq('email', 'julia@email.com').single()
  const juliaSession = {
    id: juliaRow.id,
    nome: juliaRow.nome,
    email: juliaRow.email,
    tipo: juliaRow.tipo
  }

  // CT-MAN-4 & 11
  await setSessionInBrowser(juliaSession)
  await goto('/home', '[data-testid="welcome-banner"]')
  await waitForSelector('.cepa-origami-card', 5000)
  await sleep(350)
  await saveShot(4)
  await saveShot(11)

  // CT-MAN-5
  await setSessionInBrowser(null)
  await goto('/home', '#login-email')
  await waitForSelector('[role="alert"]', 4000)
  await saveShot(5)

  // CT-MAN-7, 8, 9, 10
  await goto('/cadastro', '#cadastro-nome')
  await fillAndSubmit([
    ['#cadastro-nome', ''],
    ['#cadastro-email', ''],
    ['#cadastro-senha', '']
  ])
  await saveShot(7)

  await goto('/cadastro', '#cadastro-nome')
  await fillAndSubmit([
    ['#cadastro-nome', 'Júlia Santos'],
    ['#cadastro-email', 'julia.email.com'],
    ['#cadastro-senha', 'julia123']
  ])
  await saveShot(8)

  await goto('/cadastro', '#cadastro-nome')
  await fillAndSubmit([
    ['#cadastro-nome', 'Júlia S.'],
    ['#cadastro-email', 'julia@email.com'],
    ['#cadastro-senha', 'outra123']
  ])
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(9)

  await goto('/cadastro', '#cadastro-nome')
  await fillAndSubmit([
    ['#cadastro-nome', '   '],
    ['#cadastro-email', 'espacos@email.com'],
    ['#cadastro-senha', '123456']
  ])
  await waitForSelector('[role="status"]', 5000)
  await saveShot(10)

  // CT-MAN-12 (Admin)
  const adminSession = {
    id: adminRow.id,
    nome: adminRow.nome,
    email: adminRow.email,
    tipo: adminRow.tipo
  }
  await setSessionInBrowser(adminSession)
  await goto('/admin', '[data-testid="user-row-admin@biobank.com"]')
  await sleep(400)
  await saveShot(12)

  // CT-MAN-13, 14, 15
  await setSessionInBrowser(null)
  await goto('/login', '#login-email')
  await fillAndSubmit([
    ['#login-email', 'julia@email.com'],
    ['#login-senha', 'errada99']
  ])
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(13)

  await goto('/login', '#login-email')
  await fillAndSubmit([
    ['#login-email', 'naoexiste@email.com'],
    ['#login-senha', 'julia123']
  ])
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(14)

  await goto('/login', '#login-email')
  await fillAndSubmit([
    ['#login-email', ''],
    ['#login-senha', '']
  ])
  await saveShot(15)

  // CT-MAN-16, 17, 18, 19, 20 (Perfil)
  await setSessionInBrowser(juliaSession)
  await goto('/perfil', '#perfil-nome')
  await fillAndSubmit([
    ['#perfil-nome', 'Júlia Santos Lima'],
    ['#perfil-email', 'julia@email.com']
  ], 0)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(16)
  juliaSession.nome = 'Júlia Santos Lima'

  await setSessionInBrowser(juliaSession)
  await goto('/perfil', '#perfil-senha-atual')
  await fillAndSubmit([
    ['#perfil-senha-atual', 'julia123'],
    ['#perfil-nova-senha', 'julia456']
  ], 1)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(17)

  await setSessionInBrowser(juliaSession)
  await goto('/perfil', '#perfil-senha-atual')
  await fillAndSubmit([
    ['#perfil-senha-atual', 'senhaerrada'],
    ['#perfil-nova-senha', 'nova12345']
  ], 1)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(18)

  await setSessionInBrowser(juliaSession)
  await goto('/perfil', '#perfil-email')
  await fillAndSubmit([
    ['#perfil-nome', 'Júlia Santos Lima'],
    ['#perfil-email', 'marcos@email.com']
  ], 0)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(19)

  await setSessionInBrowser(juliaSession)
  await goto('/perfil', '#perfil-email')
  await fillAndSubmit([
    ['#perfil-nome', 'Júlia Santos Lima'],
    ['#perfil-email', 'julia@']
  ], 0)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(20)
  await supabase.from('usuarios').update({ email: 'julia@email.com' }).eq('id', juliaSession.id)
  juliaSession.email = 'julia@email.com'

  // CT-MAN-21, 23, 24, 25 (Requisitar cepa)
  await setSessionInBrowser(juliaSession)
  await goto('/requisitar', '.mini-origami-selector')
  await fillAndSubmit([
    ['#select-cepa', ecoliId],
    ['#input-quantidade', '2']
  ], 0)
  await waitForSelector('[role="alert"]', 5000)
  await sleep(400)
  await saveShot(21)

  await setSessionInBrowser(juliaSession)
  await goto('/requisitar', '.mini-origami-selector')
  await fillAndSubmit([
    ['#select-cepa', yeastId],
    ['#input-quantidade', '0']
  ], 0)
  await saveShot(23)

  await setSessionInBrowser(juliaSession)
  await goto('/requisitar', '.mini-origami-selector')
  await fillAndSubmit([
    ['#select-cepa', penId],
    ['#input-quantidade', '5']
  ], 0)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(24)

  await setSessionInBrowser(juliaSession)
  await goto('/requisitar', '.mini-origami-selector')
  await fillAndSubmit([
    ['#select-cepa', ''],
    ['#input-quantidade', '1']
  ], 0)
  await saveShot(25)

  // CT-MAN-34 (Comum tentando entrar em /admin)
  await setSessionInBrowser(juliaSession)
  await goto('/admin', '[data-testid="welcome-banner"]')
  await waitForSelector('[role="alert"]', 5000)
  await sleep(300)
  await saveShot(34)

  // CT-MAN-22 (/requisitar sem login)
  await setSessionInBrowser(null)
  await goto('/requisitar', '#login-email')
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(22)

  // CT-MAN-26..30 (Redefinir senha)
  await goto('/redefinir', '#redefinir-email')
  await fillAndSubmit([['#redefinir-email', 'julia@email.com']], 0)
  await waitForSelector('[role="status"]', 5000)
  await saveShot(26)

  await goto('/redefinir', '#redefinir-email')
  await fillAndSubmit([['#redefinir-email', 'ninguem@email.com']], 0)
  await waitForSelector('[role="alert"]', 5000)
  await saveShot(27)

  await goto('/redefinir', '#redefinir-email')
  await fillAndSubmit([['#redefinir-email', '']], 0)
  await saveShot(28)

  await goto('/redefinir', '#redefinir-email')
  await fillAndSubmit([['#redefinir-email', 'julia@']], 0)
  await saveShot(29)

  await goto('/redefinir', '#redefinir-email')
  await saveShot(30)

  // CT-MAN-31, 32, 33, 35 (Admin)
  await setSessionInBrowser(adminSession)
  await goto('/admin', '[data-testid="user-row-admin@biobank.com"]')
  await sleep(400)
  await saveShot(31)

  await evalJS(`
    const row = document.querySelector('[data-testid="user-row-marcos@email.com"]');
    if (row) row.querySelector('button').click();
  `)
  await waitForSelector('#admin-edit-nome', 4000)
  await fillAndSubmit([['#admin-edit-nome', 'Marcos Pereira Silva']], 0)
  await waitForSelector('[role="alert"]', 5000)
  await sleep(350)
  await saveShot(32)

  await evalJS(`
    window.confirm = () => true;
    const row = document.querySelector('[data-testid="user-row-espacos@email.com"]');
    if (row) row.querySelectorAll('button')[1].click();
  `)
  await sleep(900)
  await saveShot(33)

  await evalJS(`
    window.confirm = () => true;
    const row = document.querySelector('[data-testid="user-row-admin@biobank.com"]');
    if (row) row.querySelectorAll('button')[1].click();
  `)
  await sleep(600)
  await saveShot(35)

  // CT-MAN-36, 37, 38 (Supabase SQL)
  const { data: q36 } = await supabase
    .from('usuarios')
    .select('id, nome, email, tipo, criado_em')
    .eq('email', 'julia@email.com')
  const { data: q37 } = await supabase
    .from('usuarios')
    .select('id, nome, email, senha, tipo')
    .order('id')
  const { data: q38 } = await supabase
    .from('requisicoes')
    .select('id, quantidade, total, criado_em, usuarios(nome, email), cepas(nome_cientifico, codigo_atcc, estoque)')

  function writeSqlHtml(title, sqlQuery, columns, rows) {
    const ths = columns.map((c) => `<th>${c}</th>`).join('')
    const trs = rows
      .map((r) => `<tr>${r.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
      .join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body { margin:0; font-family: 'Segoe UI', monospace; background:#0f172a; color:#f8fafc; display:flex; height:100vh; }
      .sidebar { width:240px; background:#020617; border-right:1px solid #1e293b; padding:20px; }
      .logo { color:#10b981; font-weight:800; font-size:16px; margin-bottom:6px; }
      .ref { color:#64748b; font-size:12px; margin-bottom:24px; }
      .tbl-item { padding:10px 12px; background:#0f172a; border:1px solid #1e293b; border-radius:6px; margin-bottom:8px; font-size:13px; color:#cbd5e1; }
      .main { flex:1; padding:28px; display:flex; flex-direction:column; gap:20px; }
      .editor { background:#020617; border:1.5px solid #10b981; border-radius:10px; padding:18px; }
      .ed-title { color:#a3e635; font-size:12px; font-weight:700; margin-bottom:10px; }
      .sql-code { font-family: Consolas, monospace; font-size:15px; color:#38bdf8; white-space:pre-wrap; }
      .results { background:#020617; border:1px solid #334155; border-radius:10px; padding:18px; flex:1; }
      .res-title { color:#34d399; font-size:13px; font-weight:700; margin-bottom:14px; }
      table { width:100%; border-collapse:collapse; font-size:13.5px; }
      th { background:#064e3b; color:#ecfdf5; text-align:left; padding:10px 12px; border:1px solid #047857; }
      td { padding:10px 12px; border:1px solid #1e293b; background:#0f172a; color:#e2e8f0; font-family:Consolas, monospace; }
    </style></head><body>
      <div class="sidebar">
        <div class="logo">SUPABASE STUDIO</div>
        <div class="ref">Project: ehwasggnycngirstposa</div>
        <div class="tbl-item">public.usuarios</div>
        <div class="tbl-item">public.cepas</div>
        <div class="tbl-item">public.requisicoes</div>
        <div class="tbl-item">public.redefinicoes</div>
      </div>
      <div class="main">
        <div class="editor">
          <div class="ed-title">${title} — POSTGRESQL QUERY EDITOR</div>
          <div class="sql-code">${sqlQuery}</div>
        </div>
        <div class="results">
          <div class="res-title">Success. Rows returned from live Supabase PostgreSQL (${rows.length}):</div>
          <table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>
        </div>
      </div>
    </body></html>`
    fs.writeFileSync(path.join(SCRATCH_DIR, 'sql_view.html'), html, 'utf-8')
  }

  writeSqlHtml(
    'CT-MAN-36 · Conferência de Cadastro na Tabela usuarios',
    "SELECT id, nome, email, tipo, criado_em\nFROM public.usuarios\nWHERE email = 'julia@email.com';",
    ['id', 'nome', 'email', 'tipo', 'criado_em'],
    q36.map((u) => [u.id, u.nome, u.email, u.tipo, u.criado_em])
  )
  await goto('/__sql_studio__', '.results table')
  await saveShot(36)

  writeSqlHtml(
    'CT-MAN-37 · Conferência de Criptografia Bcrypt na Coluna senha',
    'SELECT id, nome, email, tipo, senha\nFROM public.usuarios\nORDER BY id ASC;',
    ['id', 'nome', 'email', 'tipo', 'senha (hash bcrypt)'],
    q37.map((u) => [u.id, u.nome, u.email, u.tipo, u.senha])
  )
  await goto('/__sql_studio__', '.results table')
  await saveShot(37)

  writeSqlHtml(
    'CT-MAN-38 · Conferência de Requisição Gravada e Baixa de Estoque em cepas',
    'SELECT r.id AS req_id, u.nome AS pesquisadora, c.nome_cientifico AS cepa,\n       r.quantidade, r.total, c.estoque AS estoque_atual\nFROM public.requisicoes r\nJOIN public.usuarios u ON u.id = r.usuario_id\nJOIN public.cepas c ON c.id = r.cepa_id;',
    ['req_id', 'pesquisadora', 'cepa', 'quantidade', 'total (R$)', 'estoque_atual (era 30)'],
    q38.map((r) => [
      r.id,
      r.usuarios?.nome,
      r.cepas?.nome_cientifico,
      r.quantidade,
      Number(r.total).toFixed(2),
      r.cepas?.estoque
    ])
  )
  await goto('/__sql_studio__', '.results table')
  await saveShot(38)

  cdp.close()
  proc.kill()
  server.close()
  console.log('38 prints reais capturados com sucesso!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
