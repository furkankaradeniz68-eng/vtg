import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { type Person } from "@/components/PersonCard";

export const metadata: Metadata = { title: "Vorstand | VTG Rheinland-Pfalz" };

const praesidium: Person[] = [
  {
    name: "Michael Haack",
    role: "Präsident",
    address: "Zweibrückerstr. 70, 66894 Martinshöhe",
    phone: "(06372) 61238",
    image: "/images/personen/vorstand/VS_MichaelHaack.JPG",
  },
  {
    name: "Werner Görgen",
    role: "stellvertretender Präsident",
    address: "Weinbergstr. 1a, 54517 Platten",
    phone: "(06535) 807",
    image: "/images/personen/vorstand/VS_WernerGörgen.JPG",
  },
];

type Gruppe = {
  dlr?: string;
  dienstsitz: string;
  mitglied: Person;
  vertreter: Person;
};

const gruppen: Gruppe[] = [
  {
    dlr: "DLR Westerwald – Osteifel",
    dienstsitz: "Dienstsitz Montabaur",
    mitglied: {
      name: "Eckhard Hölzemann",
      role: "Vorstandsmitglied",
      address: "Bergstr. 9, 57641 Oberlahr",
      phone: "(02685) 70150",
      image: "/images/personen/vorstand/VS_EckhardHölzemann.JPG",
    },
    vertreter: {
      name: "Uwe Holstein",
      role: "Vertreter",
      address: "Hof Meiseneck, 56357 Bogel",
      phone: "(0160) 2627748",
      image: "/images/personen/vorstand/VS_UweHolstein.jpg",
    },
  },
  {
    dienstsitz: "Dienstsitz Mayen",
    mitglied: {
      name: "Hubert Pauly",
      role: "Vorstandsmitglied",
      address: "Bachstr. 22, 53507 Dernau",
      phone: "(0174) 4028616",
      image: "/images/personen/vorstand/VS_HubertPauly.jpg",
    },
    vertreter: {
      name: "Bernhard Heep",
      role: "Vertreter",
      address: "Gartenstr. 3, 56825 Gevenich",
      phone: "(0171) 2297213",
      image: "/images/personen/vorstand/VS_BernhardHeep.JPG",
    },
  },
  {
    dlr: "DLR Eifel",
    dienstsitz: "Dienstsitz Prüm",
    mitglied: {
      name: "Thomas Neises",
      role: "Vorstandsmitglied",
      address: "Meilbrücker Str. 14, 54636 Idenheim",
      phone: "(06506) 910077",
      image: "/images/personen/vorstand/VS_ThomasNeises.JPG",
    },
    vertreter: {
      name: "Norbert Schenten",
      role: "Vertreter",
      address: "Kapellenstr. 9, 54689 Jucken",
      phone: "(06550) 960036",
      image: "/images/personen/vorstand/VS_NorbertSchenten.JPG",
    },
  },
  {
    dlr: "DLR Mosel",
    dienstsitz: "Dienstsitz Bernkastel – Kues",
    mitglied: {
      name: "Werner Görgen",
      role: "Vorstandsmitglied",
      address: "Weinbergstr. 1a, 54517 Platten",
      phone: "(06535) 807",
      image: "/images/personen/vorstand/VS_WernerGörgen.JPG",
    },
    vertreter: {
      name: "Karl-Josef Heinz",
      role: "Vertreter",
      address: "Panoramastr. 54, 54470 Graach",
      phone: "(06531) 7154",
      image: "/images/personen/vorstand/VS_KarlJosefHeinz.JPG",
    },
  },
  {
    dienstsitz: "Dienstsitz Trier",
    mitglied: {
      name: "Otto Minn",
      role: "Vorstandsmitglied",
      address: "Hauptstr. 1, 54441 Ockfen",
      phone: "(0171) 2672769",
      image: "/images/personen/vorstand/VS_OttoMinn.jpg",
    },
    vertreter: {
      name: "Klaus Bodem",
      role: "Vertreter",
      address: "Schulstr. 13, 54451 Irsch",
      phone: "(06581) 5703",
      image: "/images/personen/vorstand/VS_KlausBodem.JPG",
    },
  },
  {
    dlr: "DLR Rheinhessen-Nahe-Hunsrück",
    dienstsitz: "Dienstsitz Simmern",
    mitglied: {
      name: "Hans Herbert Laux",
      role: "Vorstandsmitglied",
      address: "Rother Pfad 7, 56290 Uhler",
      phone: "(06762) 1893",
      image: "/images/personen/vorstand/VS_HansHerbertLaux.JPG",
    },
    vertreter: {
      name: "Günter Schlemmer",
      role: "Vertreter",
      address: "Im Bungert 8, 56154 Boppard Weiler",
      phone: "(06742) 6618",
      image: "/images/personen/vorstand/VS_GünterSchlemmer.JPG",
    },
  },
  {
    dienstsitz: "Dienstsitz Bad Kreuznach",
    mitglied: {
      name: "Karl-Heinz Becker",
      role: "Vorstandsmitglied",
      address: "Herrgasse 9, 55232 Ensheim",
      phone: "(06732) 7895",
      image: "/images/personen/vorstand/VS_KarlHeinzBecker.jpg",
    },
    vertreter: {
      name: "Hans Joachim Raddeck",
      role: "Vertreter",
      address: "Am Hummertal 100, 55283 Nierstein",
      phone: "(06133) 58115",
      image: "/images/personen/vorstand/VS_HansJoachimRaddeck.jpg",
    },
  },
  {
    dlr: "DLR Westpfalz",
    dienstsitz: "Dienstsitz Kaiserslautern",
    mitglied: {
      name: "Michael Haack",
      role: "Vorstandsmitglied",
      address: "Zweibrückerstr. 70, 66894 Martinshöhe",
      phone: "(06372) 61238",
      image: "/images/personen/vorstand/VS_MichaelHaack.JPG",
    },
    vertreter: {
      name: "Ralf Klein",
      role: "Vertreter",
      address: "Liebsthaler Str. 12a, 66909 Quirnbach",
      phone: "(06383) 6673",
      image: "/images/personen/vorstand/VS_RalfKlein.JPG",
    },
  },
  {
    dlr: "DLR Rheinland-Pfalz",
    dienstsitz: "Dienstsitz Neustadt",
    mitglied: {
      name: "Jörg Kuhmann",
      role: "Vorstandsmitglied",
      address: "Kirchheimer Str. 6, 67273 Weisenheim a.B.",
      phone: "(06353) 8450",
      image: "/images/personen/vorstand/VS_JörgKuhmann.JPG",
    },
    vertreter: {
      name: "Thorsten Langenwalter",
      role: "Vertreter",
      address: "Bahnhofstr. 45, 67256 Weisenheim a.S.",
      phone: "(06353) 7390",
      image: "/images/personen/vorstand/VS_ThorstenLangenwalter.jpg",
    },
  },
];

export default function VorstandPage() {
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
            <PersonCard key={p.name + p.role} person={p} />
          ))}
        </div>

        {gruppen.map((g) => (
          <div key={g.dienstsitz} className="mt-10">
            {g.dlr && (
              <p className="text-sm font-bold uppercase tracking-widest text-vtg-orange">{g.dlr}</p>
            )}
            <h3 className="mt-2 font-heading text-xl font-bold text-neutral-900">{g.dienstsitz}</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <PersonCard person={g.mitglied} />
              <PersonCard person={g.vertreter} />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
