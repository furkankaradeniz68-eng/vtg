import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Prüm/Bitburg/Trier | VTG Rheinland-Pfalz" };

const team: Person[] = [
  {
    name: "Dirk Thiex",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4532",
    mobile: "(0151) 10837943",
    fax: "(06321) 4911-7532",
    email: "dirk.thiex@vtg-rlp.de",
    image: "/images/personen/PR_Dirk_Thiex.jpg",
  },
  {
    name: "Sascha Weiler",
    role: "Bauaufsicht",
    mobile: "(0151) 10837920",
  },
  {
    name: "Jutta Hoffmann",
    role: "Information, Verwaltung, Mahnwesen",
    phone: "(06321) 4911-4531",
    fax: "(06321) 4911-7531",
    email: "jutta.hoffmann@vtg-rlp.de",
    image: "/images/personen/PR_Jutta_Hoffmann.jpg",
  },
];

export default function PruemBitburgTrierPage() {
  return (
    <>
      <PageHero title="Prüm / Bitburg / Trier" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <p className="mt-2 text-base text-neutral-600">
          <strong>Aussenstelle Prüm</strong>
          <br />
          Oberbergstrasse 10
          <br />
          54595 Prüm
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
