import { NextResponse } from "next/server";
import { getAllVobVolRows } from "@/lib/vob-vol";
import { generateVobVolPdf } from "@/lib/vob-vol-pdf";

// Oeffentlich, kein Auth-Guard — der bisherige statische Download
// (public/downloads/Informationen_VOB_VOL.pdf) war ebenfalls oeffentlich.
// Kein Caching: jeder Aufruf liest die aktuellen Blob-Daten und erzeugt das
// PDF neu, damit eine Bearbeitung im Bauleiter-Dashboard sofort im Download
// sichtbar ist.
export async function GET() {
  // Sortierung im PDF: nach Jahr (aufsteigend), innerhalb eines Jahres nach
  // ProdNr (Kundenwunsch 2026-10-12). Zeilen ohne Jahr stehen am Ende. Das
  // Bauleiter-Dashboard behaelt seine eigene Sortierung/Jahresfilter.
  const rows = [...(await getAllVobVolRows())].sort((a, b) => {
    if (!a.jahr !== !b.jahr) return a.jahr ? -1 : 1;
    return (
      a.jahr.localeCompare(b.jahr, "de", { numeric: true }) ||
      a.prodNr.localeCompare(b.prodNr, "de", { numeric: true })
    );
  });
  const pdfBytes = await generateVobVolPdf(rows);

  return new NextResponse(new Blob([new Uint8Array(pdfBytes)]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Informationen_VOB_VOL.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
