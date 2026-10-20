import { NextResponse } from "next/server";
import { contentDisposition } from "@/lib/content-disposition";
import { getSession } from "@/lib/auth";
import { recordEvent } from "@/lib/analytics";
import { DLR_ZIFFERN, ladeOffenePostenDatei, zifferFuerBenutzer } from "@/lib/offene-posten";

export const maxDuration = 60;

// Offene-Posten-Download je DLR: /api/offene-posten?dlr=N (N = 1..9) oder ?dlr=alle (ZIP).
// Ein DLR-Login bekommt nur die Liste der eigenen DLR-Ziffer; Admin und DLR-Logins mit Sicht
// auf alle Mandanten duerfen jede Liste und das ZIP laden. Mandanten haben keinen Zugriff.
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const alleSehen = session.role === "admin" || (session.role === "dlr" && !!session.alleMandanten);
  if (session.role !== "admin" && session.role !== "dlr") return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });

  const angefragt = new URL(request.url).searchParams.get("dlr");
  let ziffer: string | undefined;
  if (alleSehen) {
    ziffer = angefragt ?? undefined;
    if (!ziffer || (ziffer !== "alle" && !DLR_ZIFFERN.includes(ziffer))) {
      return NextResponse.json({ error: "Ungültige DLR-Angabe." }, { status: 400 });
    }
  } else {
    ziffer = zifferFuerBenutzer(session.username);
    if (!ziffer || (angefragt && angefragt !== ziffer)) return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  let datei;
  try {
    datei = await ladeOffenePostenDatei(ziffer);
  } catch (err) {
    console.error("Offene-Posten-Abruf fehlgeschlagen:", err);
    return NextResponse.json({ error: "Offene Posten konnten nicht geladen werden." }, { status: 502 });
  }
  if (!datei) return NextResponse.json({ error: "Keine aktuelle Offene-Posten-Liste vorhanden." }, { status: 404 });

  await recordEvent({ type: "download", username: session.username, role: session.role, label: datei.filename });
  return new NextResponse(new Blob([datei.buffer]), {
    headers: {
      "Content-Type": datei.contentType?.includes("/") ? datei.contentType : "application/octet-stream",
      "Content-Disposition": contentDisposition(datei.filename),
      "Cache-Control": "no-store",
    },
  });
}
