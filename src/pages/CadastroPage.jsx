import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { cadastrarUsuario } from '../lib/db'
import { MicrobeOrigamiArt } from '../components/MicrobeOrigamiArt'
import { UserPlus, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      const res = await cadastrarUsuario({ nome, email, senha })
      if (!res.ok) {
        setErro(res.error)
      } else {
        setSucesso(res.message)
        setSenha('')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="page-container page-container--auth">
      <div className="origami-auth-shell">
        <div className="origami-auth-aside">
          <span className="origami-badge origami-badge--atcc">CREDENCIAMENTO DE PESQUISADOR</span>
          <h2>Junte-se ao Origami BioBank</h2>
          <p>
            Cadastre seu perfil laboratorial para requisitar cepas de{' '}
            <em>Escherichia coli</em>, leveduras e fungos filamentosos com rastreabilidade ATCC.
          </p>
          <div className="origami-auth-aside__art">
            <MicrobeOrigamiArt slug="s-cerevisiae" size="md" />
          </div>
        </div>

        <div className="origami-paper-card origami-auth-form-card">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--emerald">
              <UserPlus size={22} />
            </div>
            <div>
              <h1>Criar conta</h1>
              <p>Preencha os dados obrigatórios para cadastrar seu acesso.</p>
            </div>
          </div>

          {erro && (
            <div className="origami-alert origami-alert--error" role="alert">
              <AlertCircle size={18} />
              <span>{erro}</span>
            </div>
          )}

          {sucesso && (
            <div className="origami-alert origami-alert--success" role="status">
              <CheckCircle2 size={18} />
              <div className="origami-alert__content">
                <span>{sucesso}</span>
                <Link to="/login" className="alert-inline-link">
                  Entrar <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="origami-form">
            <div className="form-field">
              <label htmlFor="cadastro-nome">Nome completo</label>
              <input
                id="cadastro-nome"
                name="nome"
                type="text"
                placeholder="Ex.: Júlia Santos"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="cadastro-email">E-mail institucional</label>
              <input
                id="cadastro-email"
                name="email"
                type="email"
                placeholder="Ex.: julia@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="cadastro-senha">Senha (mínimo 6 caracteres)</label>
              <input
                id="cadastro-senha"
                name="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="paper-btn paper-btn--vibrant paper-btn--full"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="origami-auth-footer">
            <span>Já possui cadastro no laboratório?</span>
            <Link to="/login" className="origami-text-link">
              Entrar na conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
