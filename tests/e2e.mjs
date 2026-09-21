/**
 * End-to-end checks against a running server.
 *   npm run build && npm start   (then)   npm run test:e2e
 * Uses the Chrome already installed on the machine — no browser download.
 */
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { test } from "node:test";

const BASE = process.env.E2E_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let browser;
const open = async (path = "/", viewport = { width: 1280, height: 900 }) => {
  browser ??= await chromium.launch({ executablePath: CHROME, args: ["--hide-scrollbars"] });
  const ctx = await browser.newContext({ viewport, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  return { page, ctx, errors };
};

test("the Bulgarian page renders without a script error", async () => {
  const { page, ctx, errors } = await open("/");
  assert.deepEqual(errors, []);
  assert.match(await page.title(), /Лапа/);
  assert.equal(await page.evaluate(() => document.documentElement.lang), "bg");
  await ctx.close();
});

test("the English page renders and switches the document language", async () => {
  const { page, ctx, errors } = await open("/en");
  assert.deepEqual(errors, []);
  assert.equal(await page.evaluate(() => document.documentElement.lang), "en");
  await ctx.close();
});

test("no section is left invisible after scrolling the whole page", async () => {
  const { page, ctx } = await open("/");
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(900);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal")].filter((el) => getComputedStyle(el).opacity === "0")
      .length
  );
  assert.equal(hidden, 0, `${hidden} revealed blocks stayed invisible`);
  await ctx.close();
});

test("the price calculator adds up and carries the choice into booking", async () => {
  const { page, ctx } = await open("/");
  await page.getByRole("button", { name: /Профилактичен преглед/ }).first().click();
  await page.getByRole("button", { name: /Ваксинация и паспорт/ }).first().click();
  const bar = page.locator("text=/^50 €$/").first();
  await bar.waitFor({ timeout: 4000 });
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(900);
  await assert.doesNotReject(page.getByRole("heading", { name: /За какво идвате/ }).waitFor({ timeout: 4000 }));
  await ctx.close();
});

test("booking runs end to end and hands over a calendar file", async () => {
  const { page, ctx } = await open("/");
  await page.getByRole("button", { name: /Профилактичен преглед/ }).first().click();
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Напред" }).click();
  await page.waitForTimeout(500);
  await page.locator("button:not([disabled])", { hasText: /^\d\d:\d\d$/ }).nth(1).click();
  await page.getByRole("button", { name: "Напред" }).click();
  await page.getByPlaceholder("Име и фамилия").fill("Иван Петров");
  await page.getByPlaceholder("08XX XXX XXX").fill("0888 123 456");
  await page.getByRole("button", { name: /Потвърдете часа/ }).click();
  await page.getByRole("heading", { name: /Часът е запазен/ }).waitFor({ timeout: 4000 });

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 8000 }),
    page.getByRole("button", { name: /Добавете в календара/ }).click(),
  ]);
  const fs = await import("node:fs");
  const ics = fs.readFileSync(await download.path(), "utf8");
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART;TZID=Europe\/Sofia:\d{8}T\d{6}/);
  assert.match(ics, /TRIGGER:-PT2H/);
  await ctx.close();
});

test("a time that has already passed cannot be selected", async () => {
  const { page, ctx } = await open("/");
  await page.getByRole("button", { name: /Профилактичен преглед/ }).first().click();
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Напред" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /днес/ }).first().click();
  await page.waitForTimeout(400);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const bookable = await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .filter((b) => /^\d\d:\d\d$/.test(b.textContent?.trim() ?? "") && !b.disabled)
      .map((b) => b.textContent.trim())
  );
  for (const time of bookable) {
    const min = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
    assert.ok(min > nowMin, `${time} is offered but has passed`);
  }
  await ctx.close();
});

test("the assistant answers in the language of the page", async () => {
  const { page, ctx } = await open("/en");
  await page.getByRole("button", { name: /Assistant/ }).click();
  await page.getByPlaceholder(/Type your question/).fill("how much is neutering a cat");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2200);
  const text = await page.locator(".pop-in").last().innerText();
  assert.match(text, /€/);
  assert.ok(!/[а-я]/.test(text), "Bulgarian text leaked into the English assistant");
  await ctx.close();
});

test("the language switch keeps the visitor on the site", async () => {
  const { page, ctx } = await open("/");
  await page.getByRole("link", { name: "EN" }).first().click();
  await page.waitForURL("**/en");
  assert.match(page.url(), /\/en$/);
  await ctx.close();
});

test.after(async () => {
  await browser?.close();
});
