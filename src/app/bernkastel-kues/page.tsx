import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Bernkastel-Kues | VTG Rheinland-Pfalz" };

const team: Person[] = [
  {
    name: "Guido Hübinger",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
  },
  {
    name: "Michael Krajewski",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4133",
    mobile: "(0151) 10837925",
    fax: "(06321) 4911-7133",
    email: "michael.krajewski@vtg-rlp.de",
    image: "/images/personen/BE_Michael_Krajewski.jpg",
  },
  {
    name: "Thomas Reusch",
    role: "Bauaufsicht",
    mobile: "(0151) 10837917",
    email: "thomas.reusch@vtg-rlp.de",
    image: "/images/personen/BE_Thomas_Reusch.jpg",
  },
  {
    name: "Andreas Scheer",
    role: "Bauaufsicht",
    mobile: "(0151) 10837918",
    email: "andreas.scheer@vtg-rlp.de",
  },
  {
    name: "Susanne Rieb",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4131",
    fax: "(06321) 4911-7131",
    email: "susanne.rieb@vtg-rlp.de",
    image: "/images/personen/BE_Susanne_Rieb.jpg",
  },
];

export default function BernkastelKuesPage() {
  return (
    <>
      <PageHero title="Bernkastel-Kues" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <p className="mt-2 text-base text-neutral-600">
          <strong>Aussenstelle Bernkastel-Kues</strong>
          <br />
          Pastorenpfad 2
          <br />
          54470 Bernkastel-Kues
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
