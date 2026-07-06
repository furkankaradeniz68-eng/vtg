import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Simmern/Bad Kreuznach | VTG Rheinland-Pfalz" };

const team: Person[] = [
  {
    name: "Bartholomäus Stoltmann",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4632",
    mobile: "(0151) 10837945",
    fax: "(06321) 4911-7632",
    email: "bartholomaeus.stoltmann@vtg-rlp.de",
    image: "/images/personen/SI_Bartholomaeus_Stoltmann.jpg",
  },
  {
    name: "Sylvia Pulcher",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4631",
    fax: "(06321) 4911-7631",
    email: "sylvia.pulcher@vtg-rlp.de",
    image: "/images/personen/SI_Sylvia_Pulcher.jpg",
  },
];

export default function SimmernBadKreuznachPage() {
  return (
    <>
      <PageHero title="Außenstelle Simmern" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-base text-neutral-600">
          Schlossplatz 10, 55469 Simmern · Bereich: Bau, Landespflege
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {team.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </section>
    </>
  );
}
