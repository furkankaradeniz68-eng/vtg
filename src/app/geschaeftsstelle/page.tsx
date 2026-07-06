import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Geschäftsstelle | VTG Rheinland-Pfalz" };

const geschaeftsfuehrung: Person[] = [
  {
    name: "Michael Zürker",
    role: "Geschäftsführer",
    phone: "(06321) 4911-11",
    mobile: "(0151) 10837906",
    fax: "(06321) 4911-7011",
    email: "michael.zuerker@vtg-rlp.de",
    image: "/images/personen/GS_Michael_Zuerker.jpg",
  },
  {
    name: "Guido Hübinger",
    role: "stellvertretender Geschäftsführer",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
  },
];

const personalOrganisation: Person[] = [
  {
    name: "Michael Zürker",
    role: "Geschäftsbereichsleitung",
    phone: "(06321) 4911-11",
    mobile: "(0151) 10837906",
    fax: "(06321) 4911-7011",
    email: "michael.zuerker@vtg-rlp.de",
    image: "/images/personen/GS_Michael_Zuerker.jpg",
  },
  {
    name: "Manja Düben",
    role: "Mitgliederbetreuung / Personalverwaltung",
    phone: "(06321) 4911-10",
    fax: "(06321) 4911-7010",
    email: "manja.dueben@vtg-rlp.de",
    image: "/images/personen/GS_Manja_Dueben.jpg",
  },
];

const itBuchfuehrung: Person[] = [
  {
    name: "Umut Caglar",
    role: "Geschäftsbereichsleitung",
    phone: "(06321) 4911-12",
    fax: "(06321) 4911-7012",
    email: "umut.caglar@vtg-rlp.de",
  },
  {
    name: "Elena Böttger",
    role: "Sachgebietsleitung VTG (Buchführung und Rechnungswesen)",
    phone: "(06321) 4911-21",
    fax: "(06321) 4911-7021",
    email: "elena.boettger@vtg-rlp.de",
    image: "/images/personen/GS_Elena_Boettger.jpg",
  },
  {
    name: "Olga Kullmann",
    role: "Sachgebietsleitung TG (Buchführung und Rechnungswesen)",
    phone: "(06321) 4911-23",
    fax: "(06321) 4911-7023",
    email: "olga.kullmann@vtg-rlp.de",
    image: "/images/personen/GS_Olga_Kullmann.jpg",
  },
  {
    name: "Gülten Güney",
    role: "TG-Buchführung",
    phone: "(06321) 4911-26",
    fax: "(06321) 4911-7026",
    email: "guelten.gueney@vtg-rlp.de",
    image: "/images/personen/GS_Guelten_Gueney.jpg",
  },
  {
    name: "Daniela Hess",
    role: "VTG-Buchführung",
    phone: "(06321) 4911-22",
    fax: "(06321) 4911-7022",
    email: "daniela.hess@vtg-rlp.de",
    image: "/images/personen/GS_Daniela_Hess.jpg",
  },
  {
    name: "Ira Kohleber",
    role: "TG-Buchführung",
    phone: "(06321) 4911-35",
    fax: "(06321) 4911-7035",
    email: "ira.kohleber@vtg-rlp.de",
    image: "/images/personen/GS_Ira_Kohleber.jpg",
  },
  {
    name: "Kristina Neu",
    role: "TG-Buchführung",
    phone: "(06321) 4911-29",
    fax: "(06321) 4911-7029",
    email: "kristina.neu@vtg-rlp.de",
  },
  {
    name: "Maximilian Zerr",
    role: "Sachgebietsleitung IT, zentrale Datenverarbeitung",
    phone: "(06321) 4911-31",
    fax: "(06321) 4911-7031",
    email: "maximilian.zerr@vtg-rlp.de",
    image: "/images/personen/GS_Maximilian_Zerr.jpg",
  },
  {
    name: "Alexander Jung",
    role: "IT Systemadministration",
    phone: "(06321) 4911-19",
    fax: "(06321) 4911-7019",
    email: "alexander.jung@vtg-rlp.de",
    image: "/images/personen/GS_Alexander_Jung.jpg",
  },
];

const bauLandespflege: Person[] = [
  {
    name: "Guido Hübinger",
    role: "Geschäftsbereichsleitung",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
  },
  {
    name: "Manja Düben",
    role: "Personalverwaltung / Faktura",
    phone: "(06321) 4911-10",
    fax: "(06321) 4911-7010",
    email: "manja.dueben@vtg-rlp.de",
    image: "/images/personen/GS_Manja_Dueben.jpg",
  },
];

function Gruppe({ title, people }: { title: string; people: Person[] }) {
  return (
    <div className="mt-10">
      <h2 className="font-heading text-xl font-bold text-neutral-900">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {people.map((p) => (
          <PersonCard key={p.name + p.role} person={p} />
        ))}
      </div>
    </div>
  );
}

export default function GeschaeftsstellePage() {
  return (
    <>
      <PageHero title="Geschäftsstelle" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <p className="mt-4 text-base text-neutral-600">Roßlaufstraße 17, 67433 Neustadt</p>
        <p className="mt-2 text-base leading-relaxed text-neutral-700">
          Tel. (06321) 4911-0 · E-Mail:{" "}
          <a href="mailto:info@vtg-rlp.de" className="text-vtg-orange hover:underline">
            info@vtg-rlp.de
          </a>
        </p>
        <Gruppe title="Geschäftsführung" people={geschaeftsfuehrung} />
        <Gruppe title="Personal, Organisation, Recht, Grundsatzfragen" people={personalOrganisation} />
        <Gruppe title="IT, Buchführung, Zahlungsmanagement" people={itBuchfuehrung} />
        <Gruppe title="Bau, Landespflege, Vergabe" people={bauLandespflege} />
      </section>
    </>
  );
}
