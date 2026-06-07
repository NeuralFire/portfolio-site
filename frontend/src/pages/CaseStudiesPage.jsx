import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import CaseStudyMetaSidebar from '../components/CaseStudyMetaSidebar.jsx'
import CaseStudyPlot from '../components/CaseStudyPlot.jsx'
import { useApi } from '../hooks/useApi.js'

function CaseStudiesPage() {
  const requestCaseStudies = useCallback(async ({ client, signal }) => {
    const response = await client.get('/casestudies', { signal })
    return response.data
  }, [])

  const { data, loading, error } = useApi(
    requestCaseStudies,
    { initialData: [] },
  )

  const featuredStudy = data[0] ?? null

  return (
    <div className="page-stack">
      <section className="surface-panel animate-fade-in-up">
        <div className="section-head">
          <div>
            <p className="section-kicker">Case studies</p>
            <h1 className="page-title">Selected delivery stories across data platforms, analytics systems, and AI-enabled products.</h1>
          </div>
          <p className="page-lead">A proof-of-work surface for hiring teams and stakeholders who want architecture context, implementation detail, and practical outcomes in one pass.</p>
        </div>

        {loading ? <StatusMessage title="Loading case studies" copy="Fetching project cards." /> : null}
        {error ? <StatusMessage title="Case studies unavailable" copy={error} error /> : null}

        {!loading && !error ? (
          <div className="case-study-shell">
            <div className="case-study-main-column">
              {data.length > 0 ? (
                <>
                  <div className="summary-grid case-study-summary-grid">
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

                  {data.map((item) => (
                    <article key={item.id} className="story-card case-study-proof-card">
                      <div className="info-row">
                        <span className="small-label">{formatDate(item.date)}</span>
                        <span className="chip">{item.tech_stack.length} tools</span>
                      </div>

                      <div className="case-study-proof-head">
                        <div>
                          <h3 className="card-title">{item.title}</h3>
                          <p className="card-copy">{item.summary}</p>
                        </div>

                        {item.impact_metric ? (
                          <div className="case-study-inline-impact">
                            <p className="small-label">Impact metric</p>
                            <strong>{item.impact_metric.label}</strong>
                            <p className="case-study-impact-value">{item.impact_metric.value}</p>
                          </div>
                        ) : null}
                      </div>

                      {item.visualization ? (
                        <div className="case-study-visual-frame">
                          <div className="case-study-chart-copy">
                            <p className="small-label">Static visualization</p>
                            <h4 className="card-title case-study-chart-title">{item.visualization.title}</h4>
                            {item.visualization.subtitle ? (
                              <p className="card-copy">{item.visualization.subtitle}</p>
                            ) : null}
                          </div>
                          <CaseStudyPlot visualization={item.visualization} />
                        </div>
                      ) : null}

                      <div className="divider" />

                      <div className="star-list">
                        {buildStarItems(item).map((entry) => (
                          <div key={entry.label} className="star-item">
                            <p className="star-label">{entry.label}</p>
                            <p className="card-copy">{entry.copy}</p>
                          </div>
                        ))}
                      </div>

                      <div className="case-study-proof-footer">
                        <div className="chip-row">
                          {item.tech_stack.map((tool) => (
                            <span key={tool} className="chip">
                              {tool}
                            </span>
                          ))}
                        </div>
                        <Link className="ghost-link detail-link" to={`/case-studies/${item.id}`} aria-label={`Open case study: ${item.title}`}>
                          Open case study
                        </Link>
                      </div>
                    </article>
                  ))}
                </>
              ) : (
                <article className="empty-state">
                  <h3 className="card-title">No case studies seeded yet</h3>
                  <p className="card-copy">The proof-of-work layout is ready. Seed data will populate the asymmetrical grid, sticky metadata, and chart panels.</p>
                </article>
              )}
            </div>

            {featuredStudy ? (
              <aside className="case-study-sidebar">
                <CaseStudyMetaSidebar
                  caseStudy={featuredStudy}
                  heading="Featured delivery"
                  copy="The newest engagement anchors the sidebar so an enterprise reader can inspect the stack, the measurable gain, and the source links without leaving the list view."
                  relatedStudies={data}
                />
              </aside>
            ) : null}
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