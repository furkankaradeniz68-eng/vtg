import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateSatzungParagraph, SATZUNG_TITEL } from "@/lib/satzung-inhalt";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const indexRaw = form.get("index");
  const body = form.get("body");

  const index = typeof indexRaw === "string" ? Number(indexRaw) : NaN;

  if (!Number.isInteger(index) || !SATZUNG_TITEL[index] || typeof body !== "string" || !body.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await updateSatzungParagraph(index, body);

  return NextResponse.redirect(new URL("/admin?tab=ueberuns", request.url), 303);
}
