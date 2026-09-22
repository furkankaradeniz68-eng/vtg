import type { Metadata } from "next";
import Link from "next/link";
import { PERSON_PAGES } from "@/lib/personen";

export const metadata: Metadata = { title: "Neue Person | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default function NeuePersonPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=personen" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Neue Person hinzufügen</h1>

      <form
        action="/api/personen/add"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <div>
          <label htmlFor="page" className={labelClass}>Seite</label>
          <select id="page" name="page" required className={inputClass}>
            {PERSON_PAGES.map((p) => (
              <option key={p.slug} value={p.slug}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="section" className={labelClass}>Bereich / Gruppe (optional)</label>
          <input id="section" name="section" className={inputClass} placeholder="z. B. Dienstsitz Montabaur, IT/Buchführung" />
        </div>
        <div>
          <label htmlFor="sectionMeta" className={labelClass}>Zusatzlabel über dem Bereich (optional, nur Vorstand)</label>
          <input id="sectionMeta" name="sectionMeta" className={inputClass} placeholder="z. B. DLR Westerwald – Osteifel" />
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>Rolle / Funktion</label>
          <input id="role" name="role" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="address" className={labelClass}>Adresse (optional)</label>
          <input id="address" name="address" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Telefon (optional)</label>
          <input id="phone" name="phone" className={inputClass} />
        </div>
        <div>
          <label htmlFor="mobile" className={labelClass}>Mobil (optional)</label>
          <input id="mobile" name="mobile" className={inputClass} />
        </div>
        <div>
          <label htmlFor="fax" className={labelClass}>Fax (optional)</label>
          <input id="fax" name="fax" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>E-Mail (optional)</label>
          <input id="email" name="email" type="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="image" className={labelClass}>Foto (optional)</label>
          <input id="image" name="image" type="file" accept="image/*" className={inputClass} />
        </div>
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Person hinzufügen
        </button>
      </form>
    </section>
  );
}
