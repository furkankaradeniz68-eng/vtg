import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";
import { updatePerson, PERSON_PAGES, type PersonPageSlug } from "@/lib/personen";
import { BLOB_TOKEN } from "@/lib/blob-token";

const PAGE_SLUGS = PERSON_PAGES.map((p) => p.slug);

function str(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const id = form.get("id");
  const page = form.get("page");
  const name = str(form, "name");
  const role = str(form, "role");
  const orderRaw = form.get("order");
  const file = form.get("image");

  if (
    typeof id !== "string" ||
    !id ||
    typeof page !== "string" ||
    !PAGE_SLUGS.includes(page as PersonPageSlug) ||
    !name ||
    !role
  ) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const order = typeof orderRaw === "string" && orderRaw.trim() ? Number(orderRaw) : 0;

  let image: string | undefined;
  let blobPathname: string | undefined;
  let replaceImage = false;
  if (file instanceof File && file.size > 0) {
    const blob = await put(`personen/${id}-${file.name}`, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
      token: BLOB_TOKEN,
    });
    image = blob.url;
    blobPathname = blob.pathname;
    replaceImage = true;
  } else if (form.get("removeImage") === "on") {
    image = undefined;
    blobPathname = undefined;
    replaceImage = true;
  }

  await updatePerson(id, {
    page: page as PersonPageSlug,
    section: str(form, "section"),
    sectionMeta: str(form, "sectionMeta"),
    order: Number.isFinite(order) ? order : 0,
    name,
    role,
    address: str(form, "address"),
    phone: str(form, "phone"),
    mobile: str(form, "mobile"),
    fax: str(form, "fax"),
    email: str(form, "email"),
    image,
    blobPathname,
    replaceImage,
  });

  return NextResponse.redirect(new URL("/admin?tab=personen", request.url), 303);
}
