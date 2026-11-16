import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  listarCepas,
  registrarRequisicaoCepa,
  listarUltimasRequisicoes
} from '../lib/db'
import { MicrobeOrigamiArt } from '../components/MicrobeOrigamiArt'
import { FlaskConical, History, CheckCircle2, AlertCircle, PackageCheck } from 'lucide-react'

export function RequisitarPage({ user }) {
  const [searchParams] = useSearchParams()
  const [cepas, setCepas] = useState([])
  const [cepaId, setCepaId] = useState(searchParams.get('cepa') || '')
  const [quantidade, setQuantidade] = useState('1')
  const [finalidade, setFinalidade] = useState('Ensaio microbiológico em bancada')
  const [ultimas, setUltimas] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const carregarDados = async () => {
    const [listaCepas, listaReqs] = await Promise.all([
      listarCepas(),
      listarUltimasRequisicoes(user.id)
    ])
    setCepas(listaCepas)
    setUltimas(listaReqs)
  }

  useEffect(() => {
    carregarDados()
  }, [user.id])

  const cepaSelecionada = cepas.find((c) => String(c.id) === String(cepaId))

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setFeedback(null)
    setEnviando(true)

    try {
      const res = await registrarRequisicaoCepa(user.id, {
        cepaId,
        quantidade,
        finalidade
      })
      if (!res.ok) {
        setFeedback({ type: 'error', text: res.error })
      } else {
        setFeedback({ type: 'success', text: res.message })
        await carregarDados()
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="page-container">
      <div className="section-header-banner">
        <span className="section-eyebrow">TELA DE EXECUÇÃO · RETIRADA CRIOPRESERVADA</span>
        <h1 className="section-title">Requisitar Cepa para Experimento</h1>
        <p className="section-desc">
          Selecione a linhagem microbiológica desejada, informe a quantidade de ampolas e
          registre a requisição com baixa automática no estoque do biorrepositório.
        </p>
      </div>

      {/* Mini Seletor de Cards Origami */}
      <div className="requisitar-mini-cards" role="region" aria-label="Seleção rápida de cepas">
        {cepas.map((c) => {
          const isSelected = String(c.id) === String(cepaId)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCepaId(String(c.id))}
              className={`mini-origami-selector ${isSelected ? 'is-selected' : ''}`}
            >
              <MicrobeOrigamiArt slug={c.slug} size="sm" />
              <div className="mini-origami-selector__info">
                <strong>{c.nome_cientifico}</strong>
                <span>
                  {c.codigo_atcc} · R$ {Number(c.preco).toFixed(2).replace('.', ',')}
                </span>
                <span className="mini-stock-pill">Estoque: {c.estoque} ampola(s)</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="requisitar-grid">
        {/* Formulário de Requisição (RF16, RF17) */}
        <section className="origami-paper-card">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--emerald">
              <FlaskConical size={22} />
            </div>
            <div>
              <h2>Nova requisição de cepa</h2>
              <p>Preencha a linhagem e o número de ampolas para o experimento.</p>
            </div>
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

          <form onSubmit={handleConfirmar} noValidate className="origami-form">
            <div className="form-field">
              <label htmlFor="select-cepa">Cepa de microrganismo</label>
              <select
                id="select-cepa"
                name="cepa_id"
                value={cepaId}
                onChange={(e) => setCepaId(e.target.value)}
              >
                <option value="">Selecione</option>
                {cepas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome_cientifico} ({c.codigo_atcc}) — R${' '}
                    {Number(c.preco).toFixed(2).replace('.', ',')} ({c.estoque} em estoque)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="input-quantidade">Quantidade de ampolas</label>
              <input
                id="input-quantidade"
                name="quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="input-finalidade">Finalidade do experimento</label>
              <input
                id="input-finalidade"
                name="finalidade"
                type="text"
                placeholder="Ex.: Curva de crescimento em caldo LB"
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
              />
            </div>

            {cepaSelecionada && Number(quantidade) > 0 && (
              <div className="requisicao-preview-box">
                <div>
                  <span>Linhagem selecionada:</span>
                  <strong>{cepaSelecionada.nome_cientifico}</strong>
                </div>
                <div>
                  <span>Taxa total estimada:</span>
                  <strong>
                    R${' '}
                    {(Number(cepaSelecionada.preco) * Number(quantidade))
                      .toFixed(2)
                      .replace('.', ',')}
                  </strong>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="paper-btn paper-btn--vibrant paper-btn--full"
            >
              {enviando ? 'Processando requisição...' : 'Confirmar requisição'}
            </button>
          </form>
        </section>

        {/* Últimas 5 requisições do usuário (RF18) */}
        <section className="origami-paper-card">
          <div className="origami-card-header">
            <div className="origami-icon-box origami-icon-box--amber">
              <History size={22} />
            </div>
            <div>
              <h2>Minhas últimas requisições</h2>
              <p>Exibindo as últimas 5 requisições registradas na sua conta.</p>
            </div>
          </div>

          {ultimas.length === 0 ? (
            <div className="empty-state-box">
              <PackageCheck size={34} />
              <p>Você ainda não registrou nenhuma requisição de cepa.</p>
            </div>
          ) : (
            <ul className="requisicoes-history-list">
              {ultimas.map((req) => (
                <li key={req.id} className="requisicao-history-item">
                  <div className="requisicao-history-item__main">
                    <span className="req-id-badge">Requisição #{req.id}</span>
                    <strong>
                      {req.quantidade} x {req.cepas?.nome_cientifico || 'Cepa'}
                    </strong>
                    <span className="req-purpose">{req.finalidade}</span>
                  </div>
                  <div className="requisicao-history-item__meta">
                    <strong className="req-total">
                      R$ {Number(req.total).toFixed(2).replace('.', ',')}
                    </strong>
                    <span className="req-atcc">{req.cepas?.codigo_atcc}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
