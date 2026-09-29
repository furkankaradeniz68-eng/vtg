// Stellenausschreibung im Mitgliederbereich-Bereich der oeffentlichen Seite.
// Frueher hart codierter Platzhaltertext in stellenausschreibung/page.tsx,
// jetzt admin-pflegbar: Titel + Beschreibung + optionales PDF. Gleiches
// Blob-JSON-Single-Entry-Muster wie kontenplan.ts/site-images.ts. Das PDF
// liegt (falls vorhanden) privat im Blob-Store und wird ueber eine eigene
// API-Route authentifiziert gestreamt (siehe /api/stellenausschreibung/route.ts).
import { put, del, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const META_PATHNAME = "stellenausschreibung-meta.json";

export type StellenausschreibungEntry = {
  title: string;
  description: string;
  pdfBlobPathname?: string;
  pdfFilename?: string;
  updatedAt: string;
};

const DEFAULT_ENTRY: StellenausschreibungEntry = {
  title: "Stellenausschreibung",
  description:
    "Hier finden Sie offene Stellen beim Verband der Teilnehmergemeinschaften Rheinland-Pfalz, " +
    "Körperschaft des öffentlichen Rechts. Aktuell sind keine offenen Stellen ausgeschrieben. " +
    "Bei Interesse an einer Initiativbewerbung wenden Sie sich gerne an die Geschäftsstelle.",
  updatedAt: new Date(0).toISOString(),
};

async function loadEntry(): Promise<StellenausschreibungEntry> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) return DEFAULT_ENTRY;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as StellenausschreibungEntry;
}

async function saveEntry(entry: StellenausschreibungEntry): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entry), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getStellenausschreibung(): Promise<StellenausschreibungEntry> {
  return loadEntry();
}

export async function updateStellenausschreibung(input: {
  title: string;
  description: string;
  pdfFile?: File;
  removePdf?: boolean;
}): Promise<void> {
  const existing = await loadEntry();

  let pdfBlobPathname = existing.pdfBlobPathname;
  let pdfFilename = existing.pdfFilename;

  if (input.pdfFile && input.pdfFile.size > 0) {
    if (existing.pdfBlobPathname) {
      await del(existing.pdfBlobPathname, { token: BLOB_TOKEN }).catch(() => {});
    }
    const blob = await put(`stellenausschreibung/${Date.now()}-${input.pdfFile.name}`, input.pdfFile, {
      access: "private",
      contentType: input.pdfFile.type || "application/pdf",
      addRandomSuffix: false,
      token: BLOB_TOKEN,
    });
    pdfBlobPathname = blob.pathname;
    pdfFilename = input.pdfFile.name;
  } else if (input.removePdf) {
    if (existing.pdfBlobPathname) {
      await del(existing.pdfBlobPathname, { token: BLOB_TOKEN }).catch(() => {});
    }
    pdfBlobPathname = undefined;
    pdfFilename = undefined;
  }

  await saveEntry({
    title: input.title,
    description: input.description,
    pdfBlobPathname,
    pdfFilename,
    updatedAt: new Date().toISOString(),
  });
}
