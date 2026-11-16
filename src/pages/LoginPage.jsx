import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { autenticarUsuario, consumeFlashMessage } from '../lib/db'
import { MicrobeOrigamiArt } from '../components/MicrobeOrigamiArt'
import { LogIn, AlertCircle, KeyRound } from 'lucide-react'

export function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const flash = consumeFlashMessage()
    if (flash?.text) {
      setAviso(flash.text)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setAviso('')
    setCarregando(true)

    try {
      const res = await autenticarUsuario({ email, senha })
      if (!res.ok) {
        setErro(res.error)
      } else {
        onLoginSuccess(res.user)
        // RF11: Levar o administrador para /admin e o usuário comum para /home
        if (res.user.tipo === 'admin') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="page-container page-container--auth">
      <div className="origami-auth-shell">
        <div className="origami-auth-aside">
          <span className="origami-badge origami-badge--atcc">ACESSO AO ACERVO</span>
          <h2>Portal do Pesquisador &amp; Curadoria</h2>
          <p>
            Entre com suas credenciais para requisitar ampolas criopreservadas ou gerenciar
            usuários na curadoria administrativa.
          </p>
          <div className="origami-auth-aside__art">
            <MicrobeOrigamiArt slug="e-coli" size="md" />
          </div>
        </div>

        <div className="origami-paper-card origami-auth-form-card">
          <div className="cepa-origami-card__corner-fold" aria-hidden="true" />
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--emerald">
              <LogIn size={22} />
            </div>
            <div>
              <h1>Entrar</h1>
              <p>Acesse sua conta do Banco de Cepas.</p>
            </div>
          </div>

          {aviso && (
            <div className="origami-alert origami-alert--warning" role="alert">
              <AlertCircle size={18} />
              <span>{aviso}</span>
            </div>
          )}

          {erro && (
            <div className="origami-alert origami-alert--error" role="alert">
              <AlertCircle size={18} />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="origami-form">
            <div className="form-field">
              <label htmlFor="login-email">E-mail</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <div className="form-field__label-row">
                <label htmlFor="login-senha">Senha</label>
                <Link to="/redefinir" className="origami-text-link origami-text-link--sm">
                  <KeyRound size={13} /> Esqueci minha senha
                </Link>
              </div>
              <input
                id="login-senha"
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
              {carregando ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          <div className="origami-auth-footer">
            <span>Ainda não tem conta?</span>
            <Link to="/cadastro" className="origami-text-link">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
