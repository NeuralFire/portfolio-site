import { useState } from 'react'

const resumeCategories = {
  industry: {
    label: 'Data, Engineering & AI Delivery Experience',
    intro: 'Selected experience positioned for data science, data engineering, ML engineering, and AI applications roles.',
    entries: [
      {
        period: 'June 2024 - Present',
        role: 'Research Scientist III (Neuroinformatics Lead)',
        organization: 'Western University',
        summary: 'Lead a cross-disciplinary team building data pipelines, analytics systems, and AI-enabled tools for a large research platform.',
        highlights: [
          'Designed a high-throughput Python API to ingest, transform, and dynamically analyze event-driven time series data.',
          'Led delivery across data engineering, analytics, and application development workstreams with software engineers and researchers.',
          'Engineered AI pipelines for object detection, pose estimation, OCR, and document analysis to reduce manual effort and improve workflow speed.',
          'Supported next-generation platform work using React, FastAPI, and PostgreSQL for high-dimensional time series processing and metadata-driven analysis.',
        ],
      },
      {
        period: 'June 2022 - May 2024',
        role: 'Research Associate II (Behavioural Data Specialist)',
        organization: 'Western University',
        summary: 'Built data processing and analytical workflows for complex time series and imaging datasets.',
        highlights: [
          'Designed Python pipelines to filter, fit, and process discrete and continuous behavioral events alongside fluorescent imaging data.',
          'Architected custom R and Python analytical workflows to extract insight from heterogeneous data sources.',
          'Implemented batch-oriented processing that reduced analysis time from days to hours for longitudinal studies.',
        ],
      },
      {
        period: 'May 2017 - June 2022',
        role: 'Industrial Postdoctoral Fellow',
        organization: 'Western University',
        summary: 'Applied computer vision, Python software development, and experimental tooling to real-world behavioral technology problems.',
        highlights: [
          'Integrated convolutional neural networks including EfficientNet and MobileNet to support highly precise pose estimation workflows.',
          'Developed Python-based data pipelines for processing optical imaging data.',
          'Built software that combined model-assisted analysis with practical research and operational workflows.',
        ],
      },
    ],
  },
  academic: {
    label: 'Additional Foundation',
    intro: 'Earlier experience that strengthens the current data and AI profile through statistics, experimentation, technical communication, and domain depth.',
    entries: [
      {
        period: 'Technical projects',
        role: 'Selected Portfolio Projects',
        organization: 'Independent + Platform Work',
        summary: 'Project work demonstrates applied platform engineering, data migration, and AI application development beyond a single employer context.',
        highlights: [
          'MouseBytes v2: Architected a React, FastAPI, and PostgreSQL system for highly dimensional time series data with on-demand metric generation and flexible metadata.',
          'Historical Scientific Data Migration: Built a robust ETL pipeline to migrate 15 years of data from hundreds of distributed Access databases into structured outputs.',
          'OpenBehaviourCamera: Engineered Rust binaries and Python orchestration software for edge capture, synchronized hardware states, and live YOLO inference.',
        ],
      },
      {
        period: 'Teaching and communication',
        role: 'Statistics and Technical Communication',
        organization: 'University of Guelph and related academic roles',
        summary: 'Earlier academic roles built strong communication habits that continue to matter in delivery, documentation, and stakeholder alignment.',
        highlights: [
          'Taught introductory statistics and communicated quantitative concepts to non-specialist audiences.',
          'Produced research outputs, presentations, and cross-disciplinary documentation that translate technical detail into actionable decisions.',
          'Built strong fundamentals in experimental design, measurement, and analytical rigor that transfer well to product and platform work.',
        ],
      },
    ],
  },
}

const strengths = [
  'Python', 'SQL', 'FastAPI', 'React', 'PostgreSQL',
  'ETL', 'PyTorch', 'YOLO', 'Computer Vision',
  'Data Pipelines', 'R', 'Rust', 'Team Leadership'
]

const education = [
  {
    degree: 'Ph.D. in Behavioural Neuroscience',
    institution: 'University of Guelph',
    period: 'Completed',
  },
  {
    degree: 'M.Sc. in Psychology & Neuroscience',
    institution: 'University of Guelph',
    period: 'Completed',
  },
  {
    degree: 'B.A. in Psychology',
    institution: 'Western University',
    period: 'Completed',
  },
]

const certifications = [
  'Google AI Essentials Certificate',
  'Google Advanced Data Analytics / DeepMind AI Research (Expected 2026)',
]

const honors = [
  'Robarts Research Retreat Best Poster Presentation',
  'Neuroscience Research Day Best Poster Presentation',
  'MITACS Industrial Postdoctoral Fellowship Award',
]

const publications = [
  'Development of novel tasks for studying view-invariant object recognition in rodents: Sensitivity to scopolamine',
  'Continuous cholinergic-dopaminergic updating in the nucleus accumbens underlies approaches to reward-predicting cues',
  'MouseBytes, an open-access high-throughput pipeline and database for rodent touchscreen-based cognitive assessment',
  'Nonsymbolic numerical magnitude comparison: Reliability and validity of different task variants and outcome measures, and their relationship to arithmetic achievement in adults.',
  'Integrating optical neuroscience tools into touchscreen operant systems',
]

function ResumePage() {
  const [activeCategory, setActiveCategory] = useState('industry')
  const category = resumeCategories[activeCategory]
  const categoryKeys = Object.keys(resumeCategories)

  const handleKeyDown = (event, index) => {
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      nextIndex = (index + 1) % categoryKeys.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      nextIndex = (index - 1 + categoryKeys.length) % categoryKeys.length
    } else {
      return
    }

    const targetKey = categoryKeys[nextIndex]
    setActiveCategory(targetKey)

    // Focus the target tab button
    const buttons = event.currentTarget.parentElement.querySelectorAll('[role="tab"]')
    buttons[nextIndex]?.focus()
  }

  return (
    <div className="page-stack">
      <section className="surface-panel animate-fade-in-up">
        <div className="section-head">
          <div>
            <p className="section-kicker">Resume</p>
            <h1 className="page-title">Interactive resume view organized around data platforms, machine learning, and delivery leadership.</h1>
          </div>
          <div className="resume-actions no-print">
            <p className="page-lead resume-page-lead">Browse the web view for the role-focused summary, print the full CV, or view LinkedIn.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
              <button
                type="button"
                className="resume-download"
                onClick={() => window.print()}
                aria-label="Print or Save Resume as PDF"
              >
                Print Resume / PDF
              </button>
              <a className="ghost-link" href="https://www.linkedin.com/in/daniel-palmer-39306a85" target="_blank" rel="noreferrer" aria-label="View LinkedIn Profile in new tab">
                View LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        <div className="resume-shell">
          <section className="resume-section resume-summary-panel">
            <p className="small-label">Profile</p>
            <h3 className="resume-role">Data and AI technical lead with experience spanning ETL, analytics APIs, computer vision, and platform delivery</h3>
            <p className="resume-copy">
              Experience includes building production-minded data systems, migrating legacy datasets, designing SQL-backed application layers, and integrating machine learning into usable products and workflows.
            </p>
            <div className="chip-row">
              {strengths.map((item) => (
                <span key={item} className="chip">{item}</span>
              ))}
            </div>
          </section>

          <section className="resume-section no-print">
            <div className="section-head compact">
              <div>
                <p className="small-label">Resume view</p>
                <h3 className="card-title">Choose a lens</h3>
              </div>
            </div>
            <div className="resume-toggle-group" role="tablist" aria-label="Resume category selector">
              {Object.entries(resumeCategories).map(([key, value], index) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === key}
                  className={activeCategory === key ? 'resume-toggle active' : 'resume-toggle'}
                  onClick={() => setActiveCategory(key)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  <span className="small-label">Category</span>
                  <strong>{value.label}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="resume-section no-print">
            <div className="section-head compact">
              <div>
                <p className="small-label">Current view</p>
                <h3 className="card-title">{category.label}</h3>
              </div>
            </div>
            <p className="resume-copy">{category.intro}</p>
            <div className="timeline-list" key={activeCategory}>
              {category.entries.map((entry) => (
                <article key={`${activeCategory}-${entry.role}`} className="timeline-item resume-detail-card">
                  <div className="resume-entry-head">
                    <p className="small-label">{entry.period}</p>
                    <p className="resume-entry-org">{entry.organization}</p>
                  </div>
                  <h4 className="card-title">{entry.role}</h4>
                  <p className="resume-copy">{entry.summary}</p>
                  <ul className="inline-list principle-list">
                    {entry.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Print-only section containing full experience */}
          <div className="print-only">
            {Object.entries(resumeCategories).map(([catKey, catVal]) => (
              <section key={catKey} className="resume-section" style={{ marginBottom: '2rem' }}>
                <div className="section-head compact" style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
                  <h2 className="card-title" style={{ fontSize: '1.4rem' }}>{catVal.label}</h2>
                </div>
                <p className="resume-copy" style={{ marginBottom: '1.2rem', fontStyle: 'italic' }}>{catVal.intro}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {catVal.entries.map((entry) => (
                    <article key={`${catKey}-${entry.role}`} className="timeline-item resume-detail-card" style={{ border: 'none', padding: 0 }}>
                      <div className="resume-entry-head" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{entry.period}</strong>
                        <span style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{entry.organization}</span>
                      </div>
                      <h3 className="card-title" style={{ fontSize: '1.15rem', margin: '0.2rem 0' }}>{entry.role}</h3>
                      <p className="resume-copy" style={{ margin: '0.4rem 0' }}>{entry.summary}</p>
                      <ul className="inline-list principle-list" style={{ paddingLeft: '1.2rem', margin: '0.4rem 0' }}>
                        {entry.highlights.map((item) => (
                          <li key={item} style={{ marginBottom: '0.25rem' }}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="content-grid" style={{ marginTop: '2.5rem' }}>
            <section className="surface-subpanel">
              <p className="small-label">Education</p>
              <ul className="timeline-list" style={{ paddingLeft: 0, gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                {education.map((edu) => (
                  <li key={edu.degree} style={{ listStyle: 'none' }}>
                    <strong>{edu.degree}</strong>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{edu.institution} • {edu.period}</div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-subpanel">
              <p className="small-label">Certifications</p>
              <ul className="inline-list principle-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {certifications.map((cert) => (
                  <li key={cert}>{cert}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="content-grid" style={{ marginTop: '1.5rem' }}>
            <section className="surface-subpanel">
              <p className="small-label">Publications</p>
              <ul className="inline-list principle-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {publications.map((pub) => (
                  <li key={pub} style={{ fontStyle: 'italic' }}>{pub}</li>
                ))}
              </ul>
            </section>

            <section className="surface-subpanel">
              <p className="small-label">Honors & Awards</p>
              <ul className="inline-list principle-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {honors.map((award) => (
                  <li key={award}>{award}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResumePage