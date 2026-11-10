#!/usr/bin/env node
/**
 * Gera o feed público de novidades (já filtrado) para o build estático.
 * - data/news-feed.json: import no React (sem filtros internos no bundle)
 * - public/data/news.json: fetch em runtime / ficheiro estático
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { getNewsData } from "../lib/news.js"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const DATA_OUT = path.join(ROOT, "data", "news-feed.json")
const PUBLIC_OUT = path.join(ROOT, "public", "data", "news.json")

const news = await getNewsData()
const payload = {
  source: news.source,
  fetchedAt: news.fetchedAt,
  entries: Array.isArray(news.entries) ? news.entries : [],
}
const body = `${JSON.stringify(payload, null, 2)}\n`

fs.mkdirSync(path.dirname(DATA_OUT), { recursive: true })
fs.mkdirSync(path.dirname(PUBLIC_OUT), { recursive: true })
fs.writeFileSync(DATA_OUT, body)
fs.writeFileSync(PUBLIC_OUT, body)
console.log(
  `News feed: ${payload.entries.length} entradas (${payload.source}) → data/news-feed.json + public/data/news.json`
)
