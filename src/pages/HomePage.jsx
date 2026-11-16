import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listarCepas,
  contarRequisicoesUsuario,
  consumeFlashMessage
} from '../lib/db'
import { CepaOrigamiCard } from '../components/CepaOrigamiCard'
import { MicrobeOrigamiArt } from '../components/MicrobeOrigamiArt'
import { Sparkles, FlaskConical, ShieldCheck, Layers, ArrowRight } from 'lucide-react'

export function HomePage({ user }) {
  const [cepas, setCepas] = useState([])
  const [totalRequisicoes, setTotalRequisicoes] = useState(0)
  const [flash, setFlash] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')

  useEffect(() => {
    const msg = consumeFlashMessage()
    if (msg) setFlash(msg)
  }, [])

  useEffect(() => {
    listarCepas().then(setCepas)
    if (user?.id) {
      contarRequisicoesUsuario(user.id).then(setTotalRequisicoes)
    }
  }, [user])

  const cepasFiltradas =
    filtroCategoria === 'Todas'
      ? cepas
      : cepas.filter((c) => c.categoria === filtroCategoria)

  return (
    <div className="page-container">
      {flash && (
        <div
          className={`origami-alert ${
            flash.type === 'error' ? 'origami-alert--error' : 'origami-alert--info'
          }`}
          role="alert"
        >
          <span>{flash.text}</span>
        </div>
      )}

      {/* Hero Section: Diferença clara entre Logado e Não Logado (RF01, RF02, RF03) */}
      <section className="origami-hero">
        <div className="origami-hero__paper-layers" aria-hidden="true">
          <div className="paper-fold-shape paper-fold-shape--1" />
          <div className="paper-fold-shape paper-fold-shape--2" />
        </div>

        <div className="origami-hero__content">
          <div className="origami-pill-banner">
            <Sparkles size={15} />
            <span>CATÁLOGO DE MICRORGANISMOS · ARTE EM DOBRADURA</span>
          </div>

          {!user ? (
            <>
              <h1 className="origami-hero__title">
                Banco de Cepas{' '}
                <span className="text-gradient-vibrant">Origami BioBank</span>
              </h1>
              <p className="origami-hero__subtitle">
                Explore nossa coleção certificada de microrganismos de referência (
                <em>Escherichia coli</em>, levedura <em>Saccharomyces cerevisiae</em>,{' '}
                <em>Penicillium chrysogenum</em> e <em>Lactobacillus</em>) representados
                em dobraduras geométricas vibrantes. Crie sua conta de pesquisador para
                requisitar ampolas criopreservadas para o seu experimento.
              </p>

              <div className="origami-hero__actions">
                <Link to="/cadastro" className="paper-btn paper-btn--vibrant paper-btn--lg">
                  Criar conta
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="paper-btn paper-btn--outline-light paper-btn--lg">
                  Já tenho conta
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="logged-welcome-banner" data-testid="welcome-banner">
                <h1 className="origami-hero__title">Olá, {user.nome}!</h1>
                <p className="origami-hero__subtitle">
                  Bem-vindo(a) ao painel do pesquisador do <strong>Origami BioBank</strong>.
                  Você já realizou{' '}
                  <strong className="highlight-count">
                    {totalRequisicoes} requisição(ões)
                  </strong>{' '}
                  de cepas para experimentos laboratoriais.
                </p>
              </div>

              <div className="origami-hero__actions">
                <Link to="/requisitar" className="paper-btn paper-btn--vibrant paper-btn--lg">
                  <FlaskConical size={18} />
                  Requisitar cepa para experimento
                </Link>
                <Link to="/perfil" className="paper-btn paper-btn--outline-light paper-btn--lg">
                  Meu Perfil
                </Link>
                {user.tipo === 'admin' && (
                  <Link to="/admin" className="paper-btn paper-btn--amber paper-btn--lg">
                    <ShieldCheck size={18} />
                    Área do Administrador
                  </Link>
                )}
              </div>
            </>
          )}

          <div className="origami-hero__stats">
            <div className="origami-stat-card">
              <span className="origami-stat-card__num">ATCC®</span>
              <span className="origami-stat-card__label">Lotes Rastreados</span>
            </div>
            <div className="origami-stat-card">
              <span className="origami-stat-card__num">NB-1</span>
              <span className="origami-stat-card__label">Biossegurança Nível 1</span>
            </div>
            <div className="origami-stat-card">
              <span className="origami-stat-card__num">-80 °C</span>
              <span className="origami-stat-card__label">Criopreservação Glicerol</span>
            </div>
          </div>
        </div>

        {/* Vitrine artística Paper Craft dos 3 microrganismos principais */}
        <div className="origami-hero__showcase">
          <div className="showcase-origami-trio">
            <div className="showcase-origami-item showcase-origami-item--primary">
              <MicrobeOrigamiArt slug="e-coli" size="md" />
              <span className="showcase-origami-caption">E. coli K-12</span>
            </div>
            <div className="showcase-origami-item showcase-origami-item--secondary">
              <MicrobeOrigamiArt slug="s-cerevisiae" size="sm" />
              <span className="showcase-origami-caption">Levedura S288C</span>
            </div>
            <div className="showcase-origami-item showcase-origami-item--tertiary">
              <MicrobeOrigamiArt slug="penicillium" size="sm" />
              <span className="showcase-origami-caption">Penicillium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo de Cepas como Cards Paper Design */}
      <section className="catalog-section" aria-labelledby="catalog-heading">
        <div className="catalog-section__header">
          <div>
            <span className="section-eyebrow">
              <Layers size={14} /> ACERVO BIOLÓGICO DISPONÍVEL
            </span>
            <h2 id="catalog-heading" className="section-title">
              Catálogo de Cepas Microbiológicas
            </h2>
          </div>

          <div className="catalog-filters" role="group" aria-label="Filtrar por grupo">
            {['Todas', 'Bactéria', 'Levedura', 'Fungo'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltroCategoria(cat)}
                className={`filter-chip ${filtroCategoria === cat ? 'is-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="cepas-grid">
          {cepasFiltradas.map((cepa) => (
            <CepaOrigamiCard key={cepa.id} cepa={cepa} user={user} />
          ))}
        </div>
      </section>
    </div>
  )
}
