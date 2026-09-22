import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { getPersonenByPage } from "@/lib/personen";

export const metadata: Metadata = { title: "Geschäftsführer | VTG Rheinland-Pfalz" };

const aufgaben = [
  "sorgt für den Vollzug der Beschlüsse der Verbandsorgane",
  "erledigt die laufenden Geschäfte in eigener Zuständigkeit",
  "ist bevollmächtigt zum Abschluss von Verträgen",
  "ist Dienstvorgesetzter der Beschäftigten des Verbands",
  "nimmt an den Sitzungen der anderen Verbandsorgane ohne Stimmrecht teil",
];

export default async function GeschaeftsfuehrerPage() {
  const people = await getPersonenByPage("geschaeftsfuehrer");

  return (
    <>
      <PageHero title="Geschäftsführer" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Der hauptamtliche Geschäftsführer wird vom Vorstand mit
            Zustimmung der obersten Flurbereinigungsbehörde bestellt.
          </p>
          <p>Der Geschäftsführer</p>
          <ul className="list-disc space-y-2 pl-5">
            {aufgaben.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>
    </>
  );
}
