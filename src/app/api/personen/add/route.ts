import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addPerson, getPersonenByPage, PERSON_PAGES, type PersonPageSlug } from "@/lib/personen";
import { storeUpload } from "@/lib/direct-upload";

const PAGE_SLUGS = PERSON_PAGES.map((p) => p.slug);

function str(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function POST(request: Request) {
  await requireAdminSession();

  const form = await request.formData();
  const page = form.get("page");
  const name = str(form, "name");
  const role = str(form, "role");

  if (typeof page !== "string" || !PAGE_SLUGS.includes(page as PersonPageSlug) || !name || !role) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const id = crypto.randomUUID();

  let image: string | undefined;
  let blobPathname: string | undefined;
  const upload = await storeUpload(form, "image", {
    access: "public",
    legacyPathname: (name) => `personen/${id}-${name}`,
  });
  if (upload) {
    image = upload.url;
    blobPathname = upload.pathname;
  }

  const existing = await getPersonenByPage(page as PersonPageSlug);
  const order = existing.length ? Math.max(...existing.map((e) => e.order)) + 1 : 0;

  await addPerson({
    id,
    page: page as PersonPageSlug,
    section: str(form, "section"),
    sectionMeta: str(form, "sectionMeta"),
    order,
    name,
    role,
    address: str(form, "address"),
    phone: str(form, "phone"),
    mobile: str(form, "mobile"),
    fax: str(form, "fax"),
    email: str(form, "email"),
    image,
    blobPathname,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.redirect(new URL("/admin?tab=personen", request.url), 303);
}
