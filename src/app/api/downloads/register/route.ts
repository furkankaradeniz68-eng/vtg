import { NextResponse } from "next/server";
import { head } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { addDownload } from "@/lib/downloads";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { downloadBlobPathname } from "@/lib/download-pathname";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Legt nach einem direkten Browser-Upload (siehe /api/downloads/upload-token)
// den Metadaten-Eintrag an. Der Blob-Pfad wird serverseitig aus id und
// Dateiname gebildet und geprueft, nicht vom Browser uebernommen.
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    username?: unknown;
    filename?: unknown;
    expiryDays?: unknown;
  } | null;
  const expiryDays = Number(body?.expiryDays);
  if (
    typeof body?.id !== "string" ||
    !UUID.test(body.id) ||
    typeof body.username !== "string" ||
    !body.username ||
    typeof body.filename !== "string" ||
    !body.filename ||
    !Number.isFinite(expiryDays) ||
    expiryDays <= 0
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const blobPathname = downloadBlobPathname(body.id, body.filename);
  const blob = await head(blobPathname, { token: BLOB_TOKEN }).catch(() => null);
  if (!blob) {
    return NextResponse.json({ error: "Die hochgeladene Datei wurde nicht gefunden." }, { status: 400 });
  }

  const now = new Date();
  await addDownload({
    id: body.id,
    username: body.username,
    filename: body.filename,
    blobPathname,
    uploadedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString(),
    downloadCount: 0,
  });

  return NextResponse.json({ ok: true });
}
