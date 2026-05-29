import { useCallback } from 'react'
import { useApi } from '../hooks/useApi.js'

function CaseStudiesPage() {
  const requestCaseStudies = useCallback(async ({ client, signal }) => {
    const response = await client.get('/api/casestudies', { signal })
    return response.data
  }, [])

  const { data, loading, error } = useApi(
    requestCaseStudies,
    { initialData: [] },
  )

  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Case studies</p>
            <h2 className="page-title">Project delivery stories framed around situation, task, action, and result.</h2>
          </div>
          <p className="page-lead">Backend-driven portfolio highlights focused on system design, decision making, and measurable outcomes.</p>
        </div>

        {!loading && !error && data.length > 0 ? (
          <div className="summary-grid">
            <article className="stat-card">
              <p className="small-label">Projects loaded</p>
              <p className="metric-value">{data.length}</p>
              <p className="card-copy">Case studies hydrate from the FastAPI collection endpoint.</p>
            </article>
            <article className="stat-card">
              <p className="small-label">Latest delivery</p>
              <p className="metric-value">{formatMonth(data[0].date)}</p>
              <p className="card-copy">Newest work stays pinned first via backend date ordering.</p>
            </article>
            <article className="stat-card">
              <p className="small-label">Core domains</p>
              <p className="metric-value">{countUniqueTools(data)}</p>
              <p className="card-copy">Distinct tools surfaced across API, data, infra, and visualization work.</p>
            </article>
          </div>
        ) : null}

        {loading ? <StatusMessage title="Loading case studies" copy="Fetching project cards." /> : null}
        {error ? <StatusMessage title="Case studies unavailable" copy={error} error /> : null}

        {!loading && !error ? (
          <div className="story-grid">
            {data.length > 0 ? (
              data.map((item) => (
                <article key={item.id} className="story-card">
                  <div className="info-row">
                    <span className="small-label">{formatDate(item.date)}</span>
                    <span className="chip">{item.tech_stack.length} tools</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-copy">{item.summary}</p>
                  <div className="divider" />
                  <div className="star-list">
                    {buildStarItems(item).map((entry) => (
                      <div key={entry.label} className="star-item">
                        <p className="star-label">{entry.label}</p>
                        <p className="card-copy">{entry.copy}</p>
                      </div>
                    ))}
                  </div>
                  <div className="chip-row">
                    {item.tech_stack.map((tool) => (
                      <span key={tool} className="chip">
                        {tool}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <article className="empty-state">
                <h3 className="card-title">No case studies seeded yet</h3>
                <p className="card-copy">Route, loading state, and error handling are in place. Seed data will populate this grid.</p>
              </article>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

function StatusMessage({ title, copy, error = false }) {
  return (
    <div className={error ? 'status-card error' : 'status-card'}>
      {error ? null : <div className="spinner" aria-hidden="true" />}
      <h3 className="card-title">{title}</h3>
      <p className="status-copy">{copy}</p>
    </div>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default CaseStudiesPage

function buildStarItems(item) {
  return [
    {
      label: 'Situation',
      copy: item.problem_statement ?? 'Portfolio problem statement will be added with live project context.',
    },
    {
      label: 'Task',
      copy: item.summary,
    },
    {
      label: 'Action',
      copy: item.architecture ?? 'Architecture notes will be expanded with implementation detail.',
    },
    {
      label: 'Result',
      copy: item.impact ?? 'Impact details will be expanded with quantified delivery outcomes.',
    },
  ]
}

function countUniqueTools(items) {
  return new Set(items.flatMap((item) => item.tech_stack)).size
}

function formatMonth(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(new Date(value))
}