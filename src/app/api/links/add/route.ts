import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addLinkItem } from "@/lib/links";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const category = form.get("category");
  const label = form.get("label");
  const href = form.get("href");
  const description = form.get("description");

  if (
    typeof category !== "string" ||
    !category.trim() ||
    typeof label !== "string" ||
    !label.trim() ||
    typeof href !== "string" ||
    !href.trim()
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await addLinkItem(
    category.trim(),
    label.trim(),
    href.trim(),
    typeof description === "string" ? description.trim() : "",
  );

  return NextResponse.redirect(new URL("/admin?tab=links", request.url), 303);
}
