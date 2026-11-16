import React, { useState } from 'react'
import { atualizarDadosPerfil, trocarSenhaPerfil } from '../lib/db'
import { UserCog, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export function PerfilPage({ user, onUserUpdate }) {
  const [nome, setNome] = useState(user?.nome || '')
  const [email, setEmail] = useState(user?.email || '')
  const [msgDados, setMsgDados] = useState(null)
  const [salvandoDados, setSalvandoDados] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [msgSenha, setMsgSenha] = useState(null)
  const [salvandoSenha, setSalvandoSenha] = useState(false)

  const handleSalvarDados = async (e) => {
    e.preventDefault()
    setMsgDados(null)
    setSalvandoDados(true)

    try {
      const res = await atualizarDadosPerfil(user.id, { nome, email })
      if (!res.ok) {
        setMsgDados({ type: 'error', text: res.error })
      } else {
        setMsgDados({ type: 'success', text: res.message })
        setNome(res.user.nome)
        setEmail(res.user.email)
        onUserUpdate(res.user)
      }
    } finally {
      setSalvandoDados(false)
    }
  }

  const handleTrocarSenha = async (e) => {
    e.preventDefault()
    setMsgSenha(null)
    setSalvandoSenha(true)

    try {
      const res = await trocarSenhaPerfil(user.id, { senhaAtual, novaSenha })
      if (!res.ok) {
        setMsgSenha({ type: 'error', text: res.error })
      } else {
        setMsgSenha({ type: 'success', text: res.message })
        setSenhaAtual('')
        setNovaSenha('')
      }
    } finally {
      setSalvandoSenha(false)
    }
  }

  return (
    <div className="page-container">
      <div className="section-header-banner">
        <span className="section-eyebrow">CREDENCIAIS DO PESQUISADOR</span>
        <h1 className="section-title">Meu Perfil</h1>
        <p className="section-desc">
          Gerencie suas informações de identificação laboratorial e sua senha de acesso.
        </p>
      </div>

      <div className="perfil-grid">
        {/* Card 1: Alterar Nome e E-mail (RF13) */}
        <section className="origami-paper-card">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--emerald">
              <UserCog size={22} />
            </div>
            <div>
              <h2>Dados pessoais</h2>
              <p>Atualize seu nome completo e e-mail institucional.</p>
            </div>
          </div>

          {msgDados && (
            <div
              className={`origami-alert ${
                msgDados.type === 'error'
                  ? 'origami-alert--error'
                  : 'origami-alert--success'
              }`}
              role="alert"
            >
              {msgDados.type === 'error' ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{msgDados.text}</span>
            </div>
          )}

          <form onSubmit={handleSalvarDados} noValidate className="origami-form">
            <div className="form-field">
              <label htmlFor="perfil-nome">Nome</label>
              <input
                id="perfil-nome"
                name="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="perfil-email">E-mail</label>
              <input
                id="perfil-email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={salvandoDados}
              className="paper-btn paper-btn--emerald"
            >
              {salvandoDados ? 'Salvando...' : 'Salvar dados'}
            </button>
          </form>
        </section>

        {/* Card 2: Trocar Senha (RF14) */}
        <section className="origami-paper-card">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--amber">
              <Lock size={22} />
            </div>
            <div>
              <h2>Segurança e senha</h2>
              <p>Para trocar a senha, confirme sua senha atual.</p>
            </div>
          </div>

          {msgSenha && (
            <div
              className={`origami-alert ${
                msgSenha.type === 'error'
                  ? 'origami-alert--error'
                  : 'origami-alert--success'
              }`}
              role="alert"
            >
              {msgSenha.type === 'error' ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{msgSenha.text}</span>
            </div>
          )}

          <form onSubmit={handleTrocarSenha} noValidate className="origami-form">
            <div className="form-field">
              <label htmlFor="perfil-senha-atual">Senha atual</label>
              <input
                id="perfil-senha-atual"
                name="senha_atual"
                type="password"
                placeholder="••••••••"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="perfil-nova-senha">Nova senha (mínimo 6 caracteres)</label>
              <input
                id="perfil-nova-senha"
                name="nova_senha"
                type="password"
                placeholder="••••••••"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={salvandoSenha}
              className="paper-btn paper-btn--vibrant"
            >
              {salvandoSenha ? 'Atualizando...' : 'Trocar senha'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
