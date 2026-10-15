import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateSiteContent, SITE_CONTENT_PAGES, type SiteContentSlug } from "@/lib/site-content";
import { storeUpload } from "@/lib/direct-upload";

const SLUGS = SITE_CONTENT_PAGES.map((p) => p.slug);

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const slug = form.get("slug");
  const body = form.get("body");

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
  const upload = await storeUpload(form, "image", {
    access: "public",
    legacyPathname: (name) => `site-content/${slug}-${name}`,
  });
  if (upload) {
    image = upload.url;
    blobPathname = upload.pathname;
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

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
