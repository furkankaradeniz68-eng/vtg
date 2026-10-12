import { NextResponse } from "next/server";
import { getVobVolRowsFuerPdf } from "@/lib/vob-vol";
import { generateVobVolPdf } from "@/lib/vob-vol-pdf";

// Oeffentlich, kein Auth-Guard — der bisherige statische Download
// (public/downloads/Informationen_VOB_VOL.pdf) war ebenfalls oeffentlich.
// Kein Caching: jeder Aufruf liest die aktuellen Blob-Daten und erzeugt das
// PDF neu, damit eine Bearbeitung im Bauleiter-Dashboard sofort im Download
// sichtbar ist.
export async function GET() {
  // Sortierung im PDF: nach Jahr, innerhalb eines Jahres in der Reihenfolge der
  // Original-PDF (siehe getVobVolRowsFuerPdf). Das Bauleiter-Dashboard behaelt
  // seine eigene Sortierung/Jahresfilter.
  const rows = await getVobVolRowsFuerPdf();
  const pdfBytes = await generateVobVolPdf(rows);

  return new NextResponse(new Blob([new Uint8Array(pdfBytes)]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Informationen_VOB_VOL.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
