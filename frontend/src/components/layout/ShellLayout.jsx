import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
  { to: '/blog', label: 'Blog' },
  { to: '/links', label: 'Links' },
]

function ShellLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            DP
          </div>
          <div className="brand-copy">
            <span className="eyebrow">Data Engineering Portfolio</span>
            <h1 className="brand-title">Analytics systems, product thinking, shipped end to end.</h1>
          </div>
        </div>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content-shell">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-copy">
          React front end on top of FastAPI services, routed for portfolio storytelling and data product demos.
        </p>
        <div className="footer-links">
          <a className="footer-link" href="mailto:hello@example.com">
            Contact
          </a>
          <a className="footer-link" href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="footer-link" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  )
}

export default ShellLayout