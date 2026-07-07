// One-off local tool: reads the real login CSVs from the external VTG data
// folder (never part of this repo) and produces a hashed credentials blob
// for CREDENTIALS_JSON. Passwords are bcrypt-hashed before they ever leave
// this machine — plaintext passwords must never be committed or pasted
// into an env var.
import { readFileSync, writeFileSync } from "node:fs";
import bcrypt from "bcryptjs";

const SOURCE_DIR = "/Volumes/SSK Drive /VTG";

// Quote-aware line splitter (RFC4180-ish): handles embedded delimiters and
// escaped quotes ("") inside quoted fields, e.g. Flurbereinigungsverfahren
// names like `Nittel V, Teilgebiet 2 "Spiesberg"`.
function splitCsvLine(line, delimiter) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

function parseCsv(text, delimiter = ",") {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const header = splitCsvLine(lines[0], delimiter);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line, delimiter);
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

const rounds = 10;

const abonnentRows = parseCsv(
  readFileSync(`${SOURCE_DIR}/Benutzer-Liste.csv`, "utf-8"),
);
const abonnent = abonnentRows.map((r) => ({
  username: r.VKZ.trim(),
  passwordHash: bcrypt.hashSync(r.Kennwort.trim(), rounds),
  label: r.Flurbereinigungsverfahren.trim(),
  dlr: r.zust_DLR.trim(),
}));

const dlrRows = parseCsv(
  readFileSync(`${SOURCE_DIR}/DLR-Benutzer-Liste.csv`, "utf-8"),
).filter((r) => r.DLR.trim() !== "");
const dlr = dlrRows.map((r) => ({
  username: r.Benutzername.trim(),
  passwordHash: bcrypt.hashSync(r.Passwort.trim(), rounds),
  dlrNr: r.DLR.trim(),
}));

const adminRows = parseCsv(
  readFileSync(`${SOURCE_DIR}/VTG-Intern.csv`, "utf-8"),
);
const admin = adminRows.map((r) => ({
  username: r.userlogin.trim(),
  passwordHash: bcrypt.hashSync(r.Kennwort.trim(), rounds),
}));

const credentials = { abonnent, dlr, admin };
const json = JSON.stringify(credentials);

writeFileSync("/tmp/vtg-credentials.json", json);
console.log("abonnent:", abonnent.length, "dlr:", dlr.length, "admin:", admin.length);
console.log("bytes:", Buffer.byteLength(json, "utf-8"));
console.log("written to /tmp/vtg-credentials.json");
