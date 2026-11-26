/**
 * Admin: login em /orcamentos/ sem box_costs crash; slug abre projecto;
 * totais ao vivo ao escrever preço; API só em /orcamentos/api/...
 *
 * Uso: node playwright-admin-slug-totais.mjs <base> <adminCode> [slug]
 */
import { chromium } from "playwright";

const base = (process.argv[2] || "http://127.0.0.1:8765").replace(/\/$/, "");
const adminCode = process.argv[3];
const preferSlug = process.argv[4] || "";

if (!adminCode) {
  console.error("Uso: node playwright-admin-slug-totais.mjs <base> <adminCode> [slug]");
  process.exit(2);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const apiHits = [];
  const badHits = [];

  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    const u = r.url();
    if (!u.includes("/orcamentos")) return;
    if (/\/orcamentos\/api\//.test(u)) {
      apiHits.push(u);
      return;
    }
    if (/\/orcamentos\/[^/]+\/api\//.test(u)) badHits.push(u);
  });

  await page.goto(`${base}/orcamentos/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#gate-code", { timeout: 15000 });
  await page.fill("#gate-code", adminCode);
  await page.click("#gate-submit");
  await page.waitForSelector("#view-app:not(.hidden)", { timeout: 15000 });
  await page.waitForTimeout(600);

  const mainAfterLogin = await page.locator("#main-panel").innerText();
  assert(
    !/Cannot read properties of null/i.test(mainAfterLogin),
    "painel após login: TypeError null.box_costs\n" + mainAfterLogin.slice(0, 400)
  );
  assert(
    !errors.some((e) => /box_costs|Cannot read properties of null/i.test(e)),
    "pageerror após login: " + errors.join(" | ")
  );
  console.log("OK  admin /orcamentos/ sem crash box_costs");

  // Abrir projecto pela lista (SPA) — depois confirmar reload pelo slug
  let slug = preferSlug;
  if (!slug) {
    const link = page.locator("a.home-open").first();
    await link.waitFor({ timeout: 10000 });
    const href = await link.getAttribute("href");
    const m = String(href || "").match(/\/orcamentos\/([^/?#]+)/);
    slug = m ? decodeURIComponent(m[1]) : "";
  }
  assert(slug, "nenhum projecto/slug para abrir");

  await page.goto(`${base}/orcamentos/${encodeURIComponent(slug)}/`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("#view-app:not(.hidden)", { timeout: 15000 });
  await page.waitForFunction(() => {
    const main = document.getElementById("main-panel");
    const t = (main && main.innerText) || "";
    const gate = document.getElementById("gate-err");
    const ge = (gate && gate.innerText) || "";
    if (/serviço ainda não está configurado/i.test(ge) || /serviço ainda não está configurado/i.test(t)) {
      return false;
    }
    return /Resumo|Caixas|Custos|Painéis|Ferragens|unidade|Totais/i.test(t);
  }, { timeout: 25000 });

  const chip = await page.locator("#role-chip").innerText();
  assert(/admin|controlo/i.test(chip), "slug não abriu sessão admin: " + chip);
  console.log(`OK  slug /orcamentos/${slug}/ abre projecto com sessão admin`);

  const live = page.locator("#grand-totals-live");
  await live.waitFor({ timeout: 10000 });
  const before = (await live.innerText()).replace(/\s+/g, " ").trim();

  const priceInp = page.locator(
    'input[data-ed*="unit_price_eur"], input[data-ed*="per_unit_eur"], input.a-definir-input'
  ).first();
  await priceInp.waitFor({ timeout: 10000 });
  await priceInp.click({ clickCount: 3 });
  await priceInp.fill("");
  await priceInp.type("1234.56", { delay: 25 });
  await page.waitForTimeout(500);

  const after = (await live.innerText()).replace(/\s+/g, " ").trim();
  assert(after !== before, `totais não mudaram ao vivo\nantes: ${before}\ndepois: ${after}`);
  console.log("OK  totais ao vivo actualizam ao escrever preço (sem guardar)");

  assert(badHits.length === 0, "fetch relativo sob slug: " + badHits.join(", "));
  assert(
    apiHits.some((u) => /\/orcamentos\/api\/me\.php/.test(u)),
    "me.php não foi pedido em /orcamentos/api/"
  );
  console.log("OK  todos os pedidos API em /orcamentos/api/…");
  console.log("Todos os cenários Playwright (admin/slug/totais) passaram.");
} catch (e) {
  console.error("FAIL", e.message || e);
  if (errors.length) console.error("pageerrors:", errors.join(" | "));
  process.exit(1);
} finally {
  await browser.close();
}
