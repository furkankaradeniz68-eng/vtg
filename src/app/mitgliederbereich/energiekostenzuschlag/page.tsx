import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Energiekostenzuschlag | VTG Rheinland-Pfalz" };

const columns = ["Jahr", "Monat", "Durchschnittspreis", "Zuschlag"];

const yearGroups: { year: number; rows: (string | number)[][] }[] = [
  {
    year: 2025,
    rows: [
      [2025, 12, "0,00 €", "0.0%"],
      [2025, 11, "0,00 €", "0.0%"],
      [2025, 10, "0,00 €", "0.0%"],
      [2025, 9, "0,00 €", "0.0%"],
      [2025, 8, "0,00 €", "0.0%"],
      [2025, 7, "0,00 €", "0.0%"],
      [2025, 6, "0,00 €", "0.0%"],
      [2025, 5, "1,60 €", "0.0%"],
      [2025, 4, "1,60 €", "0.0%"],
      [2025, 3, "1,57 €", "0.0%"],
      [2025, 2, "1,59 €", "0.0%"],
      [2025, 1, "1,63 €", "0.0%"],
    ],
  },
  {
    year: 2024,
    rows: [
      [2024, 12, "1,53 €", "0.0%"],
      [2024, 11, "1,55 €", "0.0%"],
      [2024, 10, "1,50 €", "0.0%"],
      [2024, 9, "1,50 €", "0.0%"],
      [2024, 8, "1,55 €", "0.0%"],
      [2024, 7, "1,60 €", "0.0%"],
      [2024, 6, "1,66 €", "0.0%"],
      [2024, 5, "1,66 €", "0.0%"],
      [2024, 4, "1,66 €", "0.0%"],
      [2024, 3, "1,65 €", "0.0%"],
      [2024, 2, "1,65 €", "0.0%"],
      [2024, 1, "1,59 €", "0.0%"],
    ],
  },
  {
    year: 2023,
    rows: [
      [2023, 12, "1,60 €", "0.0%"],
      [2023, 11, "1,66 €", "0.0%"],
      [2023, 10, "1,72 €", "1.0%"],
      [2023, 9, "1,75 €", "1.0%"],
      [2023, 8, "1,72 €", "1.0%"],
      [2023, 7, "1,54 €", "0.0%"],
      [2023, 6, "1,51 €", "0.0%"],
      [2023, 5, "1,51 €", "0.0%"],
      [2023, 4, "1,60 €", "0.0%"],
      [2023, 3, "1,65 €", "0.0%"],
      [2023, 2, "1,65 €", "0.0%"],
      [2023, 1, "1,67 €", "0.0%"],
    ],
  },
  {
    year: 2022,
    rows: [
      [2022, 12, "1,79 €", "0.0%"],
      [2022, 11, "1,99 €", "2.0%"],
      [2022, 10, "2,12 €", "5.0%"],
      [2022, 9, "2,07 €", "4.0%"],
      [2022, 8, "1,96 €", "2.0%"],
      [2022, 7, "1,94 €", "1.0%"],
      [2022, 6, "1,94 €", "1.0%"],
    ],
  },
];

export default async function EnergiekostenzuschlagPage() {
  await requireSession();
  return (
    <>
      <PageHero title="Energiekostenzuschlag" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
          VTG Rheinland-Pfalz
        </h2>
        <div className="space-y-10">
          {yearGroups.map((group) => (
            <div key={group.year}>
              <p className="mb-4 text-base leading-relaxed text-neutral-700">
                Der Energiekostenzuschlag im Jahr {group.year}.
              </p>
              <div className="max-w-md">
                <SimpleTable columns={columns} rows={group.rows} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
