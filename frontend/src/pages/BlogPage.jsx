import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

function BlogPage() {
  const requestPosts = useCallback(async ({ client, signal }) => {
    const response = await client.get('/blog', { signal })
    return response.data
  }, [])

  const { data: posts, loading, error } = useApi(
    requestPosts,
    { initialData: [] },
  )

  return (
    <div className="page-stack">
      <section className="surface-panel editorial-feed-shell animate-fade-in-up">
        <div className="editorial-header">
          <div>
            <p className="section-kicker">The Editorial Feed</p>
            <h1 className="page-title editorial-title">Notes on data platforms, applied machine learning, and AI product delivery.</h1>
          </div>
          <p className="page-lead editorial-lead">A centered, text-first archive for technical writing on ETL, analytics engineering, model integration, and real-world implementation tradeoffs.</p>
        </div>

        {loading ? <StatusMessage title="Loading posts" copy="Fetching recent summaries." /> : null}
        {error ? <StatusMessage title="Blog unavailable" copy={error} error /> : null}

        {!loading && !error ? (
          <div className="blog-feed editorial-feed">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="blog-feed-card blog-feed-card-static editorial-feed-item">
                  <div className="blog-meta editorial-meta">
                    <span className="small-label">{formatDate(post.publish_date)}</span>
                    <span className="editorial-divider" aria-hidden="true">/</span>
                    <span className="small-label">Essay #{post.id}</span>
                    <span className="editorial-divider" aria-hidden="true">/</span>
                    <span className="small-label">{getReadingTime(post)}</span>
                  </div>
                  <h3 className="blog-title editorial-post-title">{post.title}</h3>
                  <p className="blog-summary editorial-summary">{buildPreviewCopy(post)}</p>
                  <div className="chip-row editorial-chip-row">
                    {post.tags.map((tag) => (
                      <span key={tag} className="chip editorial-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link className="ghost-link detail-link editorial-link" to={`/blog/${post.id}`} aria-label={`Read article: ${post.title}`}>
                    Read the article
                  </Link>
                </article>
              ))
            ) : (
              <article className="empty-state editorial-empty-state">
                <h3 className="card-title">No posts yet</h3>
                <p className="card-copy">Backend summary endpoint is wired. Seed blog data to populate this feed and the article pages.</p>
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

function buildPreviewCopy(post) {
  if (post.tags.length === 0) {
    return 'A long-form editorial entry designed for careful reading, code excerpts, and mathematical argumentation.'
  }

  const topicalTags = post.tags.slice(0, 3).join(' / ')
  return `A text-first brief on ${topicalTags}, with the full article rendered from markdown on its dedicated route.`
}

function getReadingTime(post) {
  const readingTimes = {
    1: '4 min read',
    2: '5 min read',
    3: '3 min read',
  }
  return readingTimes[post.id] ?? '3 min read'
}

export default BlogPage