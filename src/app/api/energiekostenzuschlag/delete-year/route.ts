import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { removeEnergiekostenYear } from "@/lib/energiekostenzuschlag";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const year = Number.parseInt(String(form.get("year") ?? ""), 10);

  if (!Number.isFinite(year)) {
    return NextResponse.json({ error: "Ungültiges Jahr." }, { status: 400 });
  }

  await removeEnergiekostenYear(year);

  return NextResponse.redirect(new URL("/admin?tab=mitgliederbereich", request.url), 303);
}
