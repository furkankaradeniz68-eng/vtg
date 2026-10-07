import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { findVerfahren, istVerfahrenErreichbar } from "@/lib/bc-companies";
import {
  findeFinanzDownloadKategorie,
  KATEGORIE_INFO,
  type FinanzKategorieSlug,
} from "@/lib/bc-budget-lines";
import { generateFinanzberichtPdf } from "@/lib/finanzbericht-pdf";
import { recordEvent } from "@/lib/analytics";

const GUELTIGE_SLUGS: FinanzKategorieSlug[] = [
  "einnahmen",
  "ausfuehrungskosten-a1",
  "sonstige-ausfuehrungskosten-a2",
];

export async function GET(request: Request) {
  const session = await requireSession();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const kategorieSlug = url.searchParams.get("kategorie") as FinanzKategorieSlug | null;

  // "ansicht" wird aus Kompatibilitaet mit bestehenden Download-Links noch
  // akzeptiert, aber fuer den Inhalt nicht mehr gebraucht: die PDF zeigt seit
  // der 1:1-Angleichung an vtg-rlp.de immer Laufzeit UND Haushaltsjahr
  // nebeneinander (wie das Original), nicht mehr nur eine Ansicht.
  if (!id || !kategorieSlug || !GUELTIGE_SLUGS.includes(kategorieSlug)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Dieselbe Zugriffspruefung wie auf der HTML-Berichtsseite: Abonnent nur
  // eigenes Verfahren, DLR nur Verfahren des eigenen Dienstsitzes, Admin alle.
  const zugriffErlaubt = await istVerfahrenErreichbar(session, id);
  if (!zugriffErlaubt) {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const verfahren = await findVerfahren(id);
  if (!verfahren) {
    return NextResponse.json({ error: "Verfahren nicht gefunden." }, { status: 404 });
  }

  const kategorie = await findeFinanzDownloadKategorie(id, kategorieSlug);
  // Ausfuehrungskosten A1 und A2 im Querformat (volle Soll-Ist-Spaltenbreite),
  // Einnahmen im Hochformat (Kundenwunsch 2026-10-07).
  const orientation = kategorieSlug === "einnahmen" ? "portrait" : "landscape";

  const pdfBytes = await generateFinanzberichtPdf({ verfahren, kategorie, orientation });

  const info = KATEGORIE_INFO[kategorieSlug];
  const dateiname = `${info.titel}${info.suffix ? `-${info.suffix}` : ""}-${verfahren.nr}.pdf`.replace(/\s+/g, "_");

  await recordEvent({ type: "download", username: session.username, role: session.role, label: dateiname });

  return new NextResponse(new Blob([new Uint8Array(pdfBytes)]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${dateiname}"`,
    },
  });
}
