// Kontenplan-PDF im Mitgliederbereich. Frueher eine statische Datei unter
// /public/downloads/Kontenplan_TG.pdf, jetzt admin-ersetzbar. Gleiches
// Muster wie public-downloads.ts: Datei liegt privat im Blob-Store und wird
// ueber eine eigene API-Route authentifiziert gestreamt (siehe
// /api/kontenplan/route.ts), damit keine rohe Blob-URL noetig ist.
import { put, del, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";

const META_PATHNAME = "kontenplan-meta.json";
// Legacy-Startzustand: verweist auf die urspruengliche statische Datei, bis
// ein Admin sie zum ersten Mal ersetzt (siehe getKontenplan()).
const LEGACY_STATIC_PATH = "/downloads/Kontenplan_TG.pdf";

export type KontenplanEntry = {
  blobPathname?: string;
  filename: string;
  updatedAt: string;
};

const DEFAULT_ENTRY: KontenplanEntry = {
  filename: "Kontenplan_TG.pdf",
  updatedAt: new Date(0).toISOString(),
};

async function loadKontenplan(): Promise<KontenplanEntry> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) return DEFAULT_ENTRY;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as KontenplanEntry;
}

async function saveKontenplan(entry: KontenplanEntry): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entry), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getKontenplan(): Promise<KontenplanEntry> {
  return loadKontenplan();
}

// Solange kein Admin die Datei ersetzt hat, zeigt /api/kontenplan auf die
// urspruengliche statische Legacy-Datei weiter (kein blobPathname gesetzt).
export function kontenplanLegacyPath(): string {
  return LEGACY_STATIC_PATH;
}

export async function updateKontenplan(file: File): Promise<void> {
  const existing = await loadKontenplan();
  if (existing.blobPathname) {
    await del(existing.blobPathname, { token: BLOB_TOKEN }).catch(() => {});
  }

  const blob = await put(`kontenplan/${Date.now()}-${file.name}`, file, {
    access: "private",
    contentType: file.type || "application/pdf",
    addRandomSuffix: false,
    token: BLOB_TOKEN,
  });

  await saveKontenplan({
    blobPathname: blob.pathname,
    filename: file.name,
    updatedAt: new Date().toISOString(),
  });
}
