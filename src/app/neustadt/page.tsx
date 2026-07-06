import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Neustadt | VTG Rheinland-Pfalz" };

const team: Person[] = [
  {
    name: "Ralf Umbach",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4433",
    mobile: "(0151) 10837941",
    fax: "(06321) 4911-7433",
    email: "ralf.umbach@vtg-rlp.de",
    image: "/images/personen/NE_Ralf_Umbach.jpg",
  },
  {
    name: "Heinrich Wyrott",
    role: "Bauaufsicht",
    phone: "(06321) 4911-4434",
    mobile: "(0151) 10837905",
    fax: "(06321) 4911-7434",
    email: "heinrich.wyrott@vtg-rlp.de",
    image: "/images/personen/NE_Heinrich_Wyrott.jpg",
  },
];

export default function NeustadtPage() {
  return (
    <>
      <PageHero title="Neustadt" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <p className="mt-2 text-base text-neutral-600">
          <strong>Aussenstelle Neustadt</strong>
          <br />
          Roßlaufstraße 17
          <br />
          67433 Neustadt
        </p>
        <h2 className="mt-8 font-heading text-xl font-bold text-neutral-900">Bau, Landespflege</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {team.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </section>
    </>
  );
}
