import React from 'react'
import { Link } from 'react-router-dom'
import { MicrobeOrigamiArt } from './MicrobeOrigamiArt'
import { Thermometer, TestTube2, ShieldAlert, ArrowUpRight } from 'lucide-react'

export function CepaOrigamiCard({ cepa, user, onSelectCepa }) {
  const precoFmt = Number(cepa.preco).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const accentClass =
    cepa.slug === 'e-coli'
      ? 'cepa-card--cyan'
      : cepa.slug === 's-cerevisiae'
      ? 'cepa-card--amber'
      : cepa.slug === 'penicillium'
      ? 'cepa-card--violet'
      : 'cepa-card--rose'

  return (
    <article className={`cepa-origami-card ${accentClass}`} data-testid={`cepa-card-${cepa.slug}`}>
      {/* Dobradura de canto superior direito */}
      <div className="cepa-origami-card__corner-fold" aria-hidden="true" />

      <div className="cepa-origami-card__top-meta">
        <span className="origami-badge origami-badge--atcc">{cepa.codigo_atcc}</span>
        <span className="origami-badge origami-badge--bsl">
          <ShieldAlert size={13} />
          {cepa.nivel_biosseguranca} · {cepa.categoria}
        </span>
      </div>

      <div className="cepa-origami-card__art-frame">
        <MicrobeOrigamiArt slug={cepa.slug} size="md" />
      </div>

      <div className="cepa-origami-card__body">
        <h3 className="cepa-origami-card__scientific">{cepa.nome_cientifico}</h3>
        <p className="cepa-origami-card__popular">{cepa.nome_popular}</p>
        <p className="cepa-origami-card__desc">{cepa.descricao}</p>

        <div className="cepa-origami-card__specs">
          <div className="cepa-spec-pill">
            <TestTube2 size={14} />
            <span>{cepa.meio_cultivo}</span>
          </div>
          <div className="cepa-spec-pill">
            <Thermometer size={14} />
            <span>Incubação: {cepa.temperatura_ideal}</span>
          </div>
        </div>

        <div className="cepa-origami-card__footer">
          <div className="cepa-origami-card__price-block">
            <span className="cepa-origami-card__price-label">Taxa de preparo / ampola</span>
            <strong className="cepa-origami-card__price-val">R$ {precoFmt}</strong>
          </div>

          <div className="cepa-origami-card__stock-block">
            <span
              className={`origami-stock-tag ${
                cepa.estoque <= 3 ? 'origami-stock-tag--low' : ''
              }`}
            >
              {cepa.estoque} ampola(s)
            </span>

            {user ? (
              onSelectCepa ? (
                <button
                  type="button"
                  className="paper-btn paper-btn--emerald paper-btn--xs"
                  onClick={() => onSelectCepa(cepa)}
                >
                  Selecionar
                </button>
              ) : (
                <Link
                  to={`/requisitar?cepa=${cepa.id}`}
                  className="paper-btn paper-btn--emerald paper-btn--xs"
                >
                  Requisitar <ArrowUpRight size={14} />
                </Link>
              )
            ) : (
              <Link
                to="/login"
                className="paper-btn paper-btn--outline-dark paper-btn--xs"
              >
                Requisitar
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
