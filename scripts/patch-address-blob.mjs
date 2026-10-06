// One-off script: patch the live production site-content blob so the
// "Überblick" page's address matches the corrected code default.
// Exterstrasse 4 -> Roßlaufstraße 17 (same city/PLZ, only street changes).
//
// Mirrors the exact get()/put() call shapes used in src/lib/site-content.ts
// (loadSiteContent / saveSiteContent), since editing DEFAULT_ENTRIES in the
// source file alone does NOT touch already-seeded blob data.
//
// Run from vtg-rlp repo root: node scripts/patch-address-blob.mjs

import { readFileSync } from "node:fs";
import { get, put } from "@vercel/blob";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const BLOB_TOKEN = env.BLOB_READ_WRITE_TOKEN ?? env.BLOB_FRA_READ_WRITE_TOKEN;
if (!BLOB_TOKEN) {
  console.error("No BLOB_READ_WRITE_TOKEN / BLOB_FRA_READ_WRITE_TOKEN found in .env.local");
  process.exit(1);
}

const META_PATHNAME = "site-content-meta.json";
const OLD_TEXT = "Exterstrasse 4";
const NEW_TEXT = "Roßlaufstraße 17";

const result = await get(META_PATHNAME, {
  access: "private",
  useCache: false,
  token: BLOB_TOKEN,
  abortSignal: AbortSignal.timeout(8000),
}).catch((err) => {
  console.error("Fetch failed:", err);
  return null;
});

if (!result || result.statusCode !== 200) {
  console.error("Blob not found or fetch failed (statusCode:", result?.statusCode, ") — aborting, nothing written.");
  process.exit(1);
}

const text = await new Response(result.stream).text();
const entries = JSON.parse(text);

const body = entries?.ueberblick?.body;
if (typeof body !== "string" || !body.includes(OLD_TEXT)) {
  console.log("'ueberblick' entry does not contain the old address text. Current body snippet:");
  console.log(body?.slice(0, 300) ?? "(no ueberblick entry found)");
  console.log("No changes made.");
  process.exit(0);
}

console.log("--- BEFORE (ueberblick.body, relevant sentence) ---");
console.log(body.match(/Sitz und Geschäftsstelle[^.]*\./)?.[0]);

entries.ueberblick.body = body.replace(OLD_TEXT, NEW_TEXT);
entries.ueberblick.updatedAt = new Date().toISOString();

console.log("--- AFTER ---");
console.log(entries.ueberblick.body.match(/Sitz und Geschäftsstelle[^.]*\./)?.[0]);

await put(META_PATHNAME, JSON.stringify(entries), {
  access: "private",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  token: BLOB_TOKEN,
});

console.log("Done. Blob updated.");
