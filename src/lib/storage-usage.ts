// Speicherbelegung des Blob-Speichers fuer die Analytics-Uebersicht im Admin-
// Dashboard: Gesamtgroesse, Anzahl Dateien, Aufteilung nach Bereich und die
// groessten Dateien. list() zaehlt bei Vercel als "Advanced Operation" (im Pro-
// Tarif 10.000/Monat inklusive); das Ergebnis wird deshalb kurz zwischengespeichert.
import { list } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

export type StorageArea = { key: string; label: string; files: number; bytes: number };
export type StorageFile = { pathname: string; bytes: number; uploadedAt: string };
export type StorageUsage = {
  totalBytes: number;
  totalFiles: number;
  areas: StorageArea[];
  largest: StorageFile[];
  includedBytes: number;
  measuredAt: string;
};

// Im Pro-Tarif sind laut Vercel-Preisliste 5 GB Blob-Speicher enthalten. Ueber
// BLOB_INCLUDED_GB laesst sich der Wert anpassen, falls sich der Tarif aendert.
const DEFAULT_INCLUDED_GB = 5;

const AREAS: { key: string; label: string; match: (p: string) => boolean }[] = [
  { key: "downloads", label: "Mitglieder-Downloads", match: (p) => p.startsWith("downloads/") },
  {
    key: "uploads",
    label: "Direkt hochgeladene Dateien (Website-Downloads, Bilder, Kontenplan u. a.)",
    match: (p) => p.startsWith("uploads/"),
  },
  { key: "public-downloads", label: "Website-Downloads", match: (p) => p.startsWith("public-downloads/") },
  {
    key: "bilder",
    label: "Bilder (Personen, Seiteninhalte, Kopfbild)",
    match: (p) => p.startsWith("personen/") || p.startsWith("site-content/") || p.startsWith("site-images/"),
  },
  {
    key: "dokumente",
    label: "Kontenplan und Stellenausschreibungen",
    match: (p) => p.startsWith("kontenplan/") || p.startsWith("stellenausschreibung/"),
  },
];
const OTHER = { key: "system", label: "Systemdaten (Verzeichnisse, BC-Abzüge, Statistik)" };

let cache: { at: number; value: StorageUsage } | null = null;
const CACHE_MS = 5 * 60 * 1000;

export async function getStorageUsage(): Promise<StorageUsage> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;

  const areaMap = new Map<string, StorageArea>();
  const all: StorageFile[] = [];
  let totalBytes = 0;
  let totalFiles = 0;

  let cursor: string | undefined;
  do {
    const page = await list({ limit: 1000, cursor, token: BLOB_TOKEN });
    for (const blob of page.blobs) {
      const area = AREAS.find((a) => a.match(blob.pathname)) ?? OTHER;
      const entry = areaMap.get(area.key) ?? { key: area.key, label: area.label, files: 0, bytes: 0 };
      entry.files += 1;
      entry.bytes += blob.size;
      areaMap.set(area.key, entry);
      totalBytes += blob.size;
      totalFiles += 1;
      all.push({ pathname: blob.pathname, bytes: blob.size, uploadedAt: blob.uploadedAt.toISOString() });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const includedGb = Number(process.env.BLOB_INCLUDED_GB);
  const value: StorageUsage = {
    totalBytes,
    totalFiles,
    areas: [...areaMap.values()].sort((a, b) => b.bytes - a.bytes),
    largest: all.sort((a, b) => b.bytes - a.bytes).slice(0, 5),
    includedBytes: (Number.isFinite(includedGb) && includedGb > 0 ? includedGb : DEFAULT_INCLUDED_GB) * 1024 ** 3,
    measuredAt: new Date().toISOString(),
  };
  cache = { at: Date.now(), value };
  return value;
}
