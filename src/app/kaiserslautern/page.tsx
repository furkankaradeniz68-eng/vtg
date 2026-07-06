import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Kaiserslautern | VTG Rheinland-Pfalz" };

const team: Person[] = [
  {
    name: "Sascha Hartig",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4232",
    mobile: "(0151) 10837924",
    fax: "(06321) 4911-7232",
    email: "sascha.hartig@vtg-rlp.de",
    image: "/images/personen/KA_Sascha_Hartig.jpg",
  },
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
    name: "Arnold Ernst",
    role: "Bauaufsicht",
    mobile: "(0151) 10837907",
    email: "arnold.ernst@vtg-rlp.de",
    image: "/images/personen/KA_Arnold_Ernst.jpg",
  },
  {
    name: "Gabriele Kratz",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4235",
    fax: "(06321) 4911-7231",
    email: "gabriele.kratz@vtg-rlp.de",
    image: "/images/personen/KA_Gabriele_Kratz.jpg",
  },
];

export default function KaiserslauternPage() {
  return (
    <>
      <PageHero title="Außenstelle Kaiserslautern" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-base text-neutral-600">
          Fischerstraße 12, 67655 Kaiserslautern · Bereich: Bau, Landespflege
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
