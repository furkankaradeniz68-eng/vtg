import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updatePublicDownload } from "@/lib/public-downloads";
import { storeUpload } from "@/lib/direct-upload";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  const category = form.get("category");
  const title = form.get("title");
  const description = form.get("description");

  if (typeof id !== "string" || !id || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  let url: string | undefined;
  let blobPathname: string | undefined;
  let filename: string | undefined;
  const upload = await storeUpload(form, "file", {
    access: "private",
    legacyPathname: (name) => `public-downloads/${category}/${id}-${name}`,
  });
  if (upload) {
    url = `/api/public-downloads/${id}`;
    blobPathname = upload.pathname;
    filename = upload.filename;
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
