import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Neue Stellenausschreibung | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default function NeueStellenausschreibungPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=seiteninhalte" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Neue Stellenausschreibung</h1>

      <form
        action="/api/stellenausschreibung/add"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <div>
          <label htmlFor="title" className={labelClass}>Titel</label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Beschreibung</label>
          <textarea id="description" name="description" required rows={8} className={inputClass} />
        </div>
        <div>
          <label htmlFor="pdf" className={labelClass}>PDF (optional)</label>
          <input id="pdf" name="pdf" type="file" accept="application/pdf" className={inputClass} />
        </div>
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Hinzufügen
        </button>
      </form>
    </section>
  );
}
