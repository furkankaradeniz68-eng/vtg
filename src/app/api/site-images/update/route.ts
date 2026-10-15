import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateSiteImage, type SiteImageKey } from "@/lib/site-images";
import { storeUpload } from "@/lib/direct-upload";

const KEYS: SiteImageKey[] = ["hero"];

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const key = form.get("key");

  if (typeof key !== "string" || !KEYS.includes(key as SiteImageKey)) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const upload = await storeUpload(form, "image", {
    access: "public",
    legacyPathname: (name) => `site-images/${key}-${name}`,
  });
  if (!upload) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await updateSiteImage(key as SiteImageKey, upload.url, upload.pathname, upload.filename);

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
