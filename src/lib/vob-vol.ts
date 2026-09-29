// VOB/VOL-Vergabetabelle (Bauleiter-Dashboard unter /bauleiter). Ersetzt das
// bisherige statische PDF (public/downloads/Informationen_VOB_VOL.pdf) durch
// admin-los pflegbare Blob-Daten nach dem gleichen Muster wie umlage.ts/
// stellenausschreibung.ts. Das oeffentliche PDF auf /vob-vol wird bei jedem
// Aufruf frisch aus diesen Daten generiert (siehe vob-vol-pdf.ts), keine
// Modul-weite Zwischenspeicherung.
//
// Alle 18 Originalspalten sind freie Text-Strings, keine typisierten Zahlen:
// die Quelldaten enthalten in vermeintlich numerischen Spalten echten
// Freitext (z.B. "Stundenlohn" statt eines Betrags, "laeuft noch", leere
// Werte bei unbeauftragten/laufenden Verfahren) und muessen so bearbeitbar
// bleiben, wie sie im Original-PDF auch sind.
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";
import seedRowsRaw from "@/lib/vob-vol-seed.json";

const META_PATHNAME = "vob-vol.json";

export type VobVolRow = {
  id: string;
  prodNr: string;
  jahr: string;
  teilnehmergemeinschaft: string;
  aussenstelle: string;
  artDerLeistung: string;
  umfangDerLeistung: string;
  kwVon: string;
  kwBis: string;
  vobVol: string; // "VOB" | "VOL" | ""
  vergabeart: string; // "oeffentlich" | "beschraenkt" | "freihaendig" | ""
  kostenermittlung: string; // z.B. "139.000,00"
  anzahlAufforderungen: string;
  anzahlAngebote: string;
  auftragsdatum: string;
  auftragnehmer: string;
  auftragssumme: string; // z.B. "112.879,70" oder "Stundenlohn"
  vorabinfo: string; // "ja" | ""
  infoZuschlag: string; // "ja" | ""
  updatedAt: string;
};

// Aus dem historischen PDF extrahierte Zeilen (2010-2025), einmalig zur
// Implementierungszeit per PyMuPDF find_tables() extrahiert und bereinigt
// (siehe vob-vol-seed.json). ~8 Zeilen mit bekannten Extraktionsartefakten
// wurden dabei bereits korrigiert bzw. auf leer gesetzt statt falsche Daten
// zu uebernehmen.
const DEFAULT_ROWS: VobVolRow[] = seedRowsRaw as VobVolRow[];

// Keine Modul-weite Zwischenspeicherung, siehe umlage.ts: diese Daten werden
// von der Anwendung selbst (Bauleiter-Dashboard) laufend veraendert und
// muessen bei jedem PDF-Download aktuell sein.
async function loadVobVolRows(): Promise<VobVolRow[]> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    await saveVobVolRows(DEFAULT_ROWS);
    return DEFAULT_ROWS;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as VobVolRow[];
}

async function saveVobVolRows(rows: VobVolRow[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(rows), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

// Aufsteigend nach ProdNr sortiert (Anzeigereihenfolge im Original-PDF).
export async function getAllVobVolRows(): Promise<VobVolRow[]> {
  const rows = await loadVobVolRows();
  return [...rows].sort((a, b) => a.prodNr.localeCompare(b.prodNr, "de", { numeric: true }));
}

export async function getVobVolRow(id: string): Promise<VobVolRow | null> {
  const rows = await loadVobVolRows();
  return rows.find((r) => r.id === id) ?? null;
}

export type VobVolRowInput = Omit<VobVolRow, "id" | "updatedAt">;

export async function addVobVolRow(data: VobVolRowInput): Promise<void> {
  const rows = await loadVobVolRows();
  rows.push({ ...data, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
  await saveVobVolRows(rows);
}

export async function updateVobVolRow(id: string, data: VobVolRowInput): Promise<void> {
  const rows = await loadVobVolRows();
  const row = rows.find((r) => r.id === id);
  if (!row) return;
  Object.assign(row, data, { updatedAt: new Date().toISOString() });
  await saveVobVolRows(rows);
}

export async function deleteVobVolRow(id: string): Promise<void> {
  const rows = await loadVobVolRows();
  await saveVobVolRows(rows.filter((r) => r.id !== id));
}
