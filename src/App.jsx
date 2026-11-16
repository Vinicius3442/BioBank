import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { getSessionUser, setSessionUser, setFlashMessage } from './lib/db'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { CadastroPage } from './pages/CadastroPage'
import { LoginPage } from './pages/LoginPage'
import { PerfilPage } from './pages/PerfilPage'
import { RequisitarPage } from './pages/RequisitarPage'
import { RedefinirPage } from './pages/RedefinirPage'
import { AdminPage } from './pages/AdminPage'

function RequireAuth({ user, children }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      setFlashMessage('warning', 'Entre na sua conta para continuar.')
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  if (!user) return null
  return children
}

function RequireAdmin({ user, children }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      setFlashMessage('warning', 'Entre na sua conta para continuar.')
      navigate('/login', { replace: true })
    } else if (user.tipo !== 'admin') {
      setFlashMessage('error', 'Acesso restrito ao administrador.')
      navigate('/home', { replace: true })
    }
  }, [user, navigate])

  if (!user || user.tipo !== 'admin') return null
  return children
}

export default function App() {
  const [user, setUser] = useState(() => getSessionUser())

  const handleLoginSuccess = (loggedUser) => {
    setSessionUser(loggedUser)
    setUser(loggedUser)
  }

  const handleLogout = () => {
    setSessionUser(null)
    setUser(null)
  }

  useEffect(() => {
    const onForceLogout = () => handleLogout()
    window.addEventListener('origami-logout', onForceLogout)
    return () => window.removeEventListener('origami-logout', onForceLogout)
  }, [])

  return (
    <BrowserRouter>
      <div className="origami-app-layout">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="origami-main">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route
              path="/home"
              element={
                <RequireAuth user={user}>
                  <HomePage user={user} />
                </RequireAuth>
              }
            />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/perfil"
              element={
                <RequireAuth user={user}>
                  <PerfilPage user={user} onUserUpdate={handleLoginSuccess} />
                </RequireAuth>
              }
            />
            <Route
              path="/requisitar"
              element={
                <RequireAuth user={user}>
                  <RequisitarPage user={user} />
                </RequireAuth>
              }
            />
            <Route path="/redefinir" element={<RedefinirPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin user={user}>
                  <AdminPage user={user} />
                </RequireAdmin>
              }
            />
          </Routes>
        </main>
        <footer className="origami-footer">
          <div className="origami-footer__inner">
            <span>
              <strong>Origami BioBank</strong> · Catálogo e Requisição de Cepas Microbiológicas
            </span>
            <span>React + Supabase · Arte em Dobradura (Paper Craft Design)</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
