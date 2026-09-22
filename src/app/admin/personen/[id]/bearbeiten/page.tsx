import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersonById, PERSON_PAGES } from "@/lib/personen";

export const metadata: Metadata = { title: "Person bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default async function PersonBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPersonById(id);
  if (!person) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=personen" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Person bearbeiten</h1>

      {person.image && (
        <Image
          src={person.image}
          alt={person.name}
          width={74}
          height={103}
          className="mb-4 h-auto w-14 rounded"
        />
      )}

      <form
        action="/api/personen/update"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={person.id} />
        <input type="hidden" name="order" value={person.order} />
        <div>
          <label htmlFor="page" className={labelClass}>Seite</label>
          <select id="page" name="page" required defaultValue={person.page} className={inputClass}>
            {PERSON_PAGES.map((p) => (
              <option key={p.slug} value={p.slug}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="section" className={labelClass}>Bereich / Gruppe (optional)</label>
          <input id="section" name="section" defaultValue={person.section ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="sectionMeta" className={labelClass}>Zusatzlabel über dem Bereich (optional, nur Vorstand)</label>
          <input id="sectionMeta" name="sectionMeta" defaultValue={person.sectionMeta ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" required defaultValue={person.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>Rolle / Funktion</label>
          <input id="role" name="role" required defaultValue={person.role} className={inputClass} />
        </div>
        <div>
          <label htmlFor="address" className={labelClass}>Adresse (optional)</label>
          <input id="address" name="address" defaultValue={person.address ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Telefon (optional)</label>
          <input id="phone" name="phone" defaultValue={person.phone ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="mobile" className={labelClass}>Mobil (optional)</label>
          <input id="mobile" name="mobile" defaultValue={person.mobile ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="fax" className={labelClass}>Fax (optional)</label>
          <input id="fax" name="fax" defaultValue={person.fax ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>E-Mail (optional)</label>
          <input id="email" name="email" type="email" defaultValue={person.email ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="image" className={labelClass}>Foto ersetzen (optional)</label>
          <input id="image" name="image" type="file" accept="image/*" className={inputClass} />
        </div>
        {person.image && (
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="removeImage" />
            Aktuelles Foto entfernen (Platzhalter anzeigen)
          </label>
        )}
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>

      <form action="/api/personen/delete" method="POST" className="mt-4">
        <input type="hidden" name="id" value={person.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Person entfernen
        </button>
      </form>
    </section>
  );
}
