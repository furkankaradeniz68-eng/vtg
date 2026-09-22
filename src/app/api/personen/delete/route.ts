import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { removePerson } from "@/lib/personen";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await removePerson(id);

  return NextResponse.redirect(new URL("/admin?tab=personen", request.url), 303);
}
