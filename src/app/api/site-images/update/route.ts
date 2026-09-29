import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";
import { updateSiteImage, type SiteImageKey } from "@/lib/site-images";
import { BLOB_TOKEN } from "@/lib/blob-token";

const KEYS: SiteImageKey[] = ["hero"];

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const key = form.get("key");
  const file = form.get("image");

  if (typeof key !== "string" || !KEYS.includes(key as SiteImageKey) || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const blob = await put(`site-images/${key}-${file.name}`, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: false,
    token: BLOB_TOKEN,
  });

  await updateSiteImage(key as SiteImageKey, blob.url, blob.pathname, file.name);

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
