import { Link } from 'react-router-dom'

function CaseStudyMetaSidebar({
  caseStudy,
  heading = 'Proof of work',
  copy = 'Sticky evidence designed for hiring managers who need the architecture, the tools, and the measurable outcome quickly.',
  relatedStudies = [],
}) {
  if (!caseStudy) {
    return null
  }

  const externalLinks = caseStudy.external_links ?? []

  return (
    <div className="case-study-sidebar-stack">
      <section className="surface-subpanel case-study-sidebar-panel">
        <div className="case-study-sidebar-copy">
          <p className="small-label">{heading}</p>
          <h3 className="card-title">Proof of work metadata</h3>
          <p className="card-copy">{copy}</p>
        </div>

        <div className="case-study-meta-group">
          <p className="star-label">Tech stack</p>
          <div className="case-study-tag-cloud">
            {caseStudy.tech_stack.map((tool) => (
              <span key={tool} className="case-study-tech-pill">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {caseStudy.impact_metric ? (
          <div className="case-study-impact-callout">
            <p className="small-label">Impact metric</p>
            <strong>{caseStudy.impact_metric.label}</strong>
            <p className="case-study-impact-value">{caseStudy.impact_metric.value}</p>
            {caseStudy.impact_metric.detail ? (
              <p className="card-copy">{caseStudy.impact_metric.detail}</p>
            ) : null}
          </div>
        ) : null}

        {externalLinks.length > 0 ? (
          <div className="case-study-meta-group">
            <p className="star-label">Repository / publication</p>
            <div className="case-study-link-list">
              {externalLinks.map((entry) => (
                <a
                  key={`${entry.label}-${entry.url}`}
                  className="ghost-link case-study-external-link"
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {entry.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {relatedStudies.length > 0 ? (
        <section className="surface-subpanel case-study-sidebar-panel">
          <p className="small-label">Case study index</p>
          <div className="case-study-related-list">
            {relatedStudies.map((study) => (
              <Link
                key={study.id}
                className={study.id === caseStudy.id ? 'case-study-related-link active' : 'case-study-related-link'}
                to={`/case-studies/${study.id}`}
              >
                <strong>{study.title}</strong>
                <span>{study.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default CaseStudyMetaSidebar