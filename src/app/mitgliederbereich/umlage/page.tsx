import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Umlage | VTG Rheinland-Pfalz" };

const rows: (string | number)[][] = [
  [2017, "9,3%"],
  [2018, "10,5%"],
  [2019, "10,5%"],
  [2020, "12,6%"],
  [2021, "12,6%"],
  [2022, "13%"],
  [2023, "13%"],
  [2024, "13%"],
];

export default async function UmlagePage() {
  await requireSession();
  return (
    <>
      <PageHero title="Umlage" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-xs">
          <SimpleTable columns={["Jahr", "Prozent"]} rows={rows} />
        </div>
        <div className="space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Der personelle und sächliche Aufwand für die Geschäftsstelle sowie
            für die der Geschäftsstelle zugeordneten Bediensteten in den
            Kulturamtsbezirken ist von den Mitgliedern durch eine jährliche
            Umlage aufzubringen; dazu gehören die Kosten für Gebäude bzw.
            Räume, EDV-Ausstattung usw. Mit der Umlage werden somit
            diejenigen Kosten finanziert, die für die Durchführung der
            Kassengeschäfte und des Bauwesens erforderlich sind und nicht
            über Beitragseinnahmen (Stundensätze) des Eigenregiebetriebes
            abgedeckt sind.
          </p>
          <p>
            In der Umlage enthalten ist auch die Haftpflichtversicherung für
            die Teilnehmergemeinschaften. Der Versicherungsschutz beginnt
            automatisch mit der Mitgliedschaft im VTG.
          </p>
          <p>
            Die anteilige Höhe der Umlage richtet sich in der Regel nach dem
            Verhältnis der jährlichen Ausführungskosten des einzelnen
            Mitglieds zu den Gesamtausführungskosten aller Mitglieder im
            jeweiligen Jahr.
          </p>
          <p>
            Sie wird dreimal pro Jahr, in der Regel zum 1. April, 1. August
            und 1. Dezember, erhoben.
          </p>
          <p>
            Über die Höhe der Umlage und Ausnahmen beschließt die
            Mitgliederversammlung.
          </p>
        </div>
      </section>
    </>
  );
}
