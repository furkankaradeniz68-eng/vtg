import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { requireSession } from "@/lib/auth";
import { getDownloadById, isDownloadActive } from "@/lib/downloads";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const entry = await getDownloadById(id);
  if (!entry) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  const isOwner = session.role === "admin" || session.username === entry.username;
  if (!isOwner) {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  if (session.role !== "admin" && !isDownloadActive(entry)) {
    return NextResponse.json({ error: "Download ist abgelaufen." }, { status: 410 });
  }

  const result = await get(entry.blobPathname, { access: "private" }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${entry.filename.replace(/"/g, "")}"`,
    },
  });
}
