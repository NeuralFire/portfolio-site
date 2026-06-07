const narrativeSections = [
  {
    label: 'Professional narrative',
    title: 'Data science, data engineering, and AI applications built for delivery',
    copy:
      'My recent work centers on building production-minded data systems: analytics APIs, ETL workflows, SQL-backed platforms, machine learning pipelines, and applied AI tools that solve operational problems instead of stopping at experimentation.',
  },
  {
    label: 'Career positioning',
    title: 'From domain-heavy research environments to broadly useful data and ML systems',
    copy:
      'A Ph.D. and years of scientific work built strong habits around data quality, experimentation, and ambiguity. The core value now is translating those skills into scalable software, reliable data models, and AI-enabled applications for business and product teams.',
  },
  {
    label: 'Engineering philosophy',
    title: 'Build systems that are measurable, maintainable, and useful to decision-makers',
    copy:
      'I prioritize clean interfaces, reliable ingestion boundaries, automated validation, and clear output layers so teams can trust the data, understand the system, and extend it without rebuilding from scratch.',
  },
]

const principles = [
  'Start with the data contract: schema clarity reduces downstream model and reporting issues.',
  'Automate validation early so bad inputs fail before they spread through the pipeline.',
  'Connect models to usable workflows, not isolated notebooks or one-off experiments.',
  'Keep delivery grounded in measurable outcomes, maintainability, and stakeholder needs.',
]

function AboutPage() {
  return (
    <div className="page-stack">
      <section className="surface-panel animate-fade-in-up">
        <div className="section-head">
          <div>
            <p className="section-kicker">About</p>
            <h1 className="page-title">Technical lead focused on data platforms, analytics systems, and applied AI delivery.</h1>
          </div>
          <p className="page-lead">This page frames the portfolio for teams hiring into data science, data engineering, ML engineering, and AI application roles.</p>
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
            <h3 className="card-title">Work backward from business constraints, data realities, and end-user needs</h3>
            <p className="surface-copy">
              The pattern is consistent across projects: understand the raw data and operational bottleneck first, then shape the storage model, processing logic, API surface, and model workflow around what users actually need to do.
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