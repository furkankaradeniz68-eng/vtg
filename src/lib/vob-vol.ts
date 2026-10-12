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
import nachtragRowsRaw from "@/lib/vob-vol-nachtrag-2026.json";

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

// Einmaliger Nachtrag vom 2026-10-12: Die aktuelle Informationen_VOB_VOL.pdf des
// Kunden enthaelt 11 Zeilen, die im Blob fehlten (8 aus 2026 sowie 3 aus 2025:
// Jucken, Eschfeld, Kroev). Sie werden beim ersten Laden angehaengt; ein kleiner
// Marker-Blob verhindert, dass vom Bauleiter spaeter geloeschte Zeilen wieder
// auftauchen oder der Nachtrag doppelt eingespielt wird.
const NACHTRAG_ROWS = nachtragRowsRaw as VobVolRow[];
const NACHTRAG_MARKER_PATHNAME = "vob-vol-nachtrag-2026-10-12.json";
// Einmalige Reihenfolge-Korrektur (2026-10-12): TG Ilbesheim (21126/2026) war nach
// einer manuellen Anpassung ans Listenende gerutscht und gehoert hinter TG Leuktal
// (79028/2026), wie in der Original-PDF.
const REIHENFOLGE_MARKER_PATHNAME = "vob-vol-reihenfolge-ilbesheim-2026-10-12.json";

async function markerVorhanden(pathname: string): Promise<boolean> {
  const marker = await get(pathname, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  return !!marker && marker.statusCode === 200;
}

async function setzeMarker(pathname: string): Promise<void> {
  await put(pathname, JSON.stringify({ eingespielt: new Date().toISOString() }), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

async function wendeNachtragAn(rows: VobVolRow[]): Promise<VobVolRow[]> {
  if (!(await markerVorhanden(NACHTRAG_MARKER_PATHNAME))) {
    const vorhanden = new Set(rows.map((r) => r.id));
    rows = [...rows, ...NACHTRAG_ROWS.filter((r) => !vorhanden.has(r.id))];
    await saveVobVolRows(rows);
    await setzeMarker(NACHTRAG_MARKER_PATHNAME);
  }
  return wendeReihenfolgeKorrekturAn(rows);
}

async function wendeReihenfolgeKorrekturAn(rows: VobVolRow[]): Promise<VobVolRow[]> {
  if (await markerVorhanden(REIHENFOLGE_MARKER_PATHNAME)) return rows;
  const ist = (r: VobVolRow, nr: string) => r.prodNr === nr && r.jahr === "2026";
  const ilbesheim = rows.findIndex((r) => ist(r, "21126"));
  const leuktal = rows.findIndex((r) => ist(r, "79028"));
  if (ilbesheim !== -1 && leuktal !== -1 && ilbesheim !== leuktal + 1) {
    const kopie = [...rows];
    const [zeile] = kopie.splice(ilbesheim, 1);
    kopie.splice(kopie.findIndex((r) => ist(r, "79028")) + 1, 0, zeile);
    rows = kopie;
    await saveVobVolRows(rows);
  }
  await setzeMarker(REIHENFOLGE_MARKER_PATHNAME);
  return rows;
}

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
    return wendeNachtragAn(DEFAULT_ROWS);
  }
  const text = await new Response(result.stream).text();
  return wendeNachtragAn(JSON.parse(text) as VobVolRow[]);
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

// Reihenfolge fuer das oeffentliche PDF: nach Jahr gruppiert (aelteste zuerst,
// Zeilen ohne Jahr am Ende), innerhalb eines Jahres bleibt die gespeicherte
// Eingabereihenfolge des Originals erhalten (stabile Sortierung). Die Original-
// PDF ist nicht nach ProdNr sortiert, sondern nach Erfassung.
export async function getVobVolRowsFuerPdf(): Promise<VobVolRow[]> {
  const rows = await loadVobVolRows();
  const jahrKey = (r: VobVolRow) => (r.jahr.match(/^\d{4}/)?.[0] ?? "9999");
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => jahrKey(a.row).localeCompare(jahrKey(b.row)) || a.index - b.index)
    .map(({ row }) => row);
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

// Bearbeiten aendert die Zeile an Ort und Stelle: die Position in der Liste bleibt
// erhalten. Nur neu angelegte Zeilen (addVobVolRow) kommen ans Ende.
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
