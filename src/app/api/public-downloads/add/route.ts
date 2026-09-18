import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";
import { addPublicDownload, type PublicDownloadCategory } from "@/lib/public-downloads";

const CATEGORIES: PublicDownloadCategory[] = ["satzung-vordrucke", "fachtagungen", "sonstiges"];

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const category = form.get("category");
  const title = form.get("title");
  const description = form.get("description");
  const file = form.get("file");

  if (
    typeof category !== "string" ||
    !CATEGORIES.includes(category as PublicDownloadCategory) ||
    typeof title !== "string" ||
    !title.trim() ||
    !(file instanceof File)
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const blobPathname = `public-downloads/${category}/${id}-${file.name}`;

  const blob = await put(blobPathname, file, {
    access: "private",
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: false,
  });

  await addPublicDownload({
    id,
    category: category as PublicDownloadCategory,
    title: title.trim(),
    description: typeof description === "string" && description.trim() ? description.trim() : undefined,
    url: `/api/public-downloads/${id}`,
    blobPathname: blob.pathname,
    filename: file.name,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.redirect(
    new URL(`/admin?tab=website&category=${category}`, request.url),
    303,
  );
}
