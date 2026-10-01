import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUmlageRow } from "@/lib/umlage";

export const metadata: Metadata = { title: "Umlage bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default async function UmlageBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getUmlageRow(id);
  if (!row) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=mitgliederbereich" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Umlage {row.year} bearbeiten</h1>

      <form
        action="/api/umlage/update"
        method="POST"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={row.id} />
        <div>
          <label htmlFor="year" className={labelClass}>Jahr</label>
          <input id="year" name="year" type="number" defaultValue={row.year} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="percent" className={labelClass}>Umlage</label>
          <input id="percent" name="percent" defaultValue={row.percent} required className={inputClass} />
        </div>
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>

      <form action="/api/umlage/delete" method="POST" className="mt-4">
        <input type="hidden" name="id" value={row.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Zeile {row.year} entfernen
        </button>
      </form>
    </section>
  );
}
