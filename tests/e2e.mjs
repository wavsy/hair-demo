/**
 * End-to-end checks against a running server.
 *   npm run build && npm start   (then)   npm run test:e2e
 * Uses a Chrome already on the machine — no browser download.
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

/** The four cards and the list they open — never the copy of it inside booking. */
const directions = (page) => page.locator("#napravleniya");
/** The panel that opens under the four cards, never the cards' own copy. */
const priceList = (page) => page.locator("#pricelist");
const bookingForm = (page) => page.locator("#chas");

/** Opens the hair price list and ticks the two cheapest lines. */
const pickTwoHairServices = async (page) => {
  await directions(page).getByRole("button", { name: /Коса/ }).first().click();
  await priceList(page).getByRole("button", { name: /Дамско подстригване/ }).click();
  await priceList(page).getByRole("button", { name: /Мъжко подстригване/ }).click();
};

test("the Bulgarian page renders without a script error", async () => {
  const { page, ctx, errors } = await open("/");
  assert.deepEqual(errors, []);
  assert.match(await page.title(), /ONDÉ/);
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
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll(".reveal")].filter((el) => getComputedStyle(el).opacity === "0")
        .length
  );
  assert.equal(hidden, 0, `${hidden} revealed blocks stayed invisible`);
  await ctx.close();
});

test("the price list stays shut until a direction is asked for", async () => {
  const { page, ctx } = await open("/");
  const row = priceList(page).getByRole("button", { name: /Официална прическа/ });
  assert.equal(await row.isVisible(), false, "the price list was open before anyone asked");
  await directions(page).getByRole("button", { name: /Коса/ }).first().click();
  await page.waitForTimeout(600);
  assert.ok(await row.isVisible(), "the price list did not open");
  await ctx.close();
});

test("only one direction's price list is open at a time", async () => {
  const { page, ctx } = await open("/");
  await directions(page).getByRole("button", { name: /Коса/ }).first().click();
  await page.waitForTimeout(500);
  await directions(page).getByRole("button", { name: /Нокти/ }).first().click();
  await page.waitForTimeout(600);
  assert.equal(
    await priceList(page).getByRole("button", { name: /Официална прическа/ }).isVisible(),
    false,
    "the hair list stayed open under the nails list"
  );
  assert.ok(await priceList(page).getByRole("button", { name: /Маникюр с гел лак/ }).isVisible());
  await ctx.close();
});

test("the calculator adds the chosen lines and carries them into booking", async () => {
  const { page, ctx } = await open("/");
  await pickTwoHairServices(page);
  // A range (20–28 €) plus a single price (8 €) still reads as one range.
  await directions(page).locator("text=/^28 – 36 €$/").first().waitFor({ timeout: 4000 });
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(900);
  await assert.doesNotReject(
    page.getByRole("heading", { name: /При кого/ }).waitFor({ timeout: 4000 })
  );
  await ctx.close();
});

test("booking runs end to end and hands over a calendar file", async () => {
  const { page, ctx } = await open("/");
  await pickTwoHairServices(page);
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(900);
  await bookingForm(page).getByRole("button", { name: "Напред" }).click();
  await page.waitForTimeout(600);
  await bookingForm(page).locator("button:not([disabled])", { hasText: /^\d\d:\d\d$/ }).nth(1).click();
  await bookingForm(page).getByRole("button", { name: "Напред" }).click();
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
  assert.match(ics, /SUMMARY:ONDÉ/);
  await ctx.close();
});

test("a time that has already passed cannot be selected", async () => {
  const { page, ctx } = await open("/");
  await pickTwoHairServices(page);
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(900);
  await bookingForm(page).getByRole("button", { name: "Напред" }).click();
  await page.waitForTimeout(600);
  const today = page.getByRole("button", { name: /днес/ }).first();
  if (await today.isEnabled()) {
    await today.click();
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
  }
  await ctx.close();
});

test("Sunday cannot be booked, because the salon is shut", async () => {
  const { page, ctx } = await open("/");
  await pickTwoHairServices(page);
  await page.getByRole("button", { name: /Запазете час за това/ }).click();
  await page.waitForTimeout(900);
  await bookingForm(page).getByRole("button", { name: "Напред" }).click();
  await page.waitForTimeout(600);
  const sundays = bookingForm(page).locator('button:has-text("нед")');
  const count = await sundays.count();
  assert.ok(count > 0, "no Sunday appeared in the twelve days on offer");
  for (let i = 0; i < count; i++) {
    assert.equal(await sundays.nth(i).isEnabled(), false, "a Sunday was bookable");
  }
  await ctx.close();
});

test('"book with" on a stylist carries that person into the form', async () => {
  const { page, ctx } = await open("/");
  await page.getByRole("button", { name: /Запазете час при Ирина/ }).click();
  await page.waitForTimeout(900);
  // Irina works colour, so booking opens on the colour list, not the hair one.
  await bookingForm(page).getByRole("button", { name: /Боядисване на корен/ }).click();
  await bookingForm(page).getByRole("button", { name: "Напред" }).click();
  await page.waitForTimeout(500);
  const hint = await page.locator("text=/Показваме само часовете/").first().innerText();
  assert.match(hint, /Ирина Вълчева/);
  await ctx.close();
});

test("a course can be enrolled in online, with a date and places left", async () => {
  const { page, ctx } = await open("/");
  const card = page.locator("#kursove article", { hasText: "Фризьорство" }).first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  assert.match(await card.innerText(), /остават \d+ мяст|места|Няма свободни места/);
  await card.getByRole("button", { name: /Запишете се/ }).click();
  await page.waitForTimeout(400);
  await card.getByPlaceholder("Име и фамилия").fill("Мария Иванова");
  await card.getByPlaceholder("08XX XXX XXX").fill("0888 222 333");
  await card.getByRole("button", { name: /Запишете се/ }).click();
  await page.waitForTimeout(600);
  assert.match(await card.innerText(), /Мястото е запазено/);
  await ctx.close();
});

test("the assistant answers in the language of the page", async () => {
  const { page, ctx } = await open("/en");
  await page.getByRole("button", { name: /Assistant/ }).click();
  await page.getByPlaceholder(/Type your question/).fill("how much is balayage");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2600);
  const text = await page.locator(".pop-in").last().innerText();
  assert.match(text, /€/);
  assert.ok(!/[а-я]/.test(text), "Bulgarian text leaked into the English assistant");
  await ctx.close();
});

test("the assistant names a stylist when asked who does the work", async () => {
  const { page, ctx } = await open("/");
  await page.getByRole("button", { name: /Асистент/ }).click();
  await page.getByPlaceholder(/Напишете въпроса/).fill("кой прави цвят");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2600);
  const text = await page.locator(".pop-in").last().innerText();
  assert.match(text, /Ирина Вълчева/);
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
