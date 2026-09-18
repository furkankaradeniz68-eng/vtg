import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";
import { addDownload } from "@/lib/downloads";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const username = form.get("username");
  const expiryDaysRaw = form.get("expiryDays");
  const file = form.get("file");

  const expiryDays = Number(expiryDaysRaw);
  if (
    typeof username !== "string" ||
    !username ||
    !(file instanceof File) ||
    !Number.isFinite(expiryDays) ||
    expiryDays <= 0
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const blobPathname = `downloads/${id}-${file.name}`;

  const blob = await put(blobPathname, file, {
    access: "private",
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: false,
  });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);

  await addDownload({
    id,
    username,
    filename: file.name,
    blobPathname: blob.pathname,
    uploadedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });

  return NextResponse.redirect(new URL("/mitgliederbereich/downloads-verwalten", request.url), 303);
}
