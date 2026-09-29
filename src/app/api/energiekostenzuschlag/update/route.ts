import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateEnergiekostenYear, type EnergiekostenRow } from "@/lib/energiekostenzuschlag";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const year = Number.parseInt(String(form.get("year") ?? ""), 10);

  if (!Number.isFinite(year)) {
    return NextResponse.json({ error: "Ungültiges Jahr." }, { status: 400 });
  }

  const rows: EnergiekostenRow[] = [];
  for (let month = 1; month <= 12; month++) {
    const price = String(form.get(`price-${month}`) ?? "").trim();
    const percent = String(form.get(`percent-${month}`) ?? "").trim();
    rows.push({ month, price, percent });
  }

  await updateEnergiekostenYear(year, rows);

  return NextResponse.redirect(new URL("/admin?tab=mitgliederbereich", request.url), 303);
}
