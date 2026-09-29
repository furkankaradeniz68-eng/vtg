// Metadaten fuer private, benutzergebundene Downloads. Analog zu
// verfahren-personendaten.ts liegen diese Daten ausschliesslich in privatem
// Vercel-Blob-Speicher, nicht im Repo. Die eigentlichen Dateien liegen als
// separate Blobs unter downloads/{id}-{dateiname}.
import { put, del, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const META_PATHNAME = "downloads-meta.json";

export type DownloadEntry = {
  id: string;
  username: string;
  filename: string;
  blobPathname: string;
  uploadedAt: string;
  expiresAt: string;
  // Bestaetigung: wird hochgezaehlt, sobald der zugewiesene Mandant (nicht
  // der Admin) die Datei tatsaechlich abruft. Fuer die DLR-Ansicht auf der
  // Verfahrensauswahl-Seite und die Admin-Uebersicht.
  downloadCount: number;
  lastDownloadedAt?: string;
};

// Diese Metadaten werden von der Anwendung selbst laufend veraendert
// (Upload/Loeschung), daher — anders als bei verfahren-personendaten.ts —
// keine Modul-weite Zwischenspeicherung: sonst sehen parallele
// Serverless-Aufrufe veraltete Stände.
async function loadDownloads(): Promise<DownloadEntry[]> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) return [];
  const text = await new Response(result.stream).text();
  const entries = JSON.parse(text) as DownloadEntry[];
  // Abwaertskompatibel: Eintraege, die vor Einfuehrung der Bestaetigungs-
  // Zaehlung angelegt wurden, haben noch kein downloadCount-Feld.
  return entries.map((e) => ({ ...e, downloadCount: e.downloadCount ?? 0 }));
}

async function saveDownloads(entries: DownloadEntry[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export function isDownloadActive(entry: DownloadEntry): boolean {
  return new Date(entry.expiresAt).getTime() > Date.now();
}

export async function getDownloadsForUser(username: string): Promise<DownloadEntry[]> {
  const entries = await loadDownloads();
  return entries.filter((e) => e.username === username && isDownloadActive(e));
}

export async function getAllDownloads(): Promise<DownloadEntry[]> {
  return loadDownloads();
}

export async function getDownloadById(id: string): Promise<DownloadEntry | undefined> {
  const entries = await loadDownloads();
  return entries.find((e) => e.id === id);
}

export async function addDownload(entry: DownloadEntry): Promise<void> {
  const entries = await loadDownloads();
  entries.push(entry);
  await saveDownloads(entries);
}

// Wird beim tatsaechlichen Abruf durch den zugewiesenen Mandanten aufgerufen
// (nicht bei Admin-Zugriff) — das ist die "Bestaetigung", dass der Download
// angekommen ist, plus laufende Zaehlung fuer die DLR-/Admin-Ansicht.
export async function recordDownload(id: string): Promise<void> {
  const entries = await loadDownloads();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  entry.downloadCount += 1;
  entry.lastDownloadedAt = new Date().toISOString();
  await saveDownloads(entries);
}

export async function removeDownload(id: string): Promise<void> {
  const entries = await loadDownloads();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  await del(entry.blobPathname, { token: BLOB_TOKEN }).catch(() => {});
  await saveDownloads(entries.filter((e) => e.id !== id));
}
