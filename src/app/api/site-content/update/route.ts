import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";
import { updateSiteContent, SITE_CONTENT_PAGES, type SiteContentSlug } from "@/lib/site-content";
import { BLOB_TOKEN } from "@/lib/blob-token";

const SLUGS = SITE_CONTENT_PAGES.map((p) => p.slug);

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const slug = form.get("slug");
  const body = form.get("body");
  const file = form.get("image");

  if (
    typeof slug !== "string" ||
    !SLUGS.includes(slug as SiteContentSlug) ||
    typeof body !== "string" ||
    !body.trim()
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  let image: string | undefined;
  let blobPathname: string | undefined;
  let replaceImage = false;
  if (file instanceof File && file.size > 0) {
    const blob = await put(`site-content/${slug}-${file.name}`, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
      token: BLOB_TOKEN,
    });
    image = blob.url;
    blobPathname = blob.pathname;
    replaceImage = true;
  } else if (form.get("removeImage") === "on") {
    image = undefined;
    blobPathname = undefined;
    replaceImage = true;
  }

  await updateSiteContent(slug as SiteContentSlug, {
    body,
    image,
    blobPathname,
    replaceImage,
  });

  return NextResponse.redirect(new URL("/admin?tab=ueberuns", request.url), 303);
}
