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
            <h2 className="page-title">Project narratives shaped for STAR storytelling.</h2>
          </div>
          <p className="page-lead">Route scaffold is live and already consuming backend collection endpoint.</p>
        </div>

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
                  <ul className="inline-list">
                    <li>Situation: {item.problem_statement ?? 'Placeholder content pending.'}</li>
                    <li>Action: {item.architecture ?? 'Architecture details pending.'}</li>
                    <li>Result: {item.impact ?? 'Impact statement pending.'}</li>
                  </ul>
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