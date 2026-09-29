import { NextResponse } from "next/server";
import { requireBauleiterSession } from "@/lib/auth";
import { deleteVobVolRow } from "@/lib/vob-vol";

export async function POST(request: Request) {
  await requireBauleiterSession();

  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await deleteVobVolRow(id);

  return NextResponse.redirect(new URL("/bauleiter", request.url), 303);
}
