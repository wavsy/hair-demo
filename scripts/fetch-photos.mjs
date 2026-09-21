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
import { mkdir, writeFile, access, readdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");
const ALT = join(OUT, "_alt");
const API = "https://api.openverse.org/v1/images/";
const CANDIDATES = 5;

/** One entry per photograph the site asks for, with the search that finds it. */
const SLOTS = [
  { file: "hero.jpg", q: "hair salon woman", note: "Hero — the room and the work" },
  { file: "salon.jpg", q: "hairdresser salon interior", note: "Why ONDÉ — the room" },
  { file: "og.jpg", q: "hairdresser scissors hair", note: "Open Graph card" },
  { file: "master-1.jpg", q: "hairdresser woman portrait", note: "Irina — colour" },
  { file: "master-2.jpg", q: "woman hairdresser working", note: "Boryana — cutting" },
  { file: "master-3.jpg", q: "barber man portrait", note: "Daniel — barber" },
  { file: "master-4.jpg", q: "manicure nails woman", note: "Niya — nails" },
  { file: "master-5.jpg", q: "makeup artist woman", note: "Elena — make-up and skin" },
  { file: "gallery-1.jpg", q: "long blonde hair back", note: "Balayage, long hair" },
  { file: "gallery-2.jpg", q: "haircut scissors woman", note: "Women's cut" },
  { file: "gallery-3.jpg", q: "hair colouring salon", note: "Root colour" },
  { file: "gallery-4.jpg", q: "hair updo bride", note: "Occasion styling" },
  { file: "gallery-5.jpg", q: "manicure gel nails", note: "Gel polish manicure" },
  { file: "gallery-6.jpg", q: "salon chair mirror interior", note: "The room" },
];

const force = process.argv.includes("--force");
const exists = (p) => access(p).then(() => true, () => false);

async function search(query) {
  const url = `${API}?${new URLSearchParams({
    q: query,
    license: "cc0",
    source: "stocksnap",
    page_size: String(CANDIDATES),
    mature: "false",
  })}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Openverse answered ${res.status} for "${query}"`);
  const body = await res.json();
  return body.results ?? [];
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

  let results;
  try {
    results = await search(slot.q);
  } catch (err) {
    console.error(`✗ ${slot.file} — ${err.message}`);
    continue;
  }
  if (!results.length) {
    console.error(`✗ ${slot.file} — nothing came back for "${slot.q}"`);
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
      if (!placed) {
        placed = true;
        credits.push({ ...slot, r, size });
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
