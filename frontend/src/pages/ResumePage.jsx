const experienceEntries = [
  {
    period: 'Recent',
    role: 'Senior data and application engineer',
    focus: 'Designed delivery flows that connected pipelines, APIs, dashboards, and stakeholder reporting into one maintainable product surface.',
  },
  {
    period: 'Prior',
    role: 'Analytics and platform builder',
    focus: 'Owned data modeling, warehouse optimization, and self-service reporting patterns used by operations and leadership teams.',
  },
  {
    period: 'Foundation',
    role: 'Technical problem solver across data and process domains',
    focus: 'Built credibility by translating ambiguous requirements into repeatable systems with clearer metrics, fewer manual steps, and lower latency.',
  },
]

const impactHighlights = [
  'Reduced reporting and decision latency by moving teams from batch workflows to API-backed experiences.',
  'Improved reliability with observable service boundaries, typed contracts, and simpler deployment paths.',
  'Balanced analytics depth with front-of-house usability so non-technical users could act on technical systems.',
]

const coreStack = ['FastAPI', 'React', 'SQL', 'Python', 'PostgreSQL', 'D3.js', 'ETL', 'Data Modeling']

function ResumePage() {
  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Resume</p>
            <h2 className="page-title">Readable CV layout built for scanning, selection, and direct download.</h2>
          </div>
          <a className="resume-download" href="/resume.pdf" target="_blank" rel="noreferrer" download>
            Download PDF
          </a>
        </div>

        <div className="resume-shell">
          <section className="resume-section resume-summary-panel">
            <p className="small-label">Profile</p>
            <h3 className="resume-role">Engineer focused on dependable data products and full-stack delivery</h3>
            <p className="resume-copy">
              Portfolio work emphasizes production-minded execution: strong API contracts, pragmatic frontend architecture,
              and data systems that support real decision making instead of one-off reporting.
            </p>
          </section>

          <section className="resume-section">
            <div className="section-head compact">
              <div>
                <p className="small-label">Experience</p>
                <h3 className="card-title">Selected trajectory</h3>
              </div>
            </div>
            <div className="timeline-list">
              {experienceEntries.map((entry) => (
                <article key={entry.role} className="timeline-item">
                  <p className="small-label">{entry.period}</p>
                  <h4 className="card-title">{entry.role}</h4>
                  <p className="resume-copy">{entry.focus}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="resume-section">
            <div className="section-head compact">
              <div>
                <p className="small-label">Impact</p>
                <h3 className="card-title">Delivery themes</h3>
              </div>
            </div>
            <ul className="inline-list principle-list">
              {impactHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="resume-section">
            <div className="section-head compact">
              <div>
                <p className="small-label">Core stack</p>
                <h3 className="card-title">Technologies used across API, data, and interface layers</h3>
              </div>
            </div>
            <div className="chip-row">
              {coreStack.map((item) => (
                <span key={item} className="chip">{item}</span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default ResumePage