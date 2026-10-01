#!/usr/bin/env node
/**
 * Ping IndexNow with every <loc> from public/sitemap.xml (or out/sitemap.xml).
 * Never exits non-zero — deploy workflows must not fail on ping errors.
 */
const fs = require("fs")
const path = require("path")
const https = require("https")

const ROOT = path.resolve(__dirname, "..")
const KEY = "104c4da0b7e8ee57576280ba6dba4feb"
const HOST = "pimo.info"
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = "https://api.indexnow.org/indexnow"

function readSitemapUrls() {
  const candidates = [
    path.join(ROOT, "out", "sitemap.xml"),
    path.join(ROOT, "public", "sitemap.xml"),
  ]
  const file = candidates.find((p) => fs.existsSync(p))
  if (!file) {
    throw new Error("sitemap.xml not found in out/ or public/")
  }
  const xml = fs.readFileSync(file, "utf8")
  const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((m) => m[1].trim())
  return { file, urls: [...new Set(urls)] }
}

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body)
    const u = new URL(url)
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => {
          data += chunk
        })
        res.on("end", () => {
          resolve({ status: res.statusCode || 0, body: data })
        })
      }
    )
    req.on("error", reject)
    req.setTimeout(30000, () => {
      req.destroy(new Error("IndexNow request timed out"))
    })
    req.write(payload)
    req.end()
  })
}

async function main() {
  try {
    const { file, urls } = readSitemapUrls()
    if (!urls.length) {
      console.warn(`IndexNow: no URLs in ${file}`)
      return
    }

    // IndexNow accepts up to 10_000 URLs per request.
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }

    console.log(`IndexNow: submitting ${urls.length} URLs from ${path.relative(ROOT, file)}`)
    console.log(`IndexNow: keyLocation=${KEY_LOCATION}`)

    const res = await postJson(ENDPOINT, payload)
    console.log(`IndexNow: HTTP ${res.status}`)
    if (res.body) {
      console.log(`IndexNow: response ${res.body.slice(0, 500)}`)
    }
    if (res.status >= 200 && res.status < 300) {
      console.log("IndexNow: ping accepted")
    } else {
      console.warn(`IndexNow: non-success status ${res.status} (ignored)`)
    }
  } catch (err) {
    console.warn(`IndexNow: ping failed (ignored): ${err instanceof Error ? err.message : err}`)
  }
}

main()
