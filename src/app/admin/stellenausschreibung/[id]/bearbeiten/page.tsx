import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStellenausschreibungById } from "@/lib/stellenausschreibung";

export const metadata: Metadata = { title: "Stellenausschreibung bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default async function StellenausschreibungBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getStellenausschreibungById(id);
  if (!entry) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=seiteninhalte" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Stellenausschreibung bearbeiten</h1>

      {entry.pdfFilename && (
        <p className="mb-4 text-sm text-neutral-600">
          Aktuell hinterlegtes PDF:{" "}
          <a href={`/api/stellenausschreibung/${entry.id}`} target="_blank" rel="noreferrer" className="text-vtg-orange hover:underline">
            {entry.pdfFilename}
          </a>
        </p>
      )}

      <form
        action="/api/stellenausschreibung/update"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={entry.id} />
        <div>
          <label htmlFor="title" className={labelClass}>Titel</label>
          <input id="title" name="title" required defaultValue={entry.title} className={inputClass} />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Beschreibung</label>
          <textarea
            id="description"
            name="description"
            required
            rows={8}
            defaultValue={entry.description}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="pdf" className={labelClass}>PDF ersetzen (optional)</label>
          <input id="pdf" name="pdf" type="file" accept="application/pdf" className={inputClass} />
        </div>
        {entry.pdfFilename && (
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="removePdf" />
            Aktuelles PDF entfernen
          </label>
        )}
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>

      <form action="/api/stellenausschreibung/delete" method="POST" className="mt-4">
        <input type="hidden" name="id" value={entry.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Stellenausschreibung entfernen
        </button>
      </form>
    </section>
  );
}
