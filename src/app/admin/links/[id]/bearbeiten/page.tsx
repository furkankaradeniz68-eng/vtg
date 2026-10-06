import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLinkItem, getLinkCategoryNames } from "@/lib/links";

export const metadata: Metadata = { title: "Link bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default async function LinkBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categoryNames] = await Promise.all([getLinkItem(id), getLinkCategoryNames()]);
  if (!item) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=links" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Link bearbeiten</h1>

      <form
        action="/api/links/update"
        method="POST"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={item.id} />
        <div>
          <label htmlFor="category" className={labelClass}>Kategorie</label>
          <input
            id="category"
            name="category"
            list="category-options"
            defaultValue={item.category}
            required
            className={inputClass}
          />
          <datalist id="category-options">
            {categoryNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="label" className={labelClass}>Bezeichnung</label>
          <input id="label" name="label" defaultValue={item.label} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="href" className={labelClass}>URL</label>
          <input
            id="href"
            name="href"
            type="url"
            defaultValue={item.href}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Beschreibung (optional)</label>
          <input id="description" name="description" defaultValue={item.description} className={inputClass} />
        </div>
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>

      <form action="/api/links/delete" method="POST" className="mt-4">
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Link entfernen
        </button>
      </form>
    </section>
  );
}
