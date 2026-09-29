import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateUmlageRow } from "@/lib/umlage";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  const year = form.get("year");
  const percent = form.get("percent");

  const yearNum = typeof year === "string" ? Number(year) : NaN;
  if (typeof id !== "string" || !id || !Number.isInteger(yearNum) || typeof percent !== "string" || !percent.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await updateUmlageRow(id, yearNum, percent.trim());

  return NextResponse.redirect(new URL("/admin?tab=mitgliederbereich", request.url), 303);
}
