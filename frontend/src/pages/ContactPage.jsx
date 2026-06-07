import { useEffect, useState } from 'react'
import { apiClient, getErrorMessage } from '../lib/api.js'

const contactLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/dpalmer9',
    note: 'Code, experiments, and implementation history.',
    icon: GitHubIcon,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/daniel-palmer-39306a85',
    note: 'Professional background and current focus areas.',
    icon: LinkedInIcon,
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:daniel.palmer321@gmail.com',
    note: 'Direct outreach for data, platform, ML, or AI application work.',
    icon: MailIcon,
    external: false,
  },
]

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isDirty = Object.values(form).some((v) => v !== '')

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const { data } = await apiClient.post('/contact', form)
      setSuccessMessage(data.detail)
      setForm(initialForm)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="surface-panel contact-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Contact</p>
            <h2 className="page-title">A direct contact surface for hiring teams, collaborators, and project inquiries.</h2>
          </div>
          <p className="page-lead">Use the profile links for portfolio review, or send a message for data platform, machine learning, or AI application discussions.</p>
        </div>

        <div className="contact-layout">
          <article className="contact-card surface-subpanel">
            <p className="small-label">Connect</p>
            <h3 className="card-title">Minimal by design, practical in use</h3>
            <p className="surface-copy">
              Use the direct links for profile review, or send a note below for roles and projects involving data science, analytics engineering, machine learning, or applied AI.
            </p>

            <div className="contact-icon-grid">
              {contactLinks.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.label}
                    className="contact-icon-card"
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                  >
                    <span className="contact-icon-wrap" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="contact-link-copy">
                      <strong>{item.label}</strong>
                      <span>{item.note}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </article>

          <section className="resume-section contact-form-panel">
            <div className="section-head compact">
              <div>
                <p className="small-label">Message form</p>
                <h3 className="card-title">Send a direct note</h3>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <label className="form-field">
                  <span className="small-label">Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    minLength={2}
                    placeholder="e.g. Jane Doe…"
                  />
                </label>

                <label className="form-field">
                  <span className="small-label">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    placeholder="e.g. you@example.com…"
                    spellCheck={false}
                  />
                </label>
              </div>

              <label className="form-field">
                <span className="small-label">Subject</span>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  maxLength={160}
                  placeholder="What would you like to discuss?"
                />
              </label>

              <label className="form-field">
                <span className="small-label">Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  minLength={20}
                  rows={7}
                  placeholder="Share the project, timeline, or question you have in mind."
                />
              </label>

              <div className="contact-form-footer">
                <button className="button-link contact-submit" type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
                <p
                  className={successMessage ? 'contact-status success' : error ? 'contact-status error' : 'contact-status'}
                  role="status"
                  aria-live="polite"
                >
                  {successMessage || error}
                </p>
              </div>
            </form>
          </section>
        </div>
      </section>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3  -.3 6.1-1.5 6.1-6.7A5.2 5.2 0 0 0 19 4.8 4.8 4.8 0 0 0 18.9 1S17.7.7 15 2.6a13.4 13.4 0 0 0-6 0C6.3.7 5.1 1 5.1 1A4.8 4.8 0 0 0 5 4.8a5.2 5.2 0 0 0-1.2 3.6c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 9 18.1V22" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  )
}

export default ContactPage