/**
 * End-to-end checks against a running server.
 *   npm run build && npm start   (then)   npm run test:e2e
 * Uses a Chrome already on the machine — no browser download.
 *
 * Against the live site:  E2E_URL=https://… npm run test:e2e
 */
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { after, test } from "node:test";

const BASE = process.env.E2E_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let browser;
const open = async (path = "/", viewport = { width: 1280, height: 900 }) => {
  browser ??= await chromium.launch({ executablePath: CHROME, args: ["--hide-scrollbars"] });
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  return { page, ctx, errors };
};

after(async () => {
  await browser?.close();
});

const booking = (page) => page.locator("#chas");

/** Ticks the first `n` service lines on a master's page. */
const pickServices = async (page, n = 1) => {
  const lines = booking(page).locator("ul button");
  for (let i = 0; i < n; i++) await lines.nth(i).click();
};

/** Picks the first free hour that is offered. */
const pickFirstHour = async (page) => {
  const hour = booking(page)
    .locator("button")
    .filter({ hasText: /^\d\d:\d\d$/ })
    .first();
  await hour.click();
  return (await hour.textContent()).trim();
};

test("the home page is five faces and nothing else", async () => {
  const { page, ctx, errors } = await open("/");
  const faces = page.locator('section[aria-label] a[href^="/maistori/"]');
  assert.equal(await faces.count(), 5, "the home page should offer exactly five people");
  // No section rhythm: the salon's own words do not appear above the faces.
  assert.equal(await page.locator("main section").count(), 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test("clicking a face opens that person's page", async () => {
  const { page, ctx } = await open("/");
  await page.locator('a[href="/maistori/boryana"]').click();
  await page.waitForURL(/\/maistori\/boryana$/);
  await assert.doesNotReject(page.getByRole("heading", { name: "Боряна Митева" }).waitFor());
  await ctx.close();
});

test("a master is only offered the work they actually do", async () => {
  const { page, ctx } = await open("/maistori/irina");
  const menu = await booking(page).locator("ul button").allInnerTexts();
  assert.ok(menu.length > 0, "Irina offers nothing");
  for (const line of menu) {
    assert.doesNotMatch(
      line,
      /подстригване|прическа/i,
      `Irina says she does not cut, but is offered: ${line}`
    );
  }
  await ctx.close();
});

test("two masters do not show the same list", async () => {
  const a = await open("/maistori/irina");
  const irina = await booking(a.page).locator("ul button").allInnerTexts();
  await a.ctx.close();
  const b = await open("/maistori/daniel");
  const daniel = await booking(b.page).locator("ul button").allInnerTexts();
  await b.ctx.close();
  assert.notDeepEqual(irina, daniel, "every master is showing the whole salon's price list");
});

test("booking runs end to end on a master's own page", async () => {
  const { page, ctx, errors } = await open("/maistori/niya");
  await pickServices(page, 2);
  const hour = await pickFirstHour(page);
  assert.match(hour, /^\d\d:\d\d$/);

  await booking(page).getByPlaceholder("Име и фамилия").fill("Тест Тестов");
  await booking(page).getByPlaceholder("08XX XXX XXX").fill("0888 123 456");
  await booking(page).getByRole("button", { name: /Потвърдете часа/ }).click();

  await assert.doesNotReject(page.getByText("Часът е запазен.").waitFor({ timeout: 8000 }));
  const card = await booking(page).innerText();
  assert.ok(card.includes("Ния Стоянова"), "the confirmation does not name the master");
  assert.ok(card.includes(hour), "the confirmation does not carry the hour that was chosen");
  assert.deepEqual(errors, []);
  await ctx.close();
});

test("the running total appears only once something is chosen", async () => {
  const { page, ctx } = await open("/maistori/niya");
  // innerText applies text-transform, and the label is rendered in caps.
  assert.match(await booking(page).innerText(), /изберете поне едно нещо/i);
  await pickServices(page, 1);
  assert.match(await booking(page).innerText(), /\d+ €/);
  await ctx.close();
});

test("an hour that has already passed is never offered", async () => {
  const { page, ctx } = await open("/maistori/daniel");
  const today = booking(page).locator("button").filter({ hasText: /ДНЕС|днес/i }).first();
  if (await today.isEnabled().catch(() => false)) {
    await today.click();
    await page.waitForTimeout(500);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const hours = await booking(page)
      .locator("button")
      .filter({ hasText: /^\d\d:\d\d$/ })
      .allInnerTexts();
    for (const h of hours) {
      const min = Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
      assert.ok(min > nowMin, `${h} is offered but has already passed`);
    }
  }
  await ctx.close();
});

test("Sunday cannot be booked, because the salon is shut", async () => {
  const { page, ctx } = await open("/maistori/elena");
  const strip = booking(page).locator("button").filter({ hasText: /^(нед|ДНЕС|УТРЕ|[а-я]{2,4})\s*\d+$/i });
  const count = await strip.count();
  let checked = 0;
  for (let i = 0; i < count; i++) {
    const label = (await strip.nth(i).innerText()).toLowerCase();
    if (label.startsWith("нед")) {
      assert.ok(await strip.nth(i).isDisabled(), "Sunday is offered, but the salon is shut");
      checked++;
    }
  }
  assert.ok(checked > 0, "no Sunday appeared in the next twelve days");
  await ctx.close();
});

test("the language switch keeps you on the same person", async () => {
  const { page, ctx } = await open("/maistori/elena");
  await page.locator('header a[hreflang="en"]').click();
  await page.waitForURL(/\/en\/stylists\/elena$/);
  await assert.doesNotReject(page.getByRole("heading", { name: "Elena Georgieva" }).waitFor());
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await ctx.close();
});

test("a course can be enrolled in, with a date and places left", async () => {
  const { page, ctx, errors } = await open("/kursove");
  const body = await page.locator("main").innerText();
  assert.match(body, /остават \d+ мяст|Няма свободни места/);
  assert.match(body, /€/);
  await page.getByRole("button", { name: /Запишете се/ }).first().click();
  await page.waitForTimeout(400);
  // The panel that just opened. It carries a hook, because picking it out by
  // shape is brittle: the other cards still show their own "Запишете се".
  const panel = page.locator("[data-enrol]");
  await panel.getByPlaceholder("Име и фамилия").fill("Тест Тестов");
  await panel.getByPlaceholder("08XX XXX XXX").fill("0888 123 456");
  await panel.getByRole("button", { name: /Запишете се/ }).click();
  await assert.doesNotReject(page.getByText("Мястото е запазено.").waitFor({ timeout: 8000 }));
  assert.deepEqual(errors, []);
  await ctx.close();
});

test("the salon page carries the hours and a map that loads", async () => {
  const { page, ctx } = await open("/salona");
  const body = await page.locator("main").innerText();
  assert.match(body, /Понеделник/);
  assert.match(body, /почивен ден/);
  const map = page.locator("iframe");
  assert.equal(await map.count(), 1);
  assert.match(await map.getAttribute("src"), /openstreetmap\.org/);
  await ctx.close();
});

test("the QR page still points at the live address", async () => {
  const { page, ctx, errors } = await open("/qr");
  assert.match(await page.locator("body").innerText(), /onde-salon\.vercel\.app/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test("every page renders in English too", async () => {
  for (const path of ["/en", "/en/stylists/irina", "/en/courses", "/en/the-salon"]) {
    const { page, ctx, errors } = await open(path);
    assert.equal(await page.locator("html").getAttribute("lang"), "en", `${path} is not in English`);
    assert.deepEqual(errors, [], `${path} threw`);
    await ctx.close();
  }
});
