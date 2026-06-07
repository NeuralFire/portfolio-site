import { Children, isValidElement, useCallback, useState } from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Link, useParams } from 'react-router-dom'

import { useApi } from '../hooks/useApi.js'
import CaseStudyPlot from '../components/CaseStudyPlot.jsx'

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
                components={{
                  pre: MarkdownPre,
                  code: MarkdownCode,
                  img: MarkdownImg,
                }}
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

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  return (
    <button
      className={`code-copy-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      type="button"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function MarkdownCode({ className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const codeContent = String(children).replace(/\n$/, '')

  if (language === 'plotly') {
    let visualization = null
    let parseError = null

    try {
      visualization = JSON.parse(codeContent)
    } catch (err) {
      parseError = err.message
    }

    if (parseError) {
      return (
        <div className="plotly-parse-error">
          <strong>Failed to parse Plotly JSON:</strong> {parseError}
          <pre>{codeContent}</pre>
        </div>
      )
    }

    return <CaseStudyPlot visualization={visualization} />
  }

  const isBlock = className && className.startsWith('language-')

  if (isBlock) {
    return (
      <div className="syntax-highlight-wrap">
        <CopyButton text={codeContent} />
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          {...props}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

function MarkdownPre({ children, ...props }) {
  const child = Children.toArray(children)[0]
  if (child && isValidElement(child) && child.type === 'code') {
    const className = child.props.className || ''
    if (className.includes('language-plotly')) {
      return child
    }
  }

  const language = getCodeLanguage(child)

  return (
    <div className="markdown-code-block">
      <span className="markdown-code-language">{language}</span>
      <pre {...props}>{children}</pre>
    </div>
  )
}

function MarkdownImg({ src, alt, title, ...props }) {
  return (
    <figure className="markdown-figure">
      <img src={src} alt={alt || title || ''} {...props} />
      {(alt || title) ? <figcaption>{alt || title}</figcaption> : null}
    </figure>
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
