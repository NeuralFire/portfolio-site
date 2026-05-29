import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page-stack not-found">
      <section className="surface-panel">
        <p className="section-kicker">404</p>
        <h2 className="page-title">Route not found.</h2>
        <p className="page-lead">Use primary navigation to return to portfolio sections.</p>
        <div className="hero-actions">
          <Link className="button-link" to="/">
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage