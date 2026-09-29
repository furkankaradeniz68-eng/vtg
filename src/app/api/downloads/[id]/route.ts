import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { requireSession } from "@/lib/auth";
import { istVerfahrenErreichbar } from "@/lib/bc-companies";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { getDownloadById, isDownloadActive, recordDownload } from "@/lib/downloads";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const entry = await getDownloadById(id);
  if (!entry) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  // Diese Downloads sind ausschliesslich fuer DLR (des zustaendigen Kreises)
  // und Admin gedacht, nicht fuer den zugewiesenen Mandanten selbst.
  const isAdmin = session.role === "admin";
  const isZustaendigerDlr = session.role === "dlr" && (await istVerfahrenErreichbar(session, entry.username));
  if (!isAdmin && !isZustaendigerDlr) {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  if (!isAdmin && !isDownloadActive(entry)) {
    return NextResponse.json({ error: "Download ist abgelaufen." }, { status: 410 });
  }

  const result = await get(entry.blobPathname, { access: "private", token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  // Bestaetigung/Zaehlung nur beim tatsaechlichen Abruf durch den
  // zustaendigen DLR, nicht wenn ein Admin die Datei nur einsieht.
  if (session.role === "dlr") {
    await recordDownload(entry.id);
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${entry.filename.replace(/"/g, "")}"`,
    },
  });
}
