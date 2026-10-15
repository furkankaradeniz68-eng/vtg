import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateKontenplan } from "@/lib/kontenplan";
import { storeUpload } from "@/lib/direct-upload";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const upload = await storeUpload(form, "file", {
    access: "private",
    legacyPathname: (name) => `kontenplan/${Date.now()}-${name}`,
  });

  if (!upload) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await updateKontenplan(upload);

  return NextResponse.redirect(new URL("/admin?tab=mitgliederbereich", request.url), 303);
}
