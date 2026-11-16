import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { solicitarRedefinicaoSenha } from '../lib/db'
import { MicrobeOrigamiArt } from '../components/MicrobeOrigamiArt'
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export function RedefinirPage() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)

    try {
      const res = await solicitarRedefinicaoSenha(email)
      if (!res.ok) {
        setErro(res.error)
      } else {
        setSucesso(res.message)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="page-container page-container--auth">
      <div className="origami-auth-shell">
        <div className="origami-auth-aside">
          <span className="origami-badge origami-badge--atcc">RECUPERAÇÃO DE ACESSO</span>
          <h2>Redefinir senha do pesquisador</h2>
          <p>
            Informe o e-mail vinculado ao seu cadastro para registrar o protocolo de
            recuperação na curadoria do Origami BioBank.
          </p>
          <div className="origami-auth-aside__art">
            <MicrobeOrigamiArt slug="penicillium" size="md" />
          </div>
        </div>

        <div className="origami-paper-card origami-auth-form-card">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--amber">
              <KeyRound size={22} />
            </div>
            <div>
              <h1>Redefinir senha</h1>
              <p>Digite o e-mail cadastrado para receber as instruções.</p>
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
              <span>{sucesso}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="origami-form">
            <div className="form-field">
              <label htmlFor="redefinir-email">E-mail cadastrado</label>
              <input
                id="redefinir-email"
                name="email"
                type="email"
                placeholder="Ex.: julia@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="paper-btn paper-btn--vibrant paper-btn--full"
            >
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </form>

          <div className="origami-auth-footer">
            <Link to="/login" className="origami-text-link">
              <ArrowLeft size={14} /> Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
