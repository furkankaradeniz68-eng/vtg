// Erzeugt aus einer lokalen Klartext-JSON-Datei die base64-kodierte
// CREDENTIALS_JSON, wie sie src/lib/credentials.ts erwartet (Passwörter
// werden dabei per bcrypt gehasht, nie im Klartext gespeichert/ausgegeben).
//
// Gedacht für den Aufbau eines *neuen*, unabhängigen Zugangsdaten-Satzes
// (z. B. für ein separates Vercel-Projekt wie "nrw-vtg") — anders als
// scripts/add-admin.mjs, das eine bereits bestehende CREDENTIALS_JSON in
// .env.local ergänzt.
//
// Nutzung:
//   1. Eine lokale Datei anlegen, z. B. nrw-credentials.local.json
//      (Format siehe unten, Passwörter im Klartext — Datei ist über
//      .gitignore ausgeschlossen und sollte nach Gebrauch gelöscht werden):
//
//      {
//        "abonnent": [
//          { "username": "muster.tg1", "password": "...", "label": "TG Musterstadt", "dlr": "DLR Beispiel" }
//        ],
//        "dlr": [
//          { "username": "dlr.beispiel", "password": "...", "dlrNr": "01" }
//        ],
//        "admin": [
//          { "username": "admin", "password": "..." }
//        ]
//      }
//
//   2. node scripts/generate-credentials.mjs nrw-credentials.local.json
//
//   3. Das Script schreibt die fertige base64-CREDENTIALS_JSON in
//      nrw-credentials.local.output.txt (ebenfalls gitignored) — den Inhalt
//      als Wert für die Env-Var CREDENTIALS_JSON in Vercel einfügen.
//
//   4. Beide lokalen Dateien danach löschen (enthalten Klartext-Passwörter
//      bzw. den fertigen Zugangsdaten-Blob).

import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Nutzung: node scripts/generate-credentials.mjs <input.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

function hashGroup(entries, extraFields) {
  return (entries ?? []).map((entry) => {
    if (!entry.username || !entry.password) {
      throw new Error(`Eintrag ohne username/password: ${JSON.stringify(entry)}`);
    }
    const passwordHash = bcrypt.hashSync(entry.password, 10);
    const result = { username: entry.username, passwordHash };
    for (const field of extraFields) {
      if (entry[field] === undefined) {
        throw new Error(`Eintrag "${entry.username}" fehlt Feld "${field}".`);
      }
      result[field] = entry[field];
    }
    return result;
  });
}

const creds = {
  abonnent: hashGroup(raw.abonnent, ["label", "dlr"]),
  dlr: hashGroup(raw.dlr, ["dlrNr"]),
  admin: hashGroup(raw.admin, []),
};

const b64 = Buffer.from(JSON.stringify(creds)).toString("base64");

const outputPath = path.join(
  path.dirname(inputPath),
  path.basename(inputPath).replace(/\.json$/i, "") + ".output.txt",
);
fs.writeFileSync(outputPath, b64 + "\n");

console.log(`Fertig. ${creds.admin.length} Admin(s), ${creds.dlr.length} DLR, ${creds.abonnent.length} Abonnent(en).`);
console.log(`Base64-Wert geschrieben nach: ${outputPath}`);
console.log(`Diesen Inhalt als Wert für die Env-Var CREDENTIALS_JSON in Vercel einfügen.`);
console.log(`Danach ${inputPath} und ${outputPath} löschen (enthalten Klartext-Passwort bzw. den fertigen Zugangsdaten-Blob).`);
