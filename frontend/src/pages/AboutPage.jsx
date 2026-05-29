const narrativeSections = [
  {
    label: 'Professional narrative',
    title: 'Data systems background with product delivery discipline',
    copy:
      'Work centers on turning noisy operational workflows into products teams can trust: reliable ingestion, measurable APIs, and interfaces that expose the right decision signal without extra ceremony.',
  },
  {
    label: 'Technical transition',
    title: 'From analytics execution to full-stack ownership',
    copy:
      'Earlier work emphasized modeling, ETL design, and stakeholder-facing analytics. The next layer was owning the service contracts, frontend routes, and deployment mechanics needed to ship complete systems end to end.',
  },
  {
    label: 'Engineering philosophy',
    title: 'Bias toward maintainable systems over clever demos',
    copy:
      'Prefer clear seams, strong defaults, and simple observability. Good software makes future edits cheaper, handoffs safer, and troubleshooting local instead of mysterious.',
  },
]

const principles = [
  'Design APIs around consumer workflows, not database tables.',
  'Keep state boundaries explicit so frontend and backend failures stay diagnosable.',
  'Document intent with structure: naming, schema contracts, and small components.',
  'Treat delivery quality as product quality: performance, resilience, and clarity count.',
]

function AboutPage() {
  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">About</p>
            <h2 className="page-title">Systems-minded engineer bridging data, software delivery, and product thinking.</h2>
          </div>
          <p className="page-lead">This page carries the professional story behind the portfolio: how technical depth, cross-functional communication, and shipping discipline fit together.</p>
        </div>

        <div className="resume-grid">
          {narrativeSections.map((section) => (
            <article key={section.label} className="resume-block">
              <p className="small-label">{section.label}</p>
              <h3 className="resume-role">{section.title}</h3>
              <p className="resume-copy">{section.copy}</p>
            </article>
          ))}
        </div>

        <div className="content-grid">
          <article className="surface-subpanel">
            <p className="small-label">Operating style</p>
            <h3 className="card-title">Work backward from business pressure, then simplify implementation</h3>
            <p className="surface-copy">
              Best delivery starts by isolating what needs to change for users or operators, then shaping data models,
              contracts, and UI states around that outcome. That keeps architecture honest and reduces waste in the build.
            </p>
          </article>
          <article className="surface-subpanel">
            <p className="small-label">Guiding principles</p>
            <ul className="inline-list principle-list">
              {principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}

export default AboutPage