import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Mayen/Montabaur | VTG Rheinland-Pfalz" };

const team: Person[] = [
  {
    name: "Josef Oster-Daum",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4332",
    mobile: "(0151) 10837904",
    fax: "(06321) 4911-7332",
    email: "josef.oster-daum@vtg-rlp.de",
    image: "/images/personen/MA_Josef_Oster-Daum.jpg",
  },
  {
    name: "Christian Geisbüsch",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4333",
    mobile: "(0151) 10837939",
    fax: "(06321) 4911-7333",
    email: "christian.geisbuesch@vtg-rlp.de",
    image: "/images/personen/MA_Christian_Geisbuesch.jpg",
  },
  {
    name: "Thomas Pätz",
    role: "Bauaufsicht",
    mobile: "(0151) 10837933",
    image: "/images/personen/MO_Thomas_Paetz.jpg",
  },
  {
    name: "Ralf Bohr",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4331",
    fax: "(06321) 4911-7331",
    email: "ralf.bohr@vtg-rlp.de",
    image: "/images/personen/MA_Ralf_Bohr.jpg",
  },
];

export default function MayenMontabaurPage() {
  return (
    <>
      <PageHero title="Mayen/Montabaur" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <p className="mt-2 text-base text-neutral-600">
          <strong>Aussenstelle Mayen</strong>
          <br />
          Bannerberg 4
          <br />
          56727 Mayen
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
