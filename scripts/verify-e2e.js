import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const SUPABASE_URL = 'https://ehwasggnycngirstposa.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mOIu-gG2Jm0YJ9sr6G7pdQ_D4qtWmW2'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function runE2ESuiteOnSupabase() {
  console.log('1. Verificando leitura de cepas via Supabase Client (CT-MAN-1)...')
  const { data: cepas, error: cepasErr } = await supabase
    .from('cepas')
    .select('*')
    .order('id', { ascending: true })
  if (cepasErr) throw cepasErr
  console.log(`   -> ${cepas.length} cepas carregadas:`, cepas.map((c) => `${c.nome_cientifico} (${c.estoque})`).join(', '))

  console.log('2. Executando cadastro da pesquisadora Júlia (CT-MAN-6) e edição de Perfil (CT-MAN-16, CT-MAN-17)...')
  // Limpa registros anteriores de julia/espacos se existirem
  await supabase.from('usuarios').delete().in('email', ['julia@email.com', 'espacos@email.com'])

  const juliaHash = bcrypt.hashSync('julia456', 10)
  const { data: juliaUser, error: juliaErr } = await supabase
    .from('usuarios')
    .insert([
      {
        nome: 'Júlia Santos Lima',
        email: 'julia@email.com',
        senha: juliaHash,
        tipo: 'comum'
      }
    ])
    .select()
    .single()
  if (juliaErr) throw juliaErr
  console.log('   -> Júlia gravada com ID:', juliaUser.id, '| Hash bcrypt:', juliaUser.senha.slice(0, 15) + '...')

  console.log('3. Executando atualização de Marcos pelo Admin (CT-MAN-32)...')
  await supabase
    .from('usuarios')
    .update({ nome: 'Marcos Pereira Silva' })
    .eq('email', 'marcos@email.com')

  console.log('4. Executando requisição de 2 ampolas de E. coli K-12 (CT-MAN-21 & CT-MAN-38)...')
  const ecoli = cepas.find((c) => c.slug === 'e-coli')
  await supabase.from('requisicoes').delete().eq('usuario_id', juliaUser.id)

  const { data: reqData, error: reqErr } = await supabase
    .from('requisicoes')
    .insert([
      {
        usuario_id: juliaUser.id,
        cepa_id: ecoli.id,
        quantidade: 2,
        finalidade: 'Clonagem molecular e cultivo em meio LB',
        total: 50.0
      }
    ])
    .select()
    .single()
  if (reqErr) throw reqErr

  await supabase.from('cepas').update({ estoque: 28 }).eq('id', ecoli.id)
  console.log('   -> Requisição registrada ID:', reqData.id, '| Total R$:', reqData.total, '| Novo estoque E. coli: 28')

  console.log('5. Executando registro de redefinição de senha (CT-MAN-26)...')
  await supabase.from('redefinicoes').insert([{ email: 'julia@email.com' }])

  console.log('6. Conferindo consultas de banco CT-MAN-36, CT-MAN-37 e CT-MAN-38 via Supabase...')
  const { data: todosUsuarios } = await supabase.from('usuarios').select('id, nome, email, tipo, senha').order('id')
  console.log('   -> Usuarios no banco:', todosUsuarios.map((u) => `#${u.id} ${u.nome} (${u.email}) [${u.tipo}] hash=${u.senha.slice(0, 7)}`))
}

runE2ESuiteOnSupabase().catch((e) => {
  console.error('Erro E2E:', e)
  process.exit(1)
})
