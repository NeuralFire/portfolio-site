const links = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    note: 'Code samples, experiments, and repository history.',
    category: 'Code',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/daniel-palmer-39306a85',
    note: 'Professional profile, recommendations, and recent work.',
    category: 'Career',
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com',
    note: 'Publications, citations, and research-adjacent work.',
    category: 'Research',
  },
  {
    label: 'Open Source Projects',
    href: 'https://github.com/explore',
    note: 'Pinned repositories, experiments, and contribution trails.',
    category: 'Portfolio',
  },
]

function LinksPage() {
  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Links</p>
            <h2 className="page-title">Compact profile directory tuned for mobile scanability and quick outbound navigation.</h2>
          </div>
          <p className="page-lead">Cards are structured so final profile handles can be swapped later without changing layout or interaction patterns.</p>
        </div>

        <div className="link-grid">
          {links.map((item) => (
            <a key={item.label} className="link-card" href={item.href} target="_blank" rel="noreferrer">
              <div className="info-row">
                <p className="small-label">{item.category}</p>
                <span className="pill">External</span>
              </div>
              <h3 className="card-title">{item.label}</h3>
              <p className="card-copy">{item.note}</p>
              <p className="link-url">{new URL(item.href).hostname}</p>
            </a>
          ))}
        </div>

        <article className="surface-subpanel compact-panel">
          <p className="small-label">Usage note</p>
          <p className="surface-copy">
            Replace placeholder destinations with personal handles when final profile URLs are ready. Card structure, spacing, and tap targets already support production use.
          </p>
        </article>
      </section>
    </div>
  )
}

export default LinksPage