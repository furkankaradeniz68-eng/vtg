import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getStellenausschreibung } from "@/lib/stellenausschreibung";
import { BLOB_TOKEN } from "@/lib/blob-token";

// Oeffentlich erreichbar (kein requireSession), analog zu /api/kontenplan —
// der Link erscheint nur auf der oeffentlichen Stellenausschreibung-Seite,
// wenn ein PDF hinterlegt ist.
export async function GET() {
  const entry = await getStellenausschreibung();

  if (!entry.pdfBlobPathname) {
    return NextResponse.json({ error: "Kein PDF hinterlegt." }, { status: 404 });
  }

  const result = await get(entry.pdfBlobPathname, { access: "private", token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${(entry.pdfFilename ?? "Stellenausschreibung.pdf").replace(/"/g, "")}"`,
    },
  });
}
