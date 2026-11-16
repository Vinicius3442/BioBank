import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FlaskConical, ShieldCheck, User, LogOut, Dna, Sparkles } from 'lucide-react'

export function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSair = () => {
    onLogout()
    navigate('/')
  }

  return (
    <header className="paper-navbar">
      <div className="paper-navbar__inner">
        <Link to={user ? '/home' : '/'} className="paper-brand">
          <div className="paper-brand__origami-emblem" aria-hidden="true">
            <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
              <polygon points="22,2 40,12 34,34 10,34 4,12" fill="#10b981" />
              <polygon points="22,2 40,12 22,22" fill="#fde047" />
              <polygon points="4,12 22,2 22,22" fill="#34d399" />
              <polygon points="10,34 22,22 34,34" fill="#047857" />
              <polygon points="16,18 22,12 28,18 22,28" fill="#ff2e93" />
            </svg>
          </div>
          <div className="paper-brand__text">
            <span className="paper-brand__tag">COLEÇÃO MICROBIOLÓGICA · DOBRADURA</span>
            <span className="paper-brand__title">Origami BioBank</span>
          </div>
        </Link>

        <nav className="paper-nav" aria-label="Menu principal">
          {!user ? (
            <>
              <Link
                to="/"
                className={`paper-nav__link ${location.pathname === '/' ? 'is-active' : ''}`}
              >
                Início
              </Link>
              <Link
                to="/cadastro"
                className={`paper-nav__link ${location.pathname === '/cadastro' ? 'is-active' : ''}`}
              >
                Cadastrar
              </Link>
              <Link
                to="/login"
                className="paper-btn paper-btn--vibrant paper-btn--sm"
              >
                Entrar
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/home"
                className={`paper-nav__link ${
                  location.pathname === '/' || location.pathname === '/home' ? 'is-active' : ''
                }`}
              >
                <Dna size={16} />
                Início
              </Link>
              <Link
                to="/requisitar"
                className={`paper-nav__link ${
                  location.pathname === '/requisitar' ? 'is-active' : ''
                }`}
              >
                <FlaskConical size={16} />
                Requisitar cepa
              </Link>
              <Link
                to="/perfil"
                className={`paper-nav__link ${location.pathname === '/perfil' ? 'is-active' : ''}`}
              >
                <User size={16} />
                Perfil
              </Link>
              {user.tipo === 'admin' && (
                <Link
                  to="/admin"
                  className={`paper-nav__link paper-nav__link--admin ${
                    location.pathname === '/admin' ? 'is-active' : ''
                  }`}
                >
                  <ShieldCheck size={16} />
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={handleSair}
                className="paper-btn paper-btn--outline-light paper-btn--sm"
              >
                <LogOut size={15} />
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
