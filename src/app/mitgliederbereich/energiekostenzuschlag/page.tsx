import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import EnergiekostenChart from "@/components/EnergiekostenChart";
import { requireSession } from "@/lib/auth";
import { getEnergiekostenYears } from "@/lib/energiekostenzuschlag";

export const metadata: Metadata = { title: "Energiekostenzuschlag | VTG Rheinland-Pfalz" };

const columns = ["Jahr", "Monat", "Durchschnittspreis", "Zuschlag"];

export default async function EnergiekostenzuschlagPage() {
  await requireSession();
  const years = await getEnergiekostenYears();

  return (
    <>
      <PageHero title="Energiekostenzuschlag" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
          VTG Rheinland-Pfalz
        </h2>
        <div className="space-y-10">
          {years.map((group) => (
            <div key={group.year}>
              <p className="mb-4 text-base leading-relaxed text-neutral-700">
                Der Energiekostenzuschlag im Jahr {group.year}.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-stretch">
                <SimpleTable
                  columns={columns}
                  rows={group.rows.map((r) => [group.year, r.month, r.price, r.percent])}
                />
                <div className="min-h-[220px]">
                  <EnergiekostenChart rows={group.rows.map((r) => ({ month: r.month, percent: r.percent }))} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
