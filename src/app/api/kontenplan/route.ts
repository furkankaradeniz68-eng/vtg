import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getKontenplan, kontenplanLegacyPath } from "@/lib/kontenplan";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { getSession } from "@/lib/auth";
import { recordEvent } from "@/lib/analytics";

// Oeffentlich erreichbar (kein requireSession), wie zuvor die statische
// Datei unter /public/downloads — der Link ist nur innerhalb des
// Mitgliederbereichs verlinkt, siehe src/lib/nav.ts.
export async function GET(request: Request) {
  const entry = await getKontenplan();

  if (!entry.blobPathname) {
    return NextResponse.redirect(new URL(kontenplanLegacyPath(), request.url));
  }

  const result = await get(entry.blobPathname, { access: "private", token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  // Route ist bewusst oeffentlich (kein requireSession, s.o.) — Zuordnung im
  // Analytics-Tab daher nur "best effort", falls zufaellig eine eingeloggte
  // Session vorliegt; ohne Session wird kein Event geschrieben.
  const session = await getSession();
  if (session) {
    await recordEvent({ type: "download", username: session.username, role: session.role, label: entry.filename });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${entry.filename.replace(/"/g, "")}"`,
    },
  });
}
