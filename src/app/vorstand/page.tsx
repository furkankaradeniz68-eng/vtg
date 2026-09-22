import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { getPersonenByPage, groupPersonenBySection } from "@/lib/personen";

export const metadata: Metadata = { title: "Vorstand | VTG Rheinland-Pfalz" };

export default async function VorstandPage() {
  const entries = await getPersonenByPage("vorstand");
  const groups = groupPersonenBySection(entries);
  const praesidium = groups.find((g) => g.section === "Präsidium")?.people ?? [];
  const gruppen = groups.filter((g) => g.section !== "Präsidium");

  return (
    <>
      <PageHero title="Vorstand" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Der ehrenamtliche Vorstand wird aus den Reihen der
            Teilnehmergemeinschaften auf 5 Jahre gewählt. Er besteht aus 9
            Mitgliedern. Jedes Vorstandsmitglied hat einen persönlichen
            Stellvertreter. Der Vorstand stellt den Jahresabschluss und den
            Wirtschaftsplan auf und beschließt insbesondere über
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>die Festsetzung der Beitragssätze</li>
            <li>die Aufnahme neuer Mitglieder</li>
            <li>die Bestellung und Entlassung des Geschäftsführers und seines Stellvertreters</li>
          </ul>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {praesidium.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>

        {gruppen.map((g) => (
          <div key={g.section} className="mt-10">
            {g.sectionMeta && (
              <p className="text-sm font-bold uppercase tracking-widest text-vtg-orange">{g.sectionMeta}</p>
            )}
            <h3 className="mt-2 font-heading text-xl font-bold text-neutral-900">{g.section}</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {g.people.map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
