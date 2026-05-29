import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardMetricsChart from '../components/DashboardMetricsChart.jsx'
import { useApi } from '../hooks/useApi.js'

function HomePage() {
  const requestMetrics = useCallback(async ({ client, signal }) => {
    const response = await client.get('/api/dashboard/metrics', { signal })
    return response.data
  }, [])

  const { data, loading, error } = useApi(
    requestMetrics,
    { initialData: { series: [], summary: {}, generated_at: null } },
  )

  if (loading) {
    return <LoadingState title="Loading dashboard shell" copy="Pulling metric summaries from FastAPI." />
  }

  if (error) {
    return <ErrorState title="Dashboard unavailable" copy={error} />
  }

  const categories = Object.entries(data.summary)

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="section-kicker">Phase 5 dashboard surface</span>
          <h2 className="hero-title">Interactive portfolio telemetry, rendered with D3.</h2>
          <p className="hero-body">
            Landing page now binds FastAPI metrics into an interactive multi-line chart with responsive scaling,
            hover detail, and zoom controls to show product and data engineering signals over time.
          </p>
          <div className="hero-actions">
            <Link className="button-link" to="/case-studies">
              Browse case studies
            </Link>
            <Link className="ghost-link" to="/blog">
              Review blog feed
            </Link>
          </div>
        </div>

        <aside className="hero-aside">
          <div>
            <p className="small-label">Live backend status</p>
            <p className="hero-meta">Connected to dashboard metrics endpoint via configured API base URL.</p>
          </div>
          <div className="hero-stats">
            <span className="pill">{data.series.length} series</span>
            <span className="pill">{categories.length} categories</span>
            <span className="pill">Generated {formatDateTime(data.generated_at)}</span>
          </div>
        </aside>
      </section>

      <section className="surface-panel dashboard-panel">
        <DashboardMetricsChart series={data.series} generatedAt={data.generated_at} />
      </section>

      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Metric snapshot</p>
            <h3 className="section-title">Dashboard context cards</h3>
          </div>
          <p className="page-lead">Shared request state plus backend aggregates keep chart legend and KPI panels aligned.</p>
        </div>

        <div className="summary-grid">
          <article className="stat-card">
            <span className="metric-label">Series loaded</span>
            <strong className="metric-value">{data.series.length}</strong>
            <p className="surface-copy">Distinct metric streams available for future D3 visualizations.</p>
          </article>
          <article className="stat-card">
            <span className="metric-label">Categories tracked</span>
            <strong className="metric-value">{categories.length}</strong>
            <p className="surface-copy">Aggregated groups already shaped for cards, filters, and legends.</p>
          </article>
          <article className="stat-card">
            <span className="metric-label">Latest refresh</span>
            <strong className="metric-value">{formatTime(data.generated_at)}</strong>
            <p className="surface-copy">UTC timestamp emitted by FastAPI for dashboard synchronization.</p>
          </article>
        </div>
      </section>

      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Category rollup</p>
            <h3 className="section-title">Backend summary payload</h3>
          </div>
        </div>

        <div className="card-grid">
          {categories.length > 0 ? (
            categories.map(([category, summary]) => (
              <article key={category} className="story-card">
                <div className="info-row">
                  <span className="small-label">{category}</span>
                  <span className="chip">{summary.count} points</span>
                </div>
                <h4 className="card-title">Avg {summary.avg.toFixed(2)}</h4>
                <p className="card-copy">Min {summary.min.toFixed(2)} · Max {summary.max.toFixed(2)}</p>
              </article>
            ))
          ) : (
            <article className="empty-state">
              <h4 className="card-title">No metrics yet</h4>
              <p className="card-copy">Seed dashboard data to populate the landing-page KPI scaffolding.</p>
            </article>
          )}
        </div>
      </section>
    </div>
  )
}

function LoadingState({ title, copy }) {
  return (
    <section className="status-card">
      <div className="spinner" aria-hidden="true" />
      <h2 className="page-title">{title}</h2>
      <p className="status-copy">{copy}</p>
    </section>
  )
}

function ErrorState({ title, copy }) {
  return (
    <section className="status-card error">
      <p className="section-kicker">Request failed</p>
      <h2 className="page-title">{title}</h2>
      <p className="status-copy">{copy}</p>
    </section>
  )
}

function formatDateTime(value) {
  if (!value) {
    return 'pending'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function formatTime(value) {
  if (!value) {
    return '--:--'
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default HomePage