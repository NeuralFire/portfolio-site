function AboutPage() {
  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">About</p>
            <h2 className="page-title">Systems-minded builder with data, product, and delivery range.</h2>
          </div>
          <p className="page-lead">Static route scaffold for professional narrative and engineering philosophy.</p>
        </div>

        <div className="resume-grid">
          <article className="resume-block">
            <p className="small-label">Narrative</p>
            <h3 className="resume-role">From pipeline design to product delivery</h3>
            <p className="resume-copy">
              Portfolio framework centers on turning ambiguous analytics work into observable systems, usable interfaces,
              and measurable business outcomes.
            </p>
          </article>
          <article className="resume-block">
            <p className="small-label">Operating style</p>
            <h3 className="resume-role">Architecture with clear ownership boundaries</h3>
            <p className="resume-copy">
              FastAPI services, typed payload contracts, and route-level UI composition keep backend and frontend work
              decoupled without hiding responsibility.
            </p>
          </article>
          <article className="resume-block">
            <p className="small-label">Philosophy</p>
            <h3 className="resume-role">Design for maintainers, not only demos</h3>
            <p className="resume-copy">
              App shell favors reusable patterns: shared layout, normalized request state, and route slices that can grow
              independently.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

export default AboutPage