import React, { useEffect, useState } from 'react'
import {
  listarUsuariosAdmin,
  editarUsuarioAdmin,
  excluirUsuarioAdmin
} from '../lib/db'
import { ShieldCheck, Edit3, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react'

export function AdminPage({ user }) {
  const [usuarios, setUsuarios] = useState([])
  const [editando, setEditando] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editTipo, setEditTipo] = useState('comum')
  const [feedback, setFeedback] = useState(null)

  const carregarUsuarios = async () => {
    const data = await listarUsuariosAdmin()
    setUsuarios(data)
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const iniciarEdicao = (u) => {
    setFeedback(null)
    setEditando(u.id)
    setEditNome(u.nome)
    setEditEmail(u.email)
    setEditTipo(u.tipo)
  }

  const handleSalvarEdicao = async (e) => {
    e.preventDefault()
    setFeedback(null)

    const res = await editarUsuarioAdmin(editando, {
      nome: editNome,
      email: editEmail,
      tipo: editTipo
    })

    if (!res.ok) {
      setFeedback({ type: 'error', text: res.error })
    } else {
      setFeedback({ type: 'success', text: res.message })
      setEditando(null)
      await carregarUsuarios()
    }
  }

  const handleExcluir = async (u) => {
    setFeedback(null)
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir o usuário ${u.email}?`
    )
    if (!confirmado) return

    const res = await excluirUsuarioAdmin(u.id, user.id)
    if (!res.ok) {
      setFeedback({ type: 'error', text: res.error })
    } else {
      setFeedback({ type: 'success', text: res.message })
      await carregarUsuarios()
    }
  }

  return (
    <div className="page-container">
      <div className="section-header-banner">
        <span className="section-eyebrow">CURADORIA DO BIORREPOSITÓRIO · ACESSO RESTRITO</span>
        <h1 className="section-title">Área do Administrador</h1>
        <p className="section-desc">
          Gerencie os pesquisadores e curadores cadastrados no banco de dados Supabase.
        </p>
      </div>

      {feedback && (
        <div
          className={`origami-alert ${
            feedback.type === 'error'
              ? 'origami-alert--error'
              : 'origami-alert--success'
          }`}
          role="alert"
        >
          {feedback.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {editando && (
        <section className="origami-paper-card admin-edit-panel">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--amber">
              <Edit3 size={20} />
            </div>
            <div>
              <h2>Editar Usuário #{editando}</h2>
              <p>Altere nome, e-mail ou nível de permissão do usuário selecionado.</p>
            </div>
          </div>

          <form onSubmit={handleSalvarEdicao} className="admin-edit-form">
            <div className="form-field">
              <label htmlFor="admin-edit-nome">Nome</label>
              <input
                id="admin-edit-nome"
                type="text"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-edit-email">E-mail</label>
              <input
                id="admin-edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-edit-tipo">Tipo</label>
              <select
                id="admin-edit-tipo"
                value={editTipo}
                onChange={(e) => setEditTipo(e.target.value)}
              >
                <option value="comum">comum</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="admin-edit-actions">
              <button type="submit" className="paper-btn paper-btn--emerald">
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="paper-btn paper-btn--outline-dark"
              >
                <X size={15} /> Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="origami-paper-card">
        <div className="origami-card-header">
          <div className="origami-icon-box origami-icon-box--emerald">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2>Usuários cadastrados ({usuarios.length})</h2>
            <p>Lista oficial da tabela usuarios no Supabase.</p>
          </div>
        </div>

        <div className="origami-table-wrapper">
          <table className="origami-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} data-testid={`user-row-${u.email}`}>
                  <td className="mono-cell">#{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`role-badge ${
                        u.tipo === 'admin' ? 'role-badge--admin' : 'role-badge--comum'
                      }`}
                    >
                      {u.tipo}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(u)}
                      className="paper-btn paper-btn--emerald paper-btn--xs"
                    >
                      <Edit3 size={14} /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExcluir(u)}
                      className="paper-btn paper-btn--danger paper-btn--xs"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
