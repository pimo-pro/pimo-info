#!/usr/bin/env node
/**
 * Gera public/blog/rss.xml a partir de pages/pt-pt/blog/posts/*.mdx
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const POSTS = path.join(ROOT, "pages", "pt-pt", "blog", "posts")
const OUT = path.join(ROOT, "public", "blog", "rss.xml")
const OUT_JSON = path.join(ROOT, "public", "data", "blog-posts.json")
const SITE = "https://pimo.info"

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, body: raw }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return { data: {}, body: raw }
  const yaml = raw.slice(3, end).trim()
  const body = raw.slice(end + 4)
  const data = {}
  let arrKey = null
  for (const line of yaml.split("\n")) {
    const indentedKey = line.match(/^\s{2,}(title|url):\s*(.*)$/)
    if (indentedKey && arrKey === "sources" && Array.isArray(data.sources) && data.sources.length) {
      const cur = data.sources[data.sources.length - 1]
      if (typeof cur === "object") {
        cur[indentedKey[1]] = indentedKey[2].replace(/^["']|["']$/g, "")
      }
      continue
    }
    if (/^\s+-\s+/.test(line) && arrKey) {
      const item = line.replace(/^\s+-\s+/, "").trim()
      if (arrKey === "sources") {
        if (item.startsWith("title:") || item.startsWith("url:")) {
          const m = item.match(/^(title|url):\s*(.*)$/)
          if (!data[arrKey].length || (data[arrKey][data[arrKey].length - 1].title && data[arrKey][data[arrKey].length - 1].url && m[1] === "title")) {
            data[arrKey].push({})
          }
          const cur = data[arrKey][data[arrKey].length - 1]
          if (m) cur[m[1]] = m[2].replace(/^["']|["']$/g, "")
        } else {
          data[arrKey].push({ title: item.replace(/^["']|["']$/g, ""), url: "" })
        }
      } else {
        data[arrKey].push(item.replace(/^["']|["']$/g, ""))
      }
      continue
    }
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    arrKey = null
    const key = m[1]
    let val = m[2].trim()
    if (val === "" || val === "|" || val === ">") {
      arrKey = key
      data[key] = []
      continue
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      data[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
    } else if (val === "true" || val === "false") {
      data[key] = val === "true"
    } else {
      data[key] = val.replace(/^["']|["']$/g, "")
    }
  }
  return { data, body }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  if (!fs.existsSync(POSTS)) {
    fs.mkdirSync(POSTS, { recursive: true })
  }
  const files = fs
    .readdirSync(POSTS)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
  const posts = []
  for (const f of files) {
    const raw = fs.readFileSync(path.join(POSTS, f), "utf8")
    const { data } = parseFrontmatter(raw)
    if (data.draft === true) continue
    const slug = f.replace(/\.mdx?$/, "")
    posts.push({
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "1970-01-01",
      author: data.author || "Khaled",
      category: data.category || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage || data.image || "",
      coverCredit: data.coverCredit || data.imageCredit || "",
      imageAlt: data.imageAlt || data.title || slug,
      sources: Array.isArray(data.sources) ? data.sources : [],
      draft: data.draft === true,
      lastUpdated: data.lastUpdated || data.date || "",
      href: `/pt-pt/blog/posts/${slug}/`,
    })
  }
  posts.sort((a, b) => b.date.localeCompare(a.date))

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE}/pt-pt/blog/posts/${p.slug}/</link>
      <guid isPermaLink="true">${SITE}/pt-pt/blog/posts/${p.slug}/</guid>
      <pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
      <author>${escapeXml(p.author)}</author>
    </item>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PIMO Info · Blog</title>
    <link>${SITE}/pt-pt/blog/</link>
    <description>Artigos e novidades do ecossistema PIMO</description>
    <language>pt-PT</language>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
  fs.writeFileSync(OUT, xml, "utf8")
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true })
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        posts: posts.map((p) => ({
          slug: p.slug,
          href: p.href,
          title: p.title,
          description: p.description,
          date: p.date,
          author: p.author,
          category: p.category,
          tags: p.tags,
          coverImage: p.coverImage,
          coverCredit: p.coverCredit,
          imageAlt: p.imageAlt,
          sources: p.sources,
          lastUpdated: p.lastUpdated,
        })),
      },
      null,
      2
    ) + "\n",
    "utf8"
  )
  console.log(`Blog RSS: ${posts.length} posts → public/blog/rss.xml + blog-posts.json`)
}

main()
