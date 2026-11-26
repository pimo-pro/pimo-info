/**
 * Reproduz o bug Filipe em sessão limpa (Chromium).
 * Uso: node playwright-filipe.mjs http://127.0.0.1:8765 <token> <code>
 */
import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8765";
const token = process.argv[3];
const code = process.argv[4];

if (!token || !code) {
  console.error("Uso: node playwright-filipe.mjs <base> <token> <code>");
  process.exit(2);
}

async function assertReport(page, label) {
  await page.waitForSelector("#view-app:not(.hidden)", { timeout: 15000 });
  const chip = await page.locator("#role-chip").innerText();
  if (!/edi(ç|c)ão|filipe/i.test(chip) && chip.trim() === "") {
    throw new Error(`${label}: role chip vazio`);
  }
  // Esperar o relatório (não «Sem projecto» / «Sem dados»)
  await page.waitForFunction(() => {
    const main = document.getElementById("main-panel");
    if (!main) return false;
    const t = main.innerText || "";
    if (/Sem projecto|Sem dados|Erro ao carregar/i.test(t) && !/Resumo|Caixas|Custos/i.test(t)) {
      return false;
    }
    return /Resumo|Caixas|Custos|Painéis|Ferragens|Projecto|unidade/i.test(t);
  }, { timeout: 20000 });
  const mainText = await page.locator("#main-panel").innerText();
  if (/Sem projecto\.|Sem dados\./.test(mainText) && !/Resumo|Caixas/.test(mainText)) {
    throw new Error(`${label}: ainda Sem projecto/dados\n` + mainText.slice(0, 400));
  }
  console.log(`OK  ${label}: relatório visível (${mainText.slice(0, 60).replace(/\s+/g, " ")}…)`);
}

async function loginAndCheck(context, label) {
  const page = await context.newPage();
  const url = `${base}/orcamentos/?v=${encodeURIComponent(token)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#gate-code", { timeout: 10000 });
  await page.fill("#gate-code", code);
  await page.click("#gate-submit");
  await assertReport(page, `${label} após login`);
  await page.reload({ waitUntil: "domcontentloaded" });
  await assertReport(page, `${label} após reload`);
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  // 1ª abertura — contexto limpo
  const ctx1 = await browser.newContext();
  await loginAndCheck(ctx1, "1ª abertura");
  await ctx1.close();

  // 2ª abertura — novo contexto limpo (como «só abre uma vez»)
  const ctx2 = await browser.newContext();
  await loginAndCheck(ctx2, "2ª abertura");
  await ctx2.close();

  console.log("Todos os cenários Playwright passaram.");
} catch (e) {
  console.error("FAIL", e.message || e);
  process.exit(1);
} finally {
  await browser.close();
}
