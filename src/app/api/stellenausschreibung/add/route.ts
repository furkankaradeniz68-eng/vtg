import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addStellenausschreibung } from "@/lib/stellenausschreibung";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const pdfFile = form.get("pdf");

  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await addStellenausschreibung({
    title: title.trim(),
    description: description.trim(),
    pdfFile: pdfFile instanceof File && pdfFile.size > 0 ? pdfFile : undefined,
  });

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
