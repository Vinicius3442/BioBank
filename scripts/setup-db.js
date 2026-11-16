import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Client } = pg

const DB_PASS = 'xL7KcSyppIvPLchW'
const PROJECT_REF = 'ehwasggnycngirstposa'

const candidates = [
  {
    name: 'Pooler aws-0-sa-east-1 (Session 5432)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${DB_PASS}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  },
  {
    name: 'Pooler aws-1-sa-east-1 (Session 5432)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${DB_PASS}@aws-1-sa-east-1.pooler.supabase.com:5432/postgres`,
  },
  {
    name: 'Pooler aws-0-sa-east-1 (Transaction 6543)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${DB_PASS}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
  },
  {
    name: 'Direct IPv6/Host db.ehwasggnycngirstposa.supabase.co',
    connectionString: `postgresql://postgres:${DB_PASS}@db.${PROJECT_REF}.supabase.co:5432/postgres`,
  },
  {
    name: 'Pooler aws-0-us-east-1 (Session 5432)',
    connectionString: `postgresql://postgres.${PROJECT_REF}:${DB_PASS}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
  }
]

async function connectDb() {
  for (const cand of candidates) {
    const client = new Client({
      connectionString: cand.connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 7000
    })
    try {
      await client.connect()
      console.log(`Connected via: ${cand.name}`)
      return client
    } catch (err) {
      console.log(`Failed ${cand.name}: ${err.message}`)
    }
  }
  throw new Error('Could not connect to any Supabase Postgres endpoint')
}

async function main() {
  const client = await connectDb()

  const sql = `
    DROP TABLE IF EXISTS requisicoes CASCADE;
    DROP TABLE IF EXISTS redefinicoes CASCADE;
    DROP TABLE IF EXISTS cepas CASCADE;
    DROP TABLE IF EXISTS usuarios CASCADE;

    CREATE TABLE usuarios (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'comum' CHECK (tipo IN ('comum', 'admin')),
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE cepas (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      nome_cientifico TEXT NOT NULL,
      nome_popular TEXT NOT NULL,
      codigo_atcc TEXT NOT NULL,
      categoria TEXT NOT NULL,
      nivel_biosseguranca TEXT NOT NULL DEFAULT 'NB-1',
      meio_cultivo TEXT NOT NULL,
      temperatura_ideal TEXT NOT NULL,
      preco NUMERIC(10, 2) NOT NULL DEFAULT 0,
      estoque INTEGER NOT NULL DEFAULT 0,
      descricao TEXT NOT NULL
    );

    CREATE TABLE requisicoes (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      cepa_id INTEGER NOT NULL REFERENCES cepas(id) ON DELETE CASCADE,
      quantidade INTEGER NOT NULL,
      finalidade TEXT NOT NULL DEFAULT 'Ensaio microbiológico padrão',
      total NUMERIC(10, 2) NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE redefinicoes (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
    ALTER TABLE cepas DISABLE ROW LEVEL SECURITY;
    ALTER TABLE requisicoes DISABLE ROW LEVEL SECURITY;
    ALTER TABLE redefinicoes DISABLE ROW LEVEL SECURITY;

    GRANT ALL ON TABLE usuarios TO anon, authenticated, service_role;
    GRANT ALL ON TABLE cepas TO anon, authenticated, service_role;
    GRANT ALL ON TABLE requisicoes TO anon, authenticated, service_role;
    GRANT ALL ON TABLE redefinicoes TO anon, authenticated, service_role;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
  `

  await client.query(sql)
  console.log('Tables created and permissions granted.')

  const adminHash = bcrypt.hashSync('admin123', 10)
  const marcosHash = bcrypt.hashSync('marcos123', 10)

  await client.query(
    `INSERT INTO usuarios (nome, email, senha, tipo) VALUES
      ($1, $2, $3, 'admin'),
      ($4, $5, $6, 'comum')`,
    [
      'Dr. Carlos Eduardo',
      'admin@biobank.com',
      adminHash,
      'Marcos Pereira',
      'marcos@email.com',
      marcosHash
    ]
  )

  await client.query(
    `INSERT INTO cepas (slug, nome_cientifico, nome_popular, codigo_atcc, categoria, nivel_biosseguranca, meio_cultivo, temperatura_ideal, preco, estoque, descricao) VALUES
      ('e-coli', 'Escherichia coli K-12', 'E. coli (Bacilo Gram-negativo)', 'ATCC 700926', 'Bactéria', 'NB-1', 'Caldo Luria-Bertani (LB)', '37 °C', 25.00, 30, 'Cepa padrão ouro para clonagem molecular, expressão proteica e genética bacteriana.'),
      ('s-cerevisiae', 'Saccharomyces cerevisiae S288C', 'Levedura de Brotamento', 'ATCC 204508', 'Levedura', 'NB-1', 'Ágar YPD (Extrato de Levedura)', '30 °C', 32.00, 20, 'Eucarioto modelo unicelular utilizado em fermentação bioquímica e biologia celular.'),
      ('penicillium', 'Penicillium chrysogenum', 'Penicillium (Fungo Filamentoso)', 'ATCC 28089', 'Fungo', 'NB-1', 'Ágar Batata Dextrose (BDA)', '25 °C', 45.00, 2, 'Cepa clássica produtora de metabólitos secundários beta-lactâmicos e ensaios de inibição.'),
      ('lactobacillus', 'Lactobacillus acidophilus', 'Lactobacilo Probiótico', 'ATCC 4356', 'Bactéria', 'NB-1', 'Ágar MRS', '37 °C', 28.00, 15, 'Bactéria ácido-lática empregada em estudos de fermentação lática e antagonismo microbiano.')`
  )

  console.log('Seed completed successfully!')
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
