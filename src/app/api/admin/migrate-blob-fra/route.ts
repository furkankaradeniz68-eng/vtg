// TEMPORÄR: Einmalige Migration aller Blob-Dateien vom alten US-Store
// (BLOB_READ_WRITE_TOKEN) in den neuen Frankfurt-Store (BLOB_FRA_READ_WRITE_TOKEN).
// Nach erfolgreicher, verifizierter Migration und Umstellung von
// BLOB_READ_WRITE_TOKEN auf den Frankfurt-Store: diese Route (und die
// zugehörige Seite unter /admin/migrate-blob-fra) wieder entfernen.
//
// Liest NIE Token-Werte aus der Umgebung heraus in die Response — nur Pfade,
// Zähler und Fehlermeldungen werden zurückgegeben.
import { NextResponse } from "next/server";
import { get, list, put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";

export async function POST() {
  await requireAdminSession();

  const oldToken = process.env.BLOB_READ_WRITE_TOKEN;
  const newToken = process.env.BLOB_FRA_READ_WRITE_TOKEN;

  if (!oldToken || !newToken) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN oder BLOB_FRA_READ_WRITE_TOKEN fehlt in den Umgebungsvariablen dieses Deployments.",
      },
      { status: 500 },
    );
  }

  const migrated: string[] = [];
  const failed: { pathname: string; error: string }[] = [];

  let cursor: string | undefined;
  do {
    const page = await list({ token: oldToken, cursor, limit: 1000 });

    for (const item of page.blobs) {
      try {
        const source = await get(item.pathname, {
          access: "private",
          token: oldToken,
          useCache: false,
        });

        if (!source || source.statusCode !== 200) {
          failed.push({ pathname: item.pathname, error: "Quelle nicht lesbar (kein Status 200)." });
          continue;
        }

        const buffer = Buffer.from(await new Response(source.stream).arrayBuffer());

        await put(item.pathname, buffer, {
          access: "private",
          contentType: source.blob.contentType,
          addRandomSuffix: false,
          allowOverwrite: true,
          token: newToken,
        });

        migrated.push(item.pathname);
      } catch (err) {
        failed.push({ pathname: item.pathname, error: err instanceof Error ? err.message : String(err) });
      }
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return NextResponse.json({
    migratedCount: migrated.length,
    migrated,
    failedCount: failed.length,
    failed,
  });
}
