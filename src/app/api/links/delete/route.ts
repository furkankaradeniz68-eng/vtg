import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { removeLinkItem } from "@/lib/links";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await removeLinkItem(id);

  return NextResponse.redirect(new URL("/admin?tab=links", request.url), 303);
}
