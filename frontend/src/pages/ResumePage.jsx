function ResumePage() {
  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Resume</p>
            <h2 className="page-title">Readable CV layout, ready for static asset handoff.</h2>
          </div>
          <a className="resume-download" href="/resume.pdf" target="_blank" rel="noreferrer">
            Download PDF
          </a>
        </div>

        <div className="resume-grid">
          <article className="resume-block">
            <p className="small-label">Recent focus</p>
            <h3 className="resume-role">Data engineering and analytics platform delivery</h3>
            <p className="resume-copy">
              Building pipelines, service layers, and frontend surfaces that expose operational and analytical value with
              low cognitive overhead.
            </p>
          </article>
          <article className="resume-block">
            <p className="small-label">Strengths</p>
            <div className="chip-row">
              <span className="chip">FastAPI</span>
              <span className="chip">React</span>
              <span className="chip">SQL</span>
              <span className="chip">ETL</span>
              <span className="chip">Data Modeling</span>
              <span className="chip">Visualization</span>
            </div>
          </article>
          <article className="resume-block">
            <p className="small-label">Next phase</p>
            <p className="resume-copy">
              Replace scaffold copy with role history, quantified impact, and downloadable resume asset in public/.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

export default ResumePage