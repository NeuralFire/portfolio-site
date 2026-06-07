import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

function ShellLayout() {
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const storedPreference = window.localStorage.getItem('portfolio-theme')
    return storedPreference === 'light' || storedPreference === 'dark' ? storedPreference : null
  })
  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const nextResolvedTheme = themePreference === null
        ? (mediaQuery.matches ? 'dark' : 'light')
        : themePreference

      document.documentElement.dataset.theme = nextResolvedTheme
      document.documentElement.classList.toggle('dark', nextResolvedTheme === 'dark')
      document.documentElement.style.colorScheme = nextResolvedTheme
      setResolvedTheme(nextResolvedTheme)
    }

    applyTheme()

    if (themePreference === null) {
      window.localStorage.removeItem('portfolio-theme')
    } else {
      window.localStorage.setItem('portfolio-theme', themePreference)
    }

    mediaQuery.addEventListener('change', applyTheme)
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [themePreference])

  const nextThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark'
  const themeToggleLabel = resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <a className="skip-nav" href="#main-content">Skip to main content</a>
      <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            DP
          </div>
          <div className="brand-copy">
            <span className="eyebrow">Data Engineering Portfolio</span>
            <div className="brand-title">Analytics systems, product thinking, shipped end to end.</div>
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
          <button
            className="theme-toggle-compact"
            type="button"
            onClick={() => setThemePreference(nextThemePreference)}
            aria-label={`${themeToggleLabel}. ${themePreference === null ? 'Following your system preference by default.' : 'Theme preference is saved for future visits.'}`}
            title={themeToggleLabel}
          >
            <span aria-hidden="true">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>
        </nav>
      </header>

      <main className="content-shell" id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-copy">
          React front end on top of FastAPI services, routed for portfolio storytelling and data product demos.
        </p>
        <div className="footer-links">
          <NavLink className="footer-link" to="/contact">
            Contact
          </NavLink>
          <a className="footer-link" href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="footer-link" href="https://www.linkedin.com/in/daniel-palmer-39306a85" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
    </>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="M4.93 4.93l1.77 1.77" />
      <path d="M17.3 17.3l1.77 1.77" />
      <path d="M2.75 12h2.5" />
      <path d="M18.75 12h2.5" />
      <path d="M4.93 19.07l1.77-1.77" />
      <path d="M17.3 6.7l1.77-1.77" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.3 14.2A8.5 8.5 0 0 1 9.8 3.7a8.75 8.75 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

export default ShellLayout