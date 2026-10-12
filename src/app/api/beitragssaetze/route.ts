import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { contentDisposition } from "@/lib/content-disposition";
import { getPublicDownloadById } from "@/lib/public-downloads";
import { BLOB_TOKEN } from "@/lib/blob-token";

// Ziel der "Beitragssaetze"-Links im Mitgliederbereich-Menue (src/lib/nav.ts).
// Der Flyer ist an mehreren Stellen der Website verlinkt, aber nur als Download-
// Eintrag "seed-satzung-4" im Admin pflegbar. Damit ein Austausch dort ueberall
// wirksam wird, loesen die Menue-Links ueber diese Route immer auf die aktuelle
// Datei dieses Eintrags auf. Ohne Admin-Upload (oder wenn der Eintrag entfernt
// wurde) gilt die mitgelieferte statische Datei.
const EINTRAG_ID = "seed-satzung-4";
const STATISCHE_DATEI = "/downloads/Flyer_Beitragssätze_Aktuell.pdf";

export async function GET(request: Request) {
  const entry = await getPublicDownloadById(EINTRAG_ID);

  if (entry?.blobPathname) {
    const result = await get(entry.blobPathname, { access: "private", token: BLOB_TOKEN }).catch(() => null);
    if (result && result.statusCode === 200) {
      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": result.blob.contentType || "application/pdf",
          "Content-Disposition": contentDisposition(entry.filename ?? "Flyer_Beitragssätze_Aktuell.pdf", "inline"),
          "Cache-Control": "no-store",
        },
      });
    }
  }

  return NextResponse.redirect(new URL(STATISCHE_DATEI, request.url));
}
