import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addStellenausschreibung } from "@/lib/stellenausschreibung";
import { storeUpload } from "@/lib/direct-upload";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");

  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const pdf = await storeUpload(form, "pdf", {
    access: "private",
    legacyPathname: (name) => `stellenausschreibung/${crypto.randomUUID()}-${name}`,
  });

  await addStellenausschreibung({
    title: title.trim(),
    description: description.trim(),
    pdf: pdf ?? undefined,
  });

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
