import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateStellenausschreibung } from "@/lib/stellenausschreibung";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const pdfFile = form.get("pdf");
  const removePdf = form.get("removePdf") === "on";

  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await updateStellenausschreibung({
    title,
    description,
    pdfFile: pdfFile instanceof File && pdfFile.size > 0 ? pdfFile : undefined,
    removePdf,
  });

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
