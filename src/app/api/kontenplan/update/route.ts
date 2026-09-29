import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateKontenplan } from "@/lib/kontenplan";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await updateKontenplan(file);

  return NextResponse.redirect(new URL("/admin?tab=mitgliederbereich", request.url), 303);
}
