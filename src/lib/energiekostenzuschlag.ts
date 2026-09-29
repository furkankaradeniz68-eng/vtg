// Energiekostenzuschlag-Tabellen im Mitgliederbereich (ein Jahr = 12
// Monatszeilen mit Durchschnittspreis + Zuschlag-Prozentsatz). Frueher hart
// codiertes Array in mitgliederbereich/energiekostenzuschlag/page.tsx, jetzt
// admin-pflegbar nach dem etablierten Blob-JSON-Muster. Monate ohne
// eingetragenen Preis werden beim Speichern verworfen (so bleiben, wie im
// urspruenglichen Datensatz, unvollstaendige Jahre — z.B. 2022 ab Juni --
// moeglich, ohne 12 Platzhalterzeilen anlegen zu muessen).
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";

const META_PATHNAME = "energiekostenzuschlag-meta.json";

export type EnergiekostenRow = { month: number; price: string; percent: string };
export type EnergiekostenYear = { year: number; rows: EnergiekostenRow[]; updatedAt: string };

const SEED_DATE = new Date(0).toISOString();

const DEFAULT_YEARS: EnergiekostenYear[] = [
  {
    year: 2025,
    updatedAt: SEED_DATE,
    rows: [
      { month: 12, price: "0,00 €", percent: "0.0%" },
      { month: 11, price: "0,00 €", percent: "0.0%" },
      { month: 10, price: "0,00 €", percent: "0.0%" },
      { month: 9, price: "0,00 €", percent: "0.0%" },
      { month: 8, price: "0,00 €", percent: "0.0%" },
      { month: 7, price: "0,00 €", percent: "0.0%" },
      { month: 6, price: "0,00 €", percent: "0.0%" },
      { month: 5, price: "1,60 €", percent: "0.0%" },
      { month: 4, price: "1,60 €", percent: "0.0%" },
      { month: 3, price: "1,57 €", percent: "0.0%" },
      { month: 2, price: "1,59 €", percent: "0.0%" },
      { month: 1, price: "1,63 €", percent: "0.0%" },
    ],
  },
  {
    year: 2024,
    updatedAt: SEED_DATE,
    rows: [
      { month: 12, price: "1,53 €", percent: "0.0%" },
      { month: 11, price: "1,55 €", percent: "0.0%" },
      { month: 10, price: "1,50 €", percent: "0.0%" },
      { month: 9, price: "1,50 €", percent: "0.0%" },
      { month: 8, price: "1,55 €", percent: "0.0%" },
      { month: 7, price: "1,60 €", percent: "0.0%" },
      { month: 6, price: "1,66 €", percent: "0.0%" },
      { month: 5, price: "1,66 €", percent: "0.0%" },
      { month: 4, price: "1,66 €", percent: "0.0%" },
      { month: 3, price: "1,65 €", percent: "0.0%" },
      { month: 2, price: "1,65 €", percent: "0.0%" },
      { month: 1, price: "1,59 €", percent: "0.0%" },
    ],
  },
  {
    year: 2023,
    updatedAt: SEED_DATE,
    rows: [
      { month: 12, price: "1,60 €", percent: "0.0%" },
      { month: 11, price: "1,66 €", percent: "0.0%" },
      { month: 10, price: "1,72 €", percent: "1.0%" },
      { month: 9, price: "1,75 €", percent: "1.0%" },
      { month: 8, price: "1,72 €", percent: "1.0%" },
      { month: 7, price: "1,54 €", percent: "0.0%" },
      { month: 6, price: "1,51 €", percent: "0.0%" },
      { month: 5, price: "1,51 €", percent: "0.0%" },
      { month: 4, price: "1,60 €", percent: "0.0%" },
      { month: 3, price: "1,65 €", percent: "0.0%" },
      { month: 2, price: "1,65 €", percent: "0.0%" },
      { month: 1, price: "1,67 €", percent: "0.0%" },
    ],
  },
  {
    year: 2022,
    updatedAt: SEED_DATE,
    rows: [
      { month: 12, price: "1,79 €", percent: "0.0%" },
      { month: 11, price: "1,99 €", percent: "2.0%" },
      { month: 10, price: "2,12 €", percent: "5.0%" },
      { month: 9, price: "2,07 €", percent: "4.0%" },
      { month: 8, price: "1,96 €", percent: "2.0%" },
      { month: 7, price: "1,94 €", percent: "1.0%" },
      { month: 6, price: "1,94 €", percent: "1.0%" },
    ],
  },
];

// Keine Modul-weite Zwischenspeicherung, siehe public-downloads.ts.
async function loadYears(): Promise<EnergiekostenYear[]> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    await saveYears(DEFAULT_YEARS);
    return DEFAULT_YEARS;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as EnergiekostenYear[];
}

async function saveYears(years: EnergiekostenYear[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(years), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

// Neuestes Jahr zuerst, passend zur bisherigen Anzeigereihenfolge.
export async function getEnergiekostenYears(): Promise<EnergiekostenYear[]> {
  const years = await loadYears();
  return [...years].sort((a, b) => b.year - a.year);
}

export async function getEnergiekostenYear(year: number): Promise<EnergiekostenYear | undefined> {
  const years = await loadYears();
  return years.find((y) => y.year === year);
}

export async function addEnergiekostenYear(year: number): Promise<void> {
  const years = await loadYears();
  if (years.some((y) => y.year === year)) return;
  years.push({ year, rows: [], updatedAt: new Date().toISOString() });
  await saveYears(years);
}

// `rows` enthaelt immer 12 Eintraege (Jan-Dez) aus dem Formular; Zeilen ohne
// Preis werden verworfen, damit unvollstaendige Jahre moeglich bleiben.
export async function updateEnergiekostenYear(year: number, rows: EnergiekostenRow[]): Promise<void> {
  const years = await loadYears();
  const entry = years.find((y) => y.year === year);
  if (!entry) return;
  entry.rows = rows.filter((r) => r.price.trim() !== "").sort((a, b) => b.month - a.month);
  entry.updatedAt = new Date().toISOString();
  await saveYears(years);
}

export async function removeEnergiekostenYear(year: number): Promise<void> {
  const years = await loadYears();
  await saveYears(years.filter((y) => y.year !== year));
}
