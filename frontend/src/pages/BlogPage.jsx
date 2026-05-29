import { useCallback } from 'react'
import { useApi } from '../hooks/useApi.js'

function BlogPage() {
  const requestPosts = useCallback(async ({ client, signal }) => {
    const response = await client.get('/api/blog', { signal })
    return response.data
  }, [])

  const { data, loading, error } = useApi(
    requestPosts,
    { initialData: [] },
  )

  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Blog</p>
            <h2 className="page-title">Technical writing feed connected to API summaries.</h2>
          </div>
          <p className="page-lead">Summary list route is live; post detail routes can layer in next without changing shell.</p>
        </div>

        {loading ? <StatusMessage title="Loading posts" copy="Fetching recent summaries." /> : null}
        {error ? <StatusMessage title="Blog unavailable" copy={error} error /> : null}

        {!loading && !error ? (
          <div className="blog-grid">
            {data.length > 0 ? (
              data.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-meta">
                    <span className="small-label">{formatDate(post.publish_date)}</span>
                    <span className="chip">Post #{post.id}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-summary">Markdown detail route can resolve against /api/blog/{'{id}'} next phase.</p>
                  <div className="chip-row">
                    {post.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <article className="empty-state">
                <h3 className="card-title">No posts yet</h3>
                <p className="card-copy">Backend summary endpoint is wired. Seed blog data to populate this feed.</p>
              </article>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

function StatusMessage({ title, copy, error = false }) {
  return (
    <div className={error ? 'status-card error' : 'status-card'}>
      {error ? null : <div className="spinner" aria-hidden="true" />}
      <h3 className="card-title">{title}</h3>
      <p className="status-copy">{copy}</p>
    </div>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default BlogPage