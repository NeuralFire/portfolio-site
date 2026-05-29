const links = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    note: 'Code samples, experiments, and repository history.',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    note: 'Professional profile, recommendations, and recent work.',
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com',
    note: 'Publications, citations, and research-adjacent work.',
  },
]

function LinksPage() {
  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Links</p>
            <h2 className="page-title">Compact external profile directory for mobile and desktop.</h2>
          </div>
          <p className="page-lead">Final URLs can be swapped in place without touching route structure.</p>
        </div>

        <div className="link-grid">
          {links.map((item) => (
            <a key={item.label} className="link-card" href={item.href} target="_blank" rel="noreferrer">
              <p className="small-label">External</p>
              <h3 className="card-title">{item.label}</h3>
              <p className="card-copy">{item.note}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default LinksPage