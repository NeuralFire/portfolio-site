import { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useApi } from '../hooks/useApi.js'

function BlogPage() {
  const [selectedPostId, setSelectedPostId] = useState(null)

  const requestPosts = useCallback(async ({ client, signal }) => {
    const response = await client.get('/api/blog', { signal })
    return response.data
  }, [])

  const { data: posts, loading, error } = useApi(
    requestPosts,
    { initialData: [] },
  )

  const requestPostDetail = useCallback(async ({ client, signal }) => {
    const postId = selectedPostId ?? posts[0]?.id

    if (!postId) {
      return null
    }

    const response = await client.get(`/api/blog/${postId}`, { signal })
    return response.data
  }, [posts, selectedPostId])

  const {
    data: selectedPost,
    loading: detailLoading,
    error: detailError,
    refetch: fetchSelectedPost,
  } = useApi(requestPostDetail, {
    initialData: null,
    immediate: false,
  })

  const activePostId = selectedPostId ?? posts[0]?.id ?? null

  useEffect(() => {
    if (!activePostId) {
      return
    }

    fetchSelectedPost().catch(() => null)
  }, [activePostId, fetchSelectedPost])

  return (
    <div className="page-stack">
      <section className="surface-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">Blog</p>
            <h2 className="page-title">Recent writing with API-fed summaries and markdown detail rendering.</h2>
          </div>
          <p className="page-lead">This route now pairs a summary feed with inline article reading, using the existing summary and detail endpoints.</p>
        </div>

        {loading ? <StatusMessage title="Loading posts" copy="Fetching recent summaries." /> : null}
        {error ? <StatusMessage title="Blog unavailable" copy={error} error /> : null}

        {!loading && !error ? (
          <div className="blog-layout">
            {posts.length > 0 ? (
              <>
                <div className="blog-feed">
                  {posts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      className={post.id === activePostId ? 'blog-feed-card active' : 'blog-feed-card'}
                      onClick={() => setSelectedPostId(post.id)}
                    >
                      <div className="blog-meta">
                        <span className="small-label">{formatDate(post.publish_date)}</span>
                        <span className="chip">Post #{post.id}</span>
                      </div>
                      <h3 className="blog-title">{post.title}</h3>
                      <p className="blog-summary">Select to read full markdown content from the blog detail endpoint.</p>
                      <div className="chip-row">
                        {post.tags.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
                <article className="blog-detail">
                  {detailLoading ? <StatusMessage title="Loading article" copy="Fetching markdown detail." /> : null}
                  {detailError ? <StatusMessage title="Article unavailable" copy={detailError} error /> : null}
                  {!detailLoading && !detailError && selectedPost ? (
                    <>
                      <div className="section-head compact">
                        <div>
                          <p className="small-label">Selected article</p>
                          <h3 className="card-title">{selectedPost.title}</h3>
                        </div>
                        <p className="page-lead">Published {formatDate(selectedPost.publish_date)}</p>
                      </div>
                      <div className="chip-row">
                        {selectedPost.tags.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="markdown-body">
                        <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                      </div>
                    </>
                  ) : null}
                </article>
              </>
            ) : (
              <article className="empty-state">
                <h3 className="card-title">No posts yet</h3>
                <p className="card-copy">Backend summary endpoint is wired. Seed blog data to populate this feed and the markdown reader.</p>
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