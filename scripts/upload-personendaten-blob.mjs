// Einmaliges Migrationsskript: laedt die Personendaten aus der lokalen
// VERFAHREN_PERSONENDATEN_JSON env var (base64) und schreibt sie als
// privaten Blob nach Vercel Blob. Danach kann die env var geloescht werden.
//
// Aufruf: node scripts/upload-personendaten-blob.mjs
// Voraussetzung: .env.local enthaelt VERFAHREN_PERSONENDATEN_JSON und
// BLOB_READ_WRITE_TOKEN.

import { readFileSync } from "node:fs";
import { put } from "@vercel/blob";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
  const env = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2];
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
  return env;
}

const env = loadEnvLocal();
const raw = env.VERFAHREN_PERSONENDATEN_JSON;
if (!raw) throw new Error("VERFAHREN_PERSONENDATEN_JSON fehlt in .env.local");
const token = env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN fehlt in .env.local");

const json = Buffer.from(raw, "base64").toString("utf-8");
JSON.parse(json); // Validierung vor dem Upload

const result = await put("verfahren-personendaten.json", json, {
  access: "private",
  contentType: "application/json",
  allowOverwrite: true,
  token,
});

console.log("Hochgeladen:", result.pathname, "(", json.length, "Zeichen JSON )");
