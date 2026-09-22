import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getPublicDownloadById } from "@/lib/public-downloads";
import { BLOB_TOKEN } from "@/lib/blob-token";

// Oeffentlich erreichbar (kein requireSession): dies sind Website-Downloads,
// keine benutzergebundenen privaten Dateien. Der Blob-Store selbst laesst nur
// private Zugriffe zu, daher wird hier ueber die authentifizierte get()-API
// des SDK gestreamt statt eine direkte Blob-URL zu verwenden.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const entry = await getPublicDownloadById(id);
  if (!entry || !entry.blobPathname) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  const result = await get(entry.blobPathname, { access: "private", token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${(entry.filename ?? entry.title).replace(/"/g, "")}"`,
    },
  });
}
