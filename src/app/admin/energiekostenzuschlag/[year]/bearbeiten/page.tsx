import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnergiekostenYear, type EnergiekostenRow } from "@/lib/energiekostenzuschlag";

export const metadata: Metadata = { title: "Energiekostenzuschlag bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

const MONTH_NAMES = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export default async function EnergiekostenzuschlagBearbeitenPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearParam } = await params;
  const year = Number.parseInt(yearParam, 10);
  if (!Number.isFinite(year)) notFound();

  const entry = await getEnergiekostenYear(year);
  if (!entry) notFound();

  const rowsByMonth = new Map<number, EnergiekostenRow>(entry.rows.map((r) => [r.month, r]));

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=mitgliederbereich" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">
        Energiekostenzuschlag {entry.year} bearbeiten
      </h1>
      <p className="mb-6 text-sm text-neutral-600">
        Monate ohne eingetragenen Preis werden beim Speichern nicht übernommen (leeres Jahr /
        unvollständiges Jahr bleiben so möglich).
      </p>

      <form
        action="/api/energiekostenzuschlag/update"
        method="POST"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="year" value={entry.year} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MONTH_NAMES.map((name, i) => {
            const month = i + 1;
            const row = rowsByMonth.get(month);
            return (
              <fieldset key={month} className="rounded border border-neutral-200 p-3">
                <legend className="px-1 text-sm font-medium text-neutral-800">{name}</legend>
                <div className="flex flex-col gap-2">
                  <div>
                    <label htmlFor={`price-${month}`} className={labelClass}>Durchschnittspreis</label>
                    <input
                      id={`price-${month}`}
                      name={`price-${month}`}
                      defaultValue={row?.price ?? ""}
                      placeholder="1,60 €"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor={`percent-${month}`} className={labelClass}>Zuschlag</label>
                    <input
                      id={`percent-${month}`}
                      name={`percent-${month}`}
                      defaultValue={row?.percent ?? ""}
                      placeholder="0.0%"
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>
            );
          })}
        </div>
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>

      <form action="/api/energiekostenzuschlag/delete-year" method="POST" className="mt-4">
        <input type="hidden" name="year" value={entry.year} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Jahr {entry.year} entfernen
        </button>
      </form>
    </section>
  );
}
