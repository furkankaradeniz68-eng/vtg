import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { updateStellenausschreibung } from "@/lib/stellenausschreibung";
import { storeUpload } from "@/lib/direct-upload";

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  const title = form.get("title");
  const description = form.get("description");
  const removePdf = form.get("removePdf") === "on";

  if (
    typeof id !== "string" ||
    !id ||
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const pdf = await storeUpload(form, "pdf", {
    access: "private",
    legacyPathname: (name) => `stellenausschreibung/${id}-${name}`,
  });

  await updateStellenausschreibung(id, {
    title: title.trim(),
    description: description.trim(),
    pdf: pdf ?? undefined,
    removePdf,
  });

  return NextResponse.redirect(new URL("/admin?tab=seiteninhalte", request.url), 303);
}
