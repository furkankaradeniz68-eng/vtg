// Umlage-Tabelle (Jahr -> Prozentsatz) im Mitgliederbereich. Frueher hart
// codiertes Array in mitgliederbereich/umlage/page.tsx, jetzt admin-pflegbar
// nach dem gleichen Blob-JSON-Muster wie public-downloads.ts. Der Begleittext
// der Seite liegt separat in site-content.ts (Slug "umlage").
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const META_PATHNAME = "umlage-meta.json";

export type UmlageRow = {
  id: string;
  year: number;
  percent: string;
  updatedAt: string;
};

const SEED_DATE = new Date(0).toISOString();

const DEFAULT_ROWS: UmlageRow[] = [
  { id: "seed-2017", year: 2017, percent: "9,3%", updatedAt: SEED_DATE },
  { id: "seed-2018", year: 2018, percent: "10,5%", updatedAt: SEED_DATE },
  { id: "seed-2019", year: 2019, percent: "10,5%", updatedAt: SEED_DATE },
  { id: "seed-2020", year: 2020, percent: "12,6%", updatedAt: SEED_DATE },
  { id: "seed-2021", year: 2021, percent: "12,6%", updatedAt: SEED_DATE },
  { id: "seed-2022", year: 2022, percent: "13%", updatedAt: SEED_DATE },
  { id: "seed-2023", year: 2023, percent: "13%", updatedAt: SEED_DATE },
  { id: "seed-2024", year: 2024, percent: "13%", updatedAt: SEED_DATE },
];

// Keine Modul-weite Zwischenspeicherung, siehe public-downloads.ts: diese
// Metadaten werden von der Anwendung selbst laufend veraendert.
async function loadUmlageRows(): Promise<UmlageRow[]> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) {
    await saveUmlageRows(DEFAULT_ROWS);
    return DEFAULT_ROWS;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as UmlageRow[];
}

async function saveUmlageRows(rows: UmlageRow[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(rows), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

// Absteigend sortiert (neuestes Jahr zuerst), passend zur bisherigen
// Anzeigereihenfolge der hart codierten Tabelle... eigentlich aufsteigend
// (2017 zuerst) - siehe urspruengliches Array. Wir behalten aufsteigend bei.
export async function getUmlageRows(): Promise<UmlageRow[]> {
  const rows = await loadUmlageRows();
  return [...rows].sort((a, b) => a.year - b.year);
}

export async function addUmlageRow(year: number, percent: string): Promise<void> {
  const rows = await loadUmlageRows();
  rows.push({ id: crypto.randomUUID(), year, percent, updatedAt: new Date().toISOString() });
  await saveUmlageRows(rows);
}

export async function updateUmlageRow(id: string, year: number, percent: string): Promise<void> {
  const rows = await loadUmlageRows();
  const row = rows.find((r) => r.id === id);
  if (!row) return;
  row.year = year;
  row.percent = percent;
  row.updatedAt = new Date().toISOString();
  await saveUmlageRows(rows);
}

export async function removeUmlageRow(id: string): Promise<void> {
  const rows = await loadUmlageRows();
  await saveUmlageRows(rows.filter((r) => r.id !== id));
}
