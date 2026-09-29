import { NextResponse } from "next/server";
import { getAllVobVolRows } from "@/lib/vob-vol";
import { generateVobVolPdf } from "@/lib/vob-vol-pdf";

// Oeffentlich, kein Auth-Guard — der bisherige statische Download
// (public/downloads/Informationen_VOB_VOL.pdf) war ebenfalls oeffentlich.
// Kein Caching: jeder Aufruf liest die aktuellen Blob-Daten und erzeugt das
// PDF neu, damit eine Bearbeitung im Bauleiter-Dashboard sofort im Download
// sichtbar ist.
export async function GET() {
  const rows = await getAllVobVolRows();
  const pdfBytes = await generateVobVolPdf(rows);

  return new NextResponse(new Blob([new Uint8Array(pdfBytes)]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Informationen_VOB_VOL.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
