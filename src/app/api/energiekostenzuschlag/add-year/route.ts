import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addEnergiekostenYear } from "@/lib/energiekostenzuschlag";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const year = Number.parseInt(String(form.get("year") ?? ""), 10);

  if (!Number.isFinite(year) || year < 2000 || year > 2100) {
    return NextResponse.json({ error: "Ungültiges Jahr." }, { status: 400 });
  }

  await addEnergiekostenYear(year);

  return NextResponse.redirect(new URL(`/admin/energiekostenzuschlag/${year}/bearbeiten`, request.url), 303);
}
