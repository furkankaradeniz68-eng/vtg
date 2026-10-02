import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { fetchBcExportFile } from "@/lib/bc-client";
import { recordEvent } from "@/lib/analytics";

export const maxDuration = 60;

// Liefert das aktuelle TG-Einzeldaten-Gesamt-ZIP (alle RLP-Mandanten, naechtlich
// von BC erzeugt) fuer DLRs/Admins. Die Schnittstelle wurde von Erik (BC-
// Entwicklung) im Oktober 2026 freigegeben - vorher stand hier bewusst nur
// Zugriffsschutz + 503-Platzhalter.
export async function GET() {
  const session = await requireSession();
  if (session.role !== "dlr" && session.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  let file;
  try {
    file = await fetchBcExportFile("isCurrent eq true and fileType eq 'zip'");
  } catch (err) {
    console.error("TG-Einzeldaten-ZIP-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "TG-Einzeldaten-Export konnte nicht geladen werden." },
      { status: 502 },
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: "Kein aktueller TG-Einzeldaten-Export vorhanden." },
      { status: 404 },
    );
  }

  await recordEvent({ type: "download", username: session.username, role: session.role, label: file.filename });

  return new NextResponse(new Blob([file.buffer]), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
      "Cache-Control": "no-store",
    },
  });
}
