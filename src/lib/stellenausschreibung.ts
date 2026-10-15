// Stellenausschreibungen im Mitgliederbereich-Bereich der oeffentlichen
// Seite. Frueher hart codierter Platzhaltertext in stellenausschreibung/
// page.tsx, dann admin-pflegbar als einzelner Eintrag, jetzt (seit
// 2026-09-29) eine Liste, damit mehrere Stellen gleichzeitig ausgeschrieben
// werden koennen -- Titel + Beschreibung + optionales PDF je Eintrag.
// Gleiches Blob-JSON-Listen-Muster mit id wie public-downloads.ts/
// personen.ts. Das PDF liegt (falls vorhanden) privat im Blob-Store und
// wird ueber eine eigene, per-id parametrisierte API-Route authentifiziert
// gestreamt (siehe /api/stellenausschreibung/[id]/route.ts).
import { put, del, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";

const META_PATHNAME = "stellenausschreibung-meta.json";

export type StellenausschreibungEntry = {
  id: string;
  title: string;
  description: string;
  pdfBlobPathname?: string;
  pdfFilename?: string;
  updatedAt: string;
};

// Leere Liste als Default: die oeffentliche Seite zeigt bei leerer Liste
// einen fest codierten Hinweistext an (siehe stellenausschreibung/page.tsx),
// statt einen Platzhalter-Datensatz zu seeden.
const DEFAULT_ENTRIES: StellenausschreibungEntry[] = [];

async function loadEntries(): Promise<StellenausschreibungEntry[]> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) return DEFAULT_ENTRIES;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as StellenausschreibungEntry[];
}

async function saveEntries(entries: StellenausschreibungEntry[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getStellenausschreibungen(): Promise<StellenausschreibungEntry[]> {
  return loadEntries();
}

export async function getStellenausschreibungById(id: string): Promise<StellenausschreibungEntry | undefined> {
  const entries = await loadEntries();
  return entries.find((e) => e.id === id);
}

// Das PDF liegt beim Aufruf bereits im Blob-Speicher (siehe storeUpload).
export async function addStellenausschreibung(input: {
  title: string;
  description: string;
  pdf?: { pathname: string; filename: string };
}): Promise<void> {
  const entries = await loadEntries();

  const pdfBlobPathname = input.pdf?.pathname;
  const pdfFilename = input.pdf?.filename;

  entries.push({
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    pdfBlobPathname,
    pdfFilename,
    updatedAt: new Date().toISOString(),
  });

  await saveEntries(entries);
}

export async function updateStellenausschreibung(
  id: string,
  input: {
    title: string;
    description: string;
    pdf?: { pathname: string; filename: string };
    removePdf?: boolean;
  },
): Promise<void> {
  const entries = await loadEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;

  if (input.pdf) {
    // Die neue Datei liegt schon im Blob-Speicher; nur die alte loeschen, wenn sie
    // unter einem anderen Pfad liegt (bei gleichem Namen wurde sie ueberschrieben).
    if (entry.pdfBlobPathname && entry.pdfBlobPathname !== input.pdf.pathname) {
      await del(entry.pdfBlobPathname, { token: BLOB_TOKEN }).catch(() => {});
    }
    entry.pdfBlobPathname = input.pdf.pathname;
    entry.pdfFilename = input.pdf.filename;
  } else if (input.removePdf) {
    if (entry.pdfBlobPathname) {
      await del(entry.pdfBlobPathname, { token: BLOB_TOKEN }).catch(() => {});
    }
    entry.pdfBlobPathname = undefined;
    entry.pdfFilename = undefined;
  }

  entry.title = input.title;
  entry.description = input.description;
  entry.updatedAt = new Date().toISOString();

  await saveEntries(entries);
}

export async function removeStellenausschreibung(id: string): Promise<void> {
  const entries = await loadEntries();
  const entry = entries.find((e) => e.id === id);
  if (entry?.pdfBlobPathname) {
    await del(entry.pdfBlobPathname, { token: BLOB_TOKEN }).catch(() => {});
  }
  await saveEntries(entries.filter((e) => e.id !== id));
}
