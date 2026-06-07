import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import CaseStudyMetaSidebar from '../components/CaseStudyMetaSidebar.jsx'
import CaseStudyPlot from '../components/CaseStudyPlot.jsx'
import { useApi } from '../hooks/useApi.js'

function CaseStudyPage() {
  const { caseStudyId } = useParams()
  const numericCaseStudyId = Number.parseInt(caseStudyId ?? '', 10)

  const requestCaseStudy = useCallback(async ({ client, signal }) => {
    if (!Number.isInteger(numericCaseStudyId) || numericCaseStudyId <= 0) {
      throw new Error('Invalid case study id.')
    }

    const response = await client.get(`/casestudies/${numericCaseStudyId}`, { signal })
    return response.data
  }, [numericCaseStudyId])

  const { data: caseStudy, loading, error } = useApi(requestCaseStudy)

  return (
    <div className="page-stack">
      <section className="surface-panel animate-fade-in-up">
        <div className="section-head">
          <div>
            <p className="section-kicker">Case study detail</p>
            <h1 className="page-title">
              {caseStudy ? caseStudy.title : 'Delivery narrative with architecture, tradeoffs, and outcomes.'}
            </h1>
          </div>
          <Link className="ghost-link" to="/case-studies" aria-label="Back to all case studies">
            Back to case studies
          </Link>
        </div>

        {loading ? <StatusMessage title="Loading case study" copy="Fetching delivery detail." /> : null}
        {error ? <StatusMessage title="Case study unavailable" copy={error} error /> : null}

        {!loading && !error && caseStudy ? (
          <div className="case-study-shell case-study-detail-shell">
            <article className="blog-detail case-study-detail-card">
              <div className="section-head compact scroll-anchor-heading">
                <div>
                  <p className="small-label">Case study #{caseStudy.id}</p>
                  <h2 className="card-title">{caseStudy.title}</h2>
                </div>
                <p className="page-lead">Delivered {formatDate(caseStudy.date)}</p>
              </div>

              <p className="card-copy">{caseStudy.summary}</p>

              {caseStudy.visualization ? (
                <section className="case-study-visual-frame case-study-detail-visual">
                  <div className="case-study-chart-copy">
                    <p className="small-label">Static visualization</p>
                    <h4 className="card-title case-study-chart-title">{caseStudy.visualization.title}</h4>
                    {caseStudy.visualization.subtitle ? (
                      <p className="card-copy">{caseStudy.visualization.subtitle}</p>
                    ) : null}
                  </div>
                  <CaseStudyPlot visualization={caseStudy.visualization} />
                </section>
              ) : null}

              <div className="star-list">
                {buildStarItems(caseStudy).map((entry) => (
                  <div key={entry.label} className="star-item">
                    <p className="star-label">{entry.label}</p>
                    <p className="card-copy">{entry.copy}</p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="case-study-sidebar">
              <CaseStudyMetaSidebar caseStudy={caseStudy} />
            </aside>
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

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default CaseStudyPage