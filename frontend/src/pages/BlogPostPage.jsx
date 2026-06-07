import { Children, isValidElement, useCallback } from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Allow KaTeX-generated span class names and aria attributes
    span: [...(defaultSchema.attributes?.span ?? []), 'className', 'style', 'aria-hidden'],
    math: ['xmlns', 'display'],
    semantics: [],
    mrow: [], mfrac: [], msup: [], msub: [], msubsup: [], mn: [], mi: [], mo: [],
    mtext: [], mspace: ['width'], mtable: [], mtr: [], mtd: [], mover: [], munder: [],
    munderover: [], annotation: ['encoding'],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'math', 'semantics', 'mrow', 'mfrac', 'msup', 'msub', 'msubsup',
    'mn', 'mi', 'mo', 'mtext', 'mspace', 'mtable', 'mtr', 'mtd',
    'mover', 'munder', 'munderover', 'annotation',
  ],
}
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

function BlogPostPage() {
  const { postId } = useParams()
  const numericPostId = Number.parseInt(postId ?? '', 10)

  const requestPost = useCallback(async ({ client, signal }) => {
    if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
      throw new Error('Invalid blog post id.')
    }

    const response = await client.get(`/blog/${numericPostId}`, { signal })
    return response.data
  }, [numericPostId])

  const { data: post, loading, error } = useApi(requestPost)

  return (
    <div className="page-stack">
      <section className="surface-panel editorial-feed-shell animate-fade-in-up">
        {loading ? <StatusMessage title="Loading article" copy="Fetching markdown detail." /> : null}
        {error ? <StatusMessage title="Article unavailable" copy={error} error /> : null}

        {!loading && !error && post ? (
          <article className="blog-detail editorial-article">
            <div className="editorial-article-head">
              <div className="editorial-back-row">
                <Link className="ghost-link editorial-link" to="/blog" aria-label="Back to all editorial feed articles">
                  ← Back to blog
                </Link>
              </div>
              <div>
                <p className="small-label">Essay #{post.id} • {calculateReadingTime(post.content)}</p>
                <h1 className="card-title editorial-article-title">{post.title}</h1>
              </div>
              <p className="page-lead editorial-article-date">Published {formatDate(post.publish_date)}</p>
            </div>
            <div className="chip-row editorial-chip-row">
              {post.tags.map((tag) => (
                <span key={tag} className="chip editorial-chip">
                  {tag}
                </span>
              ))}
            </div>
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex, [rehypeSanitize, sanitizeSchema]]}
                components={{ pre: MarkdownPre }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
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

function MarkdownPre({ children, ...props }) {
  const child = Children.toArray(children)[0]
  const language = getCodeLanguage(child)

  return (
    <div className="markdown-code-block">
      <span className="markdown-code-language">{language}</span>
      <pre {...props}>{children}</pre>
    </div>
  )
}

function getCodeLanguage(child) {
  if (!isValidElement(child)) {
    return 'text'
  }

  const className = typeof child.props.className === 'string' ? child.props.className : ''
  const match = className.match(/language-([\w-]+)/)

  return match?.[1] ?? 'text'
}

function calculateReadingTime(content) {
  if (!content) return '1 min read'
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200) // 200 words per minute average
  return `${minutes} min read`
}

export default BlogPostPage