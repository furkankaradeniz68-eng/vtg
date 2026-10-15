import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addPublicDownload, type PublicDownloadCategory } from "@/lib/public-downloads";
import { storeUpload } from "@/lib/direct-upload";

const CATEGORIES: PublicDownloadCategory[] = ["satzung-vordrucke", "fachtagungen", "sonstiges"];

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const category = form.get("category");
  const title = form.get("title");
  const description = form.get("description");

  if (
    typeof category !== "string" ||
    !CATEGORIES.includes(category as PublicDownloadCategory) ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const upload = await storeUpload(form, "file", {
    access: "private",
    legacyPathname: (name) => `public-downloads/${category}/${id}-${name}`,
  });
  if (!upload) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await addPublicDownload({
    id,
    category: category as PublicDownloadCategory,
    title: title.trim(),
    description: typeof description === "string" && description.trim() ? description.trim() : undefined,
    url: `/api/public-downloads/${id}`,
    blobPathname: upload.pathname,
    filename: upload.filename,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.redirect(
    new URL(`/admin?tab=website&category=${category}`, request.url),
    303,
  );
}
