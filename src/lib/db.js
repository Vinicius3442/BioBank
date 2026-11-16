import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export const INITIAL_CEPAS = [
  {
    id: 1,
    slug: 'e-coli',
    nome_cientifico: 'Escherichia coli K-12',
    nome_popular: 'E. coli (Bacilo Gram-negativo)',
    codigo_atcc: 'ATCC 700926',
    categoria: 'Bactéria',
    nivel_biosseguranca: 'NB-1',
    meio_cultivo: 'Caldo Luria-Bertani (LB)',
    temperatura_ideal: '37 °C',
    preco: 25.0,
    estoque: 30,
    descricao:
      'Cepa padrão ouro para clonagem molecular, expressão proteica e genética bacteriana.'
  },
  {
    id: 2,
    slug: 's-cerevisiae',
    nome_cientifico: 'Saccharomyces cerevisiae S288C',
    nome_popular: 'Levedura de Brotamento',
    codigo_atcc: 'ATCC 204508',
    categoria: 'Levedura',
    nivel_biosseguranca: 'NB-1',
    meio_cultivo: 'Ágar YPD (Extrato de Levedura)',
    temperatura_ideal: '30 °C',
    preco: 32.0,
    estoque: 20,
    descricao:
      'Eucarioto modelo unicelular utilizado em fermentação bioquímica e biologia celular.'
  },
  {
    id: 3,
    slug: 'penicillium',
    nome_cientifico: 'Penicillium chrysogenum',
    nome_popular: 'Penicillium (Fungo Filamentoso)',
    codigo_atcc: 'ATCC 28089',
    categoria: 'Fungo',
    nivel_biosseguranca: 'NB-1',
    meio_cultivo: 'Ágar Batata Dextrose (BDA)',
    temperatura_ideal: '25 °C',
    preco: 45.0,
    estoque: 2,
    descricao:
      'Cepa clássica produtora de metabólitos secundários beta-lactâmicos e ensaios de inibição.'
  },
  {
    id: 4,
    slug: 'lactobacillus',
    nome_cientifico: 'Lactobacillus acidophilus',
    nome_popular: 'Lactobacilo Probiótico',
    codigo_atcc: 'ATCC 4356',
    categoria: 'Bactéria',
    nivel_biosseguranca: 'NB-1',
    meio_cultivo: 'Ágar MRS',
    temperatura_ideal: '37 °C',
    preco: 28.0,
    estoque: 15,
    descricao:
      'Bactéria ácido-lática empregada em estudos de fermentação lática e antagonismo microbiano.'
  }
]

const SESSION_KEY = 'origami_biobank_session_v1'
const FLASH_KEY = 'origami_biobank_flash_v1'

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSessionUser(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY)
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
}

export function setFlashMessage(type, text) {
  sessionStorage.setItem(FLASH_KEY, JSON.stringify({ type, text }))
}

export function consumeFlashMessage() {
  try {
    const raw = sessionStorage.getItem(FLASH_KEY)
    if (!raw) return null
    sessionStorage.removeItem(FLASH_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function listarCepas() {
  const { data, error } = await supabase
    .from('cepas')
    .select('*')
    .order('id', { ascending: true })
  if (error || !data || data.length === 0) {
    return INITIAL_CEPAS
  }
  return data.map((c) => ({ ...c, preco: Number(c.preco) }))
}

export async function contarRequisicoesUsuario(usuarioId) {
  const { count, error } = await supabase
    .from('requisicoes')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', usuarioId)
  if (error) return 0
  return count || 0
}

export async function cadastrarUsuario({ nome, email, senha }) {
  // RF06: Receber nome, e-mail e senha. Todos obrigatórios.
  // Nota intencional p/ CT-MAN-10: valida se string é vazia (!nome || !email.trim() || !senha),
  // permitindo que o caso de teste CT-MAN-10 detecte nome composto apenas por espaços como no documento modelo.
  if (!nome || !email.trim() || !senha) {
    return { ok: false, error: 'Preencha todos os campos.' }
  }

  const cleanEmail = email.trim().toLowerCase()
  // RF07: Formato de e-mail válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleanEmail)) {
    return { ok: false, error: 'Digite um e-mail válido.' }
  }

  // RF08: Senha com pelo menos 6 caracteres
  if (senha.length < 6) {
    return { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  // Verificar se e-mail já existe no banco
  const { data: existing } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', cleanEmail)
    .maybeSingle()

  if (existing) {
    return { ok: false, error: 'Este e-mail já está cadastrado.' }
  }

  const hash = bcrypt.hashSync(senha, 10)

  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      {
        nome,
        email: cleanEmail,
        senha: hash,
        tipo: 'comum'
      }
    ])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'Este e-mail já está cadastrado.' }
    }
    return { ok: false, error: 'Erro ao gravar cadastro no banco.' }
  }

  return {
    ok: true,
    message: 'Cadastro feito! Agora é só entrar.',
    user: data
  }
}

export async function autenticarUsuario({ email, senha }) {
  if (!email.trim() || !senha) {
    return { ok: false, error: 'Preencha e-mail e senha.' }
  }

  const cleanEmail = email.trim().toLowerCase()

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', cleanEmail)
    .maybeSingle()

  if (error || !user) {
    return { ok: false, error: 'E-mail ou senha inválidos.' }
  }

  const senhaValida = bcrypt.compareSync(senha, user.senha)
  if (!senhaValida) {
    return { ok: false, error: 'E-mail ou senha inválidos.' }
  }

  const sessionUser = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    tipo: user.tipo
  }
  setSessionUser(sessionUser)

  return {
    ok: true,
    user: sessionUser
  }
}

export async function atualizarDadosPerfil(usuarioId, { nome, email }) {
  if (!nome.trim() || !email.trim()) {
    return { ok: false, error: 'Preencha nome e e-mail.' }
  }

  const cleanEmail = email.trim().toLowerCase()

  // Nota intencional p/ CT-MAN-20: verifica apenas presença de '@' no Perfil,
  // reproduzindo o achado de QA CT-MAN-20 documentado na tabela de falhas devolvidas ao dev.
  if (!cleanEmail.includes('@')) {
    return { ok: false, error: 'Digite um e-mail válido.' }
  }

  const { data: outro } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', cleanEmail)
    .neq('id', usuarioId)
    .maybeSingle()

  if (outro) {
    return { ok: false, error: 'Este e-mail já pertence a outra conta.' }
  }

  const { data: updated, error } = await supabase
    .from('usuarios')
    .update({ nome: nome.trim(), email: cleanEmail })
    .eq('id', usuarioId)
    .select()
    .single()

  if (error) {
    return { ok: false, error: 'Não foi possível atualizar os dados.' }
  }

  const sessionUser = {
    id: updated.id,
    nome: updated.nome,
    email: updated.email,
    tipo: updated.tipo
  }
  setSessionUser(sessionUser)

  return {
    ok: true,
    message: 'Dados atualizados.',
    user: sessionUser
  }
}

export async function trocarSenhaPerfil(usuarioId, { senhaAtual, novaSenha }) {
  if (!senhaAtual || !novaSenha) {
    return { ok: false, error: 'Preencha a senha atual e a nova senha.' }
  }

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', usuarioId)
    .single()

  if (error || !user) {
    return { ok: false, error: 'Usuário não encontrado.' }
  }

  const confere = bcrypt.compareSync(senhaAtual, user.senha)
  if (!confere) {
    return { ok: false, error: 'Senha atual incorreta.' }
  }

  if (novaSenha.length < 6) {
    return { ok: false, error: 'A nova senha deve ter pelo menos 6 caracteres.' }
  }

  const novoHash = bcrypt.hashSync(novaSenha, 10)
  const { error: updateErr } = await supabase
    .from('usuarios')
    .update({ senha: novoHash })
    .eq('id', usuarioId)

  if (updateErr) {
    return { ok: false, error: 'Erro ao atualizar a senha.' }
  }

  return {
    ok: true,
    message: 'Senha alterada.'
  }
}

export async function registrarRequisicaoCepa(usuarioId, { cepaId, quantidade, finalidade }) {
  if (!cepaId) {
    return { ok: false, error: 'Escolha uma cepa.' }
  }

  const qtd = Number(quantidade)
  if (!Number.isInteger(qtd) || qtd < 1) {
    return { ok: false, error: 'A quantidade mínima é 1.' }
  }

  const { data: cepa, error: cepaErr } = await supabase
    .from('cepas')
    .select('*')
    .eq('id', Number(cepaId))
    .single()

  if (cepaErr || !cepa) {
    return { ok: false, error: 'Escolha uma cepa.' }
  }

  if (qtd > cepa.estoque) {
    return {
      ok: false,
      error: `Estoque insuficiente: restam ${cepa.estoque} ampola(s) de ${cepa.nome_cientifico}.`
    }
  }

  const total = Number((Number(cepa.preco) * qtd).toFixed(2))
  const novoEstoque = cepa.estoque - qtd

  const { data: reqCriada, error: reqErr } = await supabase
    .from('requisicoes')
    .insert([
      {
        usuario_id: usuarioId,
        cepa_id: cepa.id,
        quantidade: qtd,
        finalidade: finalidade?.trim() || 'Ensaio microbiológico experimental',
        total
      }
    ])
    .select()
    .single()

  if (reqErr) {
    return { ok: false, error: 'Erro ao registrar requisição no banco.' }
  }

  await supabase
    .from('cepas')
    .update({ estoque: novoEstoque })
    .eq('id', cepa.id)

  const totalFormatado = total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return {
    ok: true,
    message: `Requisição #${reqCriada.id} registrada: ${qtd} x ${cepa.nome_cientifico}. Total R$ ${totalFormatado}.`,
    requisicao: reqCriada
  }
}

export async function listarUltimasRequisicoes(usuarioId) {
  const { data, error } = await supabase
    .from('requisicoes')
    .select('id, quantidade, finalidade, total, criado_em, cepas(nome_cientifico, codigo_atcc, slug)')
    .eq('usuario_id', usuarioId)
    .order('id', { ascending: false })
    .limit(5)

  if (error || !data) return []
  return data
}

export async function solicitarRedefinicaoSenha(email) {
  if (!email || !email.trim()) {
    return { ok: false, error: 'Digite o e-mail cadastrado.' }
  }

  const cleanEmail = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleanEmail)) {
    return { ok: false, error: 'Digite um e-mail válido.' }
  }

  const { data: user } = await supabase
    .from('usuarios')
    .select('id, email')
    .eq('email', cleanEmail)
    .maybeSingle()

  if (!user) {
    return { ok: false, error: 'E-mail não encontrado.' }
  }

  await supabase.from('redefinicoes').insert([{ email: cleanEmail }])

  return {
    ok: true,
    message: `Enviamos as instruções para ${cleanEmail}.`
  }
}

export async function listarUsuariosAdmin() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, tipo, criado_em')
    .order('id', { ascending: true })

  if (error || !data) return []
  return data
}

export async function editarUsuarioAdmin(id, { nome, email, tipo }) {
  if (!nome || !email.trim()) {
    return { ok: false, error: 'Preencha nome e e-mail.' }
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      tipo
    })
    .eq('id', id)
    .select('id, nome, email, tipo, criado_em')
    .single()

  if (error) {
    return { ok: false, error: 'Erro ao atualizar usuário.' }
  }

  return {
    ok: true,
    message: 'Usuário atualizado.',
    usuario: data
  }
}

export async function excluirUsuarioAdmin(idAlvo, adminLogadoId) {
  if (Number(idAlvo) === Number(adminLogadoId)) {
    return {
      ok: false,
      error: 'Você não pode excluir a própria conta.'
    }
  }

  const { error } = await supabase.from('usuarios').delete().eq('id', idAlvo)
  if (error) {
    return { ok: false, error: 'Erro ao excluir usuário.' }
  }

  return {
    ok: true,
    message: 'Usuário excluído.'
  }
}
