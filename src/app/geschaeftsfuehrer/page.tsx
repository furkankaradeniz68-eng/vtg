import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";

export const metadata: Metadata = { title: "Geschäftsführer | VTG Rheinland-Pfalz" };

const aufgaben = [
  "sorgt für den Vollzug der Beschlüsse der Verbandsorgane",
  "erledigt die laufenden Geschäfte in eigener Zuständigkeit",
  "ist bevollmächtigt zum Abschluss von Verträgen",
  "ist Dienstvorgesetzter der Beschäftigten des Verbands",
  "nimmt an den Sitzungen der anderen Verbandsorgane ohne Stimmrecht teil",
];

export default function GeschaeftsfuehrerPage() {
  return (
    <>
      <PageHero title="Geschäftsführer" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-4 text-base leading-relaxed text-neutral-700">
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
          <PersonCard
            person={{
              name: "Michael Zürker",
              role: "Geschäftsführer",
              address: "Zweibrückerstr. 70, 66894 Martinshöhe",
              phone: "(06321) 4911-11",
              mobile: "(0151) 10837906",
              fax: "(06321) 4911-7011",
              email: "michael.zuerker@vtg-rlp.de",
              image: "/images/personen/GS_Michael_Zuerker.jpg",
            }}
          />
          <PersonCard
            person={{
              name: "Guido Hübinger",
              role: "stellvertretender Geschäftsführer",
              address: "Zweibrückerstr. 70, 66894 Martinshöhe",
              phone: "(06321) 4911-4132",
              mobile: "(0151) 10837902",
              fax: "(06321) 4911-7132",
              email: "guido.huebinger@vtg-rlp.de",
              image: "/images/personen/SI_Guido_Huebinger.jpg",
            }}
          />
        </div>
      </section>
    </>
  );
}
