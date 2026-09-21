/**
 * Fetches the CC0 photographs the site expects.
 *
 *   node scripts/fetch-photos.mjs          — fill every empty slot
 *   node scripts/fetch-photos.mjs --force  — refetch slots that already exist
 *
 * Openverse, `license=cc0`, `source=stocksnap`, as decided in DECISIONS.md.
 * For each slot the best candidate lands in public/images/ and four
 * alternates land in public/images/_alt/, because roughly half of what comes
 * back is unusable and the choice has to be made by eye. Swapping one in is
 * then a single `mv`. Every file that lands is written up in CREDITS.md.
 *
 * Needs outbound access to api.openverse.org — a locked-down network will
 * refuse the request, and the script says so rather than writing half a file.
 */
import { mkdir, writeFile, readFile, access, readdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");
const ALT = join(OUT, "_alt");
const API = "https://api.openverse.org/v1/images/";
const CANDIDATES = 5;
/** Asked for per search: enough that dropping the already-used still leaves a choice. */
const PAGE = 24;

/**
 * One entry per photograph the site asks for.
 *
 * `qs` is a chain, narrowest first. Openverse ANDs the words together and
 * StockSnap is a small collection, so "hair salon woman" finds 2 pictures
 * while "hair" finds 240 — a single phrase either hits or leaves the slot
 * empty. Each query is tried in turn until one returns something usable.
 */
const SLOTS = [
  { file: "hero.jpg", qs: ["hair salon", "hairstyle", "hair"], note: "Hero — the room and the work" },
  { file: "salon.jpg", qs: ["salon", "barber", "mirror"], note: "Why ONDÉ — the room" },
  { file: "og.jpg", qs: ["haircut", "hairdresser", "hair"], note: "Open Graph card" },
  { file: "master-1.jpg", qs: ["hairdresser", "hairstylist", "hair"], note: "Irina — colour" },
  { file: "master-2.jpg", qs: ["haircut", "hairstyle", "hair"], note: "Boryana — cutting" },
  { file: "master-3.jpg", qs: ["barber", "barbershop", "beard"], note: "Daniel — barber" },
  { file: "master-4.jpg", qs: ["manicure", "nails"], note: "Niya — nails" },
  { file: "master-5.jpg", qs: ["makeup artist", "makeup"], note: "Elena — make-up and skin" },
  { file: "gallery-1.jpg", qs: ["blonde hair", "long hair", "hair"], note: "Balayage, long hair" },
  { file: "gallery-2.jpg", qs: ["haircut", "scissors", "hair"], note: "Women's cut" },
  { file: "gallery-3.jpg", qs: ["hair colour", "hair dye", "hair"], note: "Root colour" },
  { file: "gallery-4.jpg", qs: ["updo", "bride hair", "hairstyle"], note: "Occasion styling" },
  { file: "gallery-5.jpg", qs: ["gel nails", "nails"], note: "Gel polish manicure" },
  { file: "gallery-6.jpg", qs: ["salon chair", "mirror", "salon"], note: "The room" },
];

const force = process.argv.includes("--force");
const exists = (p) => access(p).then(() => true, () => false);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Openverse gives anonymous callers a handful of searches and then refuses;
 * filling fourteen slots needs more than that. A free key lifts the limit to
 * the standard model, and one is minted in a single POST:
 *
 *   curl -X POST https://api.openverse.org/v1/auth_tokens/register/ \
 *     -H 'Content-Type: application/json' \
 *     -d '{"name":"…","description":"…","email":"…"}'
 *
 * Put the pair it returns in .env.local — which is git-ignored, because a
 * client secret is not repository material. Without it the script still runs,
 * just slowly and only until the anonymous allowance runs out.
 */
async function readEnvFile() {
  const text = await readFile(join(ROOT, ".env.local"), "utf8").catch(() => "");
  for (const line of text.split("\n")) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

async function accessToken() {
  await readEnvFile();
  const id = process.env.OPENVERSE_CLIENT_ID;
  const secret = process.env.OPENVERSE_CLIENT_SECRET;
  if (!id || !secret) return null;
  const res = await fetch("https://api.openverse.org/v1/auth_tokens/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: id, client_secret: secret, grant_type: "client_credentials" }),
  });
  if (!res.ok) {
    console.warn(`  ключът не мина (${res.status}) — продължавам анонимно`);
    return null;
  }
  return (await res.json()).access_token ?? null;
}

const token = await accessToken();
console.log(token ? "Openverse: с ключ" : "Openverse: анонимно (лимитът е малък)");

/**
 * Openverse rate-limits anonymous callers, and a run that fills fourteen slots
 * is several searches deep. 401 and 429 both mean "too fast, come back" here,
 * so back off and try again rather than leaving the slot empty.
 */
async function search(query, attempt = 0) {
  const url = `${API}?${new URLSearchParams({
    q: query,
    license: "cc0",
    source: "stocksnap",
    page_size: String(PAGE),
    mature: "false",
  })}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (res.status === 429 || res.status === 401) {
    if (attempt >= 3) throw new Error(`Openverse kept answering ${res.status} for "${query}"`);
    const pause = 10_000 * 2 ** attempt;
    console.log(`  … ${res.status} on "${query}", waiting ${pause / 1000}s`);
    await wait(pause);
    return search(query, attempt + 1);
  }
  if (!res.ok) throw new Error(`Openverse answered ${res.status} for "${query}"`);
  const body = await res.json();
  return body.results ?? [];
}

/** Every picture already spoken for, so no two slots show the same face. */
const taken = new Set();

/**
 * Walks the slot's query chain and returns the first batch with something left in it.
 * Searches are spaced out on purpose: fourteen slots back to back is enough to
 * trip the anonymous rate limit, and waiting here is cheaper than backing off later.
 */
let lastSearch = 0;
async function candidatesFor(slot) {
  for (const q of slot.qs) {
    const since = Date.now() - lastSearch;
    if (since < (token ? 400 : 6000)) await wait((token ? 400 : 6000) - since);
    lastSearch = Date.now();
    const free = (await search(q)).filter((r) => !taken.has(r.id));
    if (free.length) return { q, results: free.slice(0, CANDIDATES) };
  }
  return { q: slot.qs.join(" / "), results: [] };
}

async function download(url, target) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} on ${url}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length < 8_000) throw new Error(`suspiciously small file from ${url}`);
  await writeFile(target, bytes);
  return bytes.length;
}

const credits = [];

for (const slot of SLOTS) {
  const target = join(OUT, slot.file);
  if (!force && (await exists(target))) {
    console.log(`· ${slot.file} — already here, skipping`);
    continue;
  }

  let results, q;
  try {
    ({ results, q } = await candidatesFor(slot));
  } catch (err) {
    console.error(`✗ ${slot.file} — ${err.message}`);
    continue;
  }
  if (!results.length) {
    console.error(`✗ ${slot.file} — nothing came back for "${q}"`);
    continue;
  }

  const stem = slot.file.replace(/\.jpg$/, "");
  await mkdir(ALT, { recursive: true });
  // Clear last run's alternates for this slot so the numbering stays truthful.
  for (const name of await readdir(ALT).catch(() => [])) {
    if (name.startsWith(`${stem}-`)) await rm(join(ALT, name));
  }

  let placed = false;
  for (const [i, r] of results.entries()) {
    const src = r.url ?? r.thumbnail;
    if (!src) continue;
    const dest = placed ? join(ALT, `${stem}-${i}.jpg`) : target;
    try {
      const size = await download(src, dest);
      // Alternates count as spoken for too: one of them may be swapped in by
      // hand later, and it must not already be someone else's face.
      taken.add(r.id);
      if (!placed) {
        placed = true;
        credits.push({ ...slot, r, size, q });
        console.log(`✓ ${slot.file} — ${r.title ?? "untitled"} (${Math.round(size / 1024)} KB)`);
      }
    } catch (err) {
      console.error(`  alternate ${i} failed: ${err.message}`);
    }
  }
  if (!placed) console.error(`✗ ${slot.file} — every candidate failed to download`);
}

if (credits.length) {
  const lines = [
    "# Снимки",
    "",
    "Всички снимки са CC0 (обществено достояние) от Openverse, източник StockSnap.",
    "Свалени с `npm run photos`. Алтернативите стоят в `public/images/_alt/`.",
    "",
    "| Файл | Къде стои | Заглавие | Автор | Източник |",
    "|---|---|---|---|---|",
    ...credits.map(
      (c) =>
        `| \`${c.file}\` | ${c.note} | ${c.r.title ?? "—"} | ${c.r.creator ?? "—"} | [Openverse](${
          c.r.foreign_landing_url ?? c.r.url
        }) |`
    ),
    "",
  ];
  await writeFile(join(OUT, "CREDITS.md"), lines.join("\n"));
  console.log(`\nCREDITS.md written for ${credits.length} photograph(s).`);
} else {
  console.log("\nNothing was placed. CREDITS.md left untouched.");
}
