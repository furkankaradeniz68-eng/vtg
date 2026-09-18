import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";
import { updatePublicDownload } from "@/lib/public-downloads";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  const category = form.get("category");
  const title = form.get("title");
  const description = form.get("description");
  const file = form.get("file");

  if (typeof id !== "string" || !id || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  let url: string | undefined;
  let blobPathname: string | undefined;
  let filename: string | undefined;
  if (file instanceof File && file.size > 0) {
    blobPathname = `public-downloads/${category}/${id}-${file.name}`;
    const blob = await put(blobPathname, file, {
      access: "private",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
    });
    url = `/api/public-downloads/${id}`;
    blobPathname = blob.pathname;
    filename = file.name;
  }

  await updatePublicDownload(id, {
    title: title.trim(),
    description: typeof description === "string" && description.trim() ? description.trim() : undefined,
    url,
    blobPathname,
    filename,
  });

  return NextResponse.redirect(
    new URL(`/admin?tab=website&category=${category}`, request.url),
    303,
  );
}
