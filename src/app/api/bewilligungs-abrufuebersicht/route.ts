import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { fetchBcGrantOverviewFile } from "@/lib/bc-client";
import { recordEvent } from "@/lib/analytics";

export const maxDuration = 60;

const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Liefert die aktuelle gemeinsame Bewilligungs- und Abrufuebersicht (Excel,
// alle Mandanten) aus der BC-API-Gruppe "grants" - nur fuer DLR/Admin, wie
// bisher die gleichnamige Seite im Mitgliederbereich.
export async function GET() {
  const session = await requireSession();
  if (session.role !== "dlr" && session.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  let file;
  try {
    file = await fetchBcGrantOverviewFile();
  } catch (err) {
    console.error("Bewilligungs-/Abrufuebersicht-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Bewilligungs- und Abrufübersicht konnte nicht geladen werden." },
      { status: 502 },
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: "Keine aktuelle Bewilligungs- und Abrufübersicht vorhanden." },
      { status: 404 },
    );
  }

  await recordEvent({ type: "download", username: session.username, role: session.role, label: file.filename });

  return new NextResponse(new Blob([file.buffer]), {
    headers: {
      "Content-Type": file.contentType?.includes("/") ? file.contentType : XLSX_CONTENT_TYPE,
      "Content-Disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
      "Cache-Control": "no-store",
    },
  });
}
