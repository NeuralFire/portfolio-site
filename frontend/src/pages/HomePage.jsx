import { Link } from 'react-router-dom'
import DashboardMetricsChart from '../components/DashboardMetricsChart.jsx'

const KEY_TOKENS = ['Data Science', 'Data Engineering', 'AI Applications']

const HUB_CASE_STUDIES = [
  {
    id: 'analytics-platform',
    title: 'High-Throughput Analytics API',
    summary: 'Designed a React, FastAPI, and PostgreSQL platform for high-dimensional time series data with on-demand metric generation and flexible metadata.',
    impact: 'Turned complex behavioral datasets into a reusable analytics surface with faster access to metrics, summaries, and downstream application features.',
    domains: ['Data Engineering', 'Analytics Engineering'],
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'SQL'],
  },
  {
    id: 'historical-migration',
    title: 'Historical Data Migration Pipeline',
    summary: 'Engineered a Python ETL workflow to migrate 15 years of historical records from hundreds of fragmented Access databases into structured outputs.',
    impact: 'Improved data integrity and discoverability by pairing automated validation with fuzzy-matching workflows for inconsistent legacy metadata.',
    domains: ['Data Engineering', 'Data Quality'],
    techStack: ['Python', 'SQL', 'ETL', 'Data Validation', 'Fuzzy Matching'],
  },
  {
    id: 'edge-ai',
    title: 'Edge Vision Application',
    summary: 'Built Rust and Python tooling for Raspberry Pi Zero 2 devices that captures synchronized footage and runs live AI-assisted behavioral tracking with YOLO.',
    impact: 'Connected edge capture, automation, and inference into a deployable AI application rather than a standalone model demo.',
    domains: ['AI Applications', 'Machine Learning'],
    techStack: ['Rust', 'Python', 'YOLO', 'Raspberry Pi', 'Computer Vision'],
  },
]

const PRIMARY_PILLARS = [
  {
    eyebrow: 'Data platforms',
    title: 'Data Platforms',
    copy: 'I design ingestion, storage, transformation, and API layers that make messy operational data usable for analytics, reporting, and applications.',
    tags: ['FastAPI services', 'Schema design', 'ETL workflows'],
  },
  {
    eyebrow: 'ML and AI delivery',
    title: 'ML and AI Delivery',
    copy: 'I ship applied machine learning systems that connect model training, inference, validation, and product-facing workflows.',
    tags: ['Computer vision', 'Model integration', 'Inference pipelines'],
  },
  {
    eyebrow: 'Delivery leadership',
    title: 'Delivery Leadership',
    copy: 'I lead cross-functional work from problem framing through implementation, balancing technical depth with stakeholder communication and practical scope control.',
    tags: ['Technical leadership', 'Cross-functional delivery', 'Applied problem solving'],
  },
]

function HomePage() {
  const signalCounts = getSignalCounts(HUB_CASE_STUDIES)

  return (
    <div className="page-stack home-page">
      <section className="hero-panel hub-hero animate-fade-in-up">
        <div className="hero-copy hub-hero-copy">
          <span className="section-kicker">Data + AI Portfolio</span>
          <h1 className="hero-title hub-title">Building data platforms, machine learning workflows, and AI applications from complex real-world data.</h1>
          <p className="hero-body">
            I design and deliver systems that move from ingestion to modeling to usable product surfaces,
            with experience spanning analytics APIs, large-scale data migration, computer vision, and technical leadership.
          </p>
          
          <div className="hero-stats hub-token-row" aria-label="Key metrics">
            {KEY_TOKENS.map((token) => (
              <span className="pill hub-token" key={token}>
                {token}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link className="button-link" to="/case-studies">
              Browse case studies
            </Link>
            <Link className="ghost-link" to="/resume">
              View experience
            </Link>
          </div>

          <div className="hub-signal-grid" aria-label="Portfolio footprint metrics">
            <article className="surface-subpanel compact-panel hub-signal-card">
              <p className="small-label">Focus areas</p>
              <p className="metric-value">{signalCounts.domainCount}</p>
              <p className="card-copy">Connected areas spanning data engineering, analytics, machine learning, and AI-enabled applications.</p>
            </article>
            <article className="surface-subpanel compact-panel hub-signal-card">
              <p className="small-label">Featured projects</p>
              <p className="metric-value">{signalCounts.caseStudyCount}</p>
              <p className="card-copy">Representative delivery stories chosen to support data science, data engineering, and ML role conversations.</p>
            </article>
            <article className="surface-subpanel compact-panel hub-signal-card">
              <p className="small-label">Stack coverage</p>
              <p className="metric-value">{signalCounts.techCount}</p>
              <p className="card-copy">Tools spanning APIs, SQL, ETL, analytics, edge systems, and applied machine learning.</p>
            </article>
          </div>
        </div>

        <aside className="hero-aside hub-hero-visual">
          <DashboardMetricsChart caseStudies={HUB_CASE_STUDIES} />
        </aside>
      </section>

      <section className="surface-panel animate-fade-in-up delay-2">
        <div className="section-head">
          <div>
            <p className="section-kicker">Core strengths</p>
            <h3 className="section-title">Three pillars behind the portfolio</h3>
          </div>
          <p className="page-lead">A working scaffold for positioning around data roles: practical engineering depth, applied ML experience, and delivery ownership.</p>
        </div>

        <div className="summary-grid hub-pillars-grid">
          {PRIMARY_PILLARS.map((pillar) => (
            <article key={pillar.title} className="stat-card hub-pillar-card">
              <span className="metric-label">{pillar.eyebrow}</span>
              <h4 className="card-title">{pillar.title}</h4>
              <p className="surface-copy">{pillar.copy}</p>
              <div className="chip-row">
                {pillar.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function getSignalCounts(caseStudies) {
  return {
    domainCount: new Set(caseStudies.flatMap((study) => study.domains)).size,
    caseStudyCount: caseStudies.length,
    techCount: new Set(caseStudies.flatMap((study) => study.techStack)).size,
  }
}

export default HomePage