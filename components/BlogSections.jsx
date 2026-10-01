import postsData from "../public/data/blog-posts.json"

export function loadBlogPosts() {
  return Array.isArray(postsData.posts) ? postsData.posts : []
}

export function BlogIndex() {
  const posts = loadBlogPosts()
  return (
    <div className="pimo-blog-index">
      <p className="pimo-lead pimo-blog-intro">
        Artigos sobre carpintaria, materiais, fabrico e o ecossistema PIMO.{" "}
        <a className="pimo-blog-rss" href="/blog/rss.xml" title="Feed RSS">
          <span className="pimo-blog-rss-icon" aria-hidden="true">
            RSS
          </span>
          <span className="sr-only">Subscrever o feed RSS</span>
        </a>
      </p>
      {!posts.length ? (
        <p>Em breve publicaremos novos artigos neste espaço.</p>
      ) : (
        <ul className="pimo-blog-list">
          {posts.map((p) => (
            <li key={p.slug} className="pimo-blog-card">
              {p.coverImage ? (
                <a href={p.href} className="pimo-blog-cover">
                  <img
                    src={p.coverImage}
                    alt={p.imageAlt || p.title}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={360}
                  />
                </a>
              ) : null}
              <div>
                <p className="pimo-blog-meta">
                  <time dateTime={p.date}>{p.date}</time>
                  {p.category ? <> · {p.category}</> : null}
                  {p.author ? <> · {p.author}</> : null}
                </p>
                <h2>
                  <a href={p.href}>{p.title}</a>
                </h2>
                <p>{p.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function BlogPostHeader({ slug }) {
  const post = loadBlogPosts().find((p) => p.slug === slug)
  if (!post) return null
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.lastUpdated || post.date,
    author: { "@type": "Person", name: post.author },
    image: post.coverImage ? `https://pimo.info${post.coverImage}` : undefined,
    mainEntityOfPage: `https://pimo.info${post.href}`,
  }
  return (
    <div className="pimo-blog-header">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {post.coverImage ? (
        <figure className="pimo-blog-cover-figure">
          <img
            src={post.coverImage}
            alt={post.imageAlt || post.title}
            loading="eager"
            decoding="async"
            width={960}
            height={540}
          />
          {post.coverCredit ? <figcaption>{post.coverCredit}</figcaption> : null}
        </figure>
      ) : null}
      <p className="pimo-blog-meta">
        <time dateTime={post.date}>{post.date}</time> · {post.author}
        {post.category ? <> · {post.category}</> : null}
      </p>
      {post.tags?.length ? (
        <p className="pimo-blog-tags">
          {post.tags.map((t) => (
            <span key={t} className="pimo-blog-tag">
              {t}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  )
}

export function BlogPostSources({ slug }) {
  const post = loadBlogPosts().find((p) => p.slug === slug)
  if (!post?.sources?.length) return null
  return (
    <section className="pimo-blog-sources">
      <h2>Fontes</h2>
      <ul>
        {post.sources.map((s) => (
          <li key={s.url || s.title}>
            <a href={s.url} rel="noopener noreferrer">
              {s.title || s.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** @deprecated use BlogPostHeader + BlogPostSources */
export function BlogPostExtras({ slug }) {
  return (
    <>
      <BlogPostHeader slug={slug} />
      <BlogPostSources slug={slug} />
    </>
  )
}
