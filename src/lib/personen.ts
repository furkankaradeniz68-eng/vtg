// Personen/Mitarbeiter-Daten fuer die Organisations-Unterseiten (Vorstand,
// Geschaeftsstelle, Praesident, Geschaeftsfuehrer und die Aussenstellen-Seiten).
// Frueher waren diese Listen pro Seite hart codiert; jetzt liegen sie in
// privatem Vercel-Blob-Speicher, damit Admins sie ueber /admin ohne
// Code-Deploy pflegen koennen (Analog zu public-downloads.ts).
//
// Fotos: bestehende (migrierte) Eintraege verweisen weiterhin auf statische
// Dateien unter /public/images/personen (kein blobPathname). Von Admins neu
// hochgeladene oder ersetzte Fotos werden als oeffentlich lesbare Blobs unter
// personen/{id}-{dateiname} gespeichert (image = volle Blob-URL, blobPathname
// gesetzt, damit beim Ersetzen/Loeschen der alte Blob aufgeraeumt wird).
import { put, del, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const META_PATHNAME = "personen-meta.json";

export type PersonPageSlug =
  | "vorstand"
  | "geschaeftsstelle"
  | "praesident"
  | "geschaeftsfuehrer"
  | "neustadt"
  | "bernkastel-kues"
  | "simmern-bad-kreuznach"
  | "kaiserslautern"
  | "pruem-bitburg-trier"
  | "mayen-montabaur";

export const PERSON_PAGES: { slug: PersonPageSlug; label: string }[] = [
  { slug: "vorstand", label: "Vorstand" },
  { slug: "geschaeftsstelle", label: "Geschäftsstelle" },
  { slug: "praesident", label: "Präsident" },
  { slug: "geschaeftsfuehrer", label: "Geschäftsführer" },
  { slug: "neustadt", label: "Neustadt" },
  { slug: "bernkastel-kues", label: "Bernkastel-Kues" },
  { slug: "simmern-bad-kreuznach", label: "Simmern/Bad Kreuznach" },
  { slug: "kaiserslautern", label: "Kaiserslautern" },
  { slug: "pruem-bitburg-trier", label: "Prüm/Bitburg/Trier" },
  { slug: "mayen-montabaur", label: "Mayen/Montabaur" },
];

export function personPageLabel(slug: string): string {
  return PERSON_PAGES.find((p) => p.slug === slug)?.label ?? slug;
}

export type PersonEntry = {
  id: string;
  page: PersonPageSlug;
  // Ueberschrift der Gruppe innerhalb der Seite, z.B. "Präsidium",
  // "Dienstsitz Montabaur", "Geschäftsführung". Optional (manche Seiten
  // zeigen keine Zwischenueberschrift).
  section?: string;
  // Zusatzlabel ueber der section-Ueberschrift (nur Vorstand: DLR-Name).
  sectionMeta?: string;
  // Reihenfolge innerhalb der Seite/Gruppe.
  order: number;
  name: string;
  role: string;
  address?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  image?: string;
  blobPathname?: string;
  updatedAt: string;
};

const SEED_DATE = new Date(0).toISOString();

const DEFAULT_ENTRIES: PersonEntry[] = [
  // ---- Vorstand: Praesidium ----
  {
    id: "seed-vorstand-01",
    page: "vorstand",
    section: "Präsidium",
    order: 0,
    name: "Michael Haack",
    role: "Präsident",
    address: "Zweibrückerstr. 70, 66894 Martinshöhe",
    phone: "(06372) 61238",
    image: "/images/personen/vorstand/VS_MichaelHaack.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-02",
    page: "vorstand",
    section: "Präsidium",
    order: 1,
    name: "Werner Görgen",
    role: "stellvertretender Präsident",
    address: "Weinbergstr. 1a, 54517 Platten",
    phone: "(06535) 807",
    image: "/images/personen/vorstand/VS_WernerGörgen.JPG",
    updatedAt: SEED_DATE,
  },
  // ---- Vorstand: Gruppen (Dienstsitze) ----
  {
    id: "seed-vorstand-03",
    page: "vorstand",
    section: "Dienstsitz Montabaur",
    sectionMeta: "DLR Westerwald – Osteifel",
    order: 2,
    name: "Eckhard Hölzemann",
    role: "Vorstandsmitglied",
    address: "Bergstr. 9, 57641 Oberlahr",
    phone: "(02685) 70150",
    image: "/images/personen/vorstand/VS_EckhardHölzemann.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-04",
    page: "vorstand",
    section: "Dienstsitz Montabaur",
    sectionMeta: "DLR Westerwald – Osteifel",
    order: 3,
    name: "Uwe Holstein",
    role: "Vertreter",
    address: "Hof Meiseneck, 56357 Bogel",
    phone: "(0160) 2627748",
    image: "/images/personen/vorstand/VS_UweHolstein.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-05",
    page: "vorstand",
    section: "Dienstsitz Mayen",
    order: 4,
    name: "Hubert Pauly",
    role: "Vorstandsmitglied",
    address: "Bachstr. 22, 53507 Dernau",
    phone: "(0174) 4028616",
    image: "/images/personen/vorstand/VS_HubertPauly.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-06",
    page: "vorstand",
    section: "Dienstsitz Mayen",
    order: 5,
    name: "Bernhard Heep",
    role: "Vertreter",
    address: "Gartenstr. 3, 56825 Gevenich",
    phone: "(0171) 2297213",
    image: "/images/personen/vorstand/VS_BernhardHeep.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-07",
    page: "vorstand",
    section: "Dienstsitz Prüm",
    sectionMeta: "DLR Eifel",
    order: 6,
    name: "Thomas Neises",
    role: "Vorstandsmitglied",
    address: "Meilbrücker Str. 14, 54636 Idenheim",
    phone: "(06506) 910077",
    image: "/images/personen/vorstand/VS_ThomasNeises.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-08",
    page: "vorstand",
    section: "Dienstsitz Prüm",
    sectionMeta: "DLR Eifel",
    order: 7,
    name: "Norbert Schenten",
    role: "Vertreter",
    address: "Kapellenstr. 9, 54689 Jucken",
    phone: "(06550) 960036",
    image: "/images/personen/vorstand/VS_NorbertSchenten.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-09",
    page: "vorstand",
    section: "Dienstsitz Bernkastel – Kues",
    sectionMeta: "DLR Mosel",
    order: 8,
    name: "Werner Görgen",
    role: "Vorstandsmitglied",
    address: "Weinbergstr. 1a, 54517 Platten",
    phone: "(06535) 807",
    image: "/images/personen/vorstand/VS_WernerGörgen.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-10",
    page: "vorstand",
    section: "Dienstsitz Bernkastel – Kues",
    sectionMeta: "DLR Mosel",
    order: 9,
    name: "Karl-Josef Heinz",
    role: "Vertreter",
    address: "Panoramastr. 54, 54470 Graach",
    phone: "(06531) 7154",
    image: "/images/personen/vorstand/VS_KarlJosefHeinz.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-11",
    page: "vorstand",
    section: "Dienstsitz Trier",
    order: 10,
    name: "Otto Minn",
    role: "Vorstandsmitglied",
    address: "Hauptstr. 1, 54441 Ockfen",
    phone: "(0171) 2672769",
    image: "/images/personen/vorstand/VS_OttoMinn.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-12",
    page: "vorstand",
    section: "Dienstsitz Trier",
    order: 11,
    name: "Klaus Bodem",
    role: "Vertreter",
    address: "Schulstr. 13, 54451 Irsch",
    phone: "(06581) 5703",
    image: "/images/personen/vorstand/VS_KlausBodem.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-13",
    page: "vorstand",
    section: "Dienstsitz Simmern",
    sectionMeta: "DLR Rheinhessen-Nahe-Hunsrück",
    order: 12,
    name: "Hans Herbert Laux",
    role: "Vorstandsmitglied",
    address: "Rother Pfad 7, 56290 Uhler",
    phone: "(06762) 1893",
    image: "/images/personen/vorstand/VS_HansHerbertLaux.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-14",
    page: "vorstand",
    section: "Dienstsitz Simmern",
    sectionMeta: "DLR Rheinhessen-Nahe-Hunsrück",
    order: 13,
    name: "Günter Schlemmer",
    role: "Vertreter",
    address: "Im Bungert 8, 56154 Boppard Weiler",
    phone: "(06742) 6618",
    image: "/images/personen/vorstand/VS_GünterSchlemmer.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-15",
    page: "vorstand",
    section: "Dienstsitz Bad Kreuznach",
    order: 14,
    name: "Karl-Heinz Becker",
    role: "Vorstandsmitglied",
    address: "Herrgasse 9, 55232 Ensheim",
    phone: "(06732) 7895",
    image: "/images/personen/vorstand/VS_KarlHeinzBecker.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-16",
    page: "vorstand",
    section: "Dienstsitz Bad Kreuznach",
    order: 15,
    name: "Hans Joachim Raddeck",
    role: "Vertreter",
    address: "Am Hummertal 100, 55283 Nierstein",
    phone: "(06133) 58115",
    image: "/images/personen/vorstand/VS_HansJoachimRaddeck.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-17",
    page: "vorstand",
    section: "Dienstsitz Kaiserslautern",
    sectionMeta: "DLR Westpfalz",
    order: 16,
    name: "Michael Haack",
    role: "Vorstandsmitglied",
    address: "Zweibrückerstr. 70, 66894 Martinshöhe",
    phone: "(06372) 61238",
    image: "/images/personen/vorstand/VS_MichaelHaack.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-18",
    page: "vorstand",
    section: "Dienstsitz Kaiserslautern",
    sectionMeta: "DLR Westpfalz",
    order: 17,
    name: "Ralf Klein",
    role: "Vertreter",
    address: "Liebsthaler Str. 12a, 66909 Quirnbach",
    phone: "(06383) 6673",
    image: "/images/personen/vorstand/VS_RalfKlein.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-19",
    page: "vorstand",
    section: "Dienstsitz Neustadt",
    sectionMeta: "DLR Rheinland-Pfalz",
    order: 18,
    name: "Jörg Kuhmann",
    role: "Vorstandsmitglied",
    address: "Kirchheimer Str. 6, 67273 Weisenheim a.B.",
    phone: "(06353) 8450",
    image: "/images/personen/vorstand/VS_JörgKuhmann.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-vorstand-20",
    page: "vorstand",
    section: "Dienstsitz Neustadt",
    sectionMeta: "DLR Rheinland-Pfalz",
    order: 19,
    name: "Thorsten Langenwalter",
    role: "Vertreter",
    address: "Bahnhofstr. 45, 67256 Weisenheim a.S.",
    phone: "(06353) 7390",
    image: "/images/personen/vorstand/VS_ThorstenLangenwalter.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Geschaeftsstelle ----
  {
    id: "seed-geschaeftsstelle-01",
    page: "geschaeftsstelle",
    section: "Geschäftsführung",
    order: 0,
    name: "Michael Zürker",
    role: "Geschäftsführer",
    phone: "(06321) 4911-11",
    mobile: "(0151) 10837906",
    fax: "(06321) 4911-7011",
    email: "michael.zuerker@vtg-rlp.de",
    image: "/images/personen/GS_Michael_Zuerker.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-02",
    page: "geschaeftsstelle",
    section: "Geschäftsführung",
    order: 1,
    name: "Guido Hübinger",
    role: "stellvertretender Geschäftsführer",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-03",
    page: "geschaeftsstelle",
    section: "Personal, Organisation, Recht, Grundsatzfragen",
    order: 2,
    name: "Michael Zürker",
    role: "Geschäftsbereichsleitung",
    phone: "(06321) 4911-11",
    mobile: "(0151) 10837906",
    fax: "(06321) 4911-7011",
    email: "michael.zuerker@vtg-rlp.de",
    image: "/images/personen/GS_Michael_Zuerker.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-04",
    page: "geschaeftsstelle",
    section: "Personal, Organisation, Recht, Grundsatzfragen",
    order: 3,
    name: "Manja Düben",
    role: "Mitgliederbetreuung / Personalverwaltung",
    phone: "(06321) 4911-10",
    fax: "(06321) 4911-7010",
    email: "manja.dueben@vtg-rlp.de",
    image: "/images/personen/GS_Manja_Dueben.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-05",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 4,
    name: "Umut Caglar",
    role: "Geschäftsbereichsleitung",
    phone: "(06321) 4911-12",
    fax: "(06321) 4911-7012",
    email: "umut.caglar@vtg-rlp.de",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-06",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 5,
    name: "Elena Böttger",
    role: "Sachgebietsleitung VTG (Buchführung und Rechnungswesen)",
    phone: "(06321) 4911-21",
    fax: "(06321) 4911-7021",
    email: "elena.boettger@vtg-rlp.de",
    image: "/images/personen/GS_Elena_Boettger.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-07",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 6,
    name: "Olga Kullmann",
    role: "Sachgebietsleitung TG (Buchführung und Rechnungswesen)",
    phone: "(06321) 4911-23",
    fax: "(06321) 4911-7023",
    email: "olga.kullmann@vtg-rlp.de",
    image: "/images/personen/GS_Olga_Kullmann.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-08",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 7,
    name: "Gülten Güney",
    role: "TG-Buchführung",
    phone: "(06321) 4911-26",
    fax: "(06321) 4911-7026",
    email: "guelten.gueney@vtg-rlp.de",
    image: "/images/personen/GS_Guelten_Gueney.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-09",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 8,
    name: "Daniela Hess",
    role: "VTG-Buchführung",
    phone: "(06321) 4911-22",
    fax: "(06321) 4911-7022",
    email: "daniela.hess@vtg-rlp.de",
    image: "/images/personen/GS_Daniela_Hess.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-10",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 9,
    name: "Ira Kohleber",
    role: "TG-Buchführung",
    phone: "(06321) 4911-35",
    fax: "(06321) 4911-7035",
    email: "ira.kohleber@vtg-rlp.de",
    image: "/images/personen/GS_Ira_Kohleber.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-11",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 10,
    name: "Kristina Neu",
    role: "TG-Buchführung",
    phone: "(06321) 4911-29",
    fax: "(06321) 4911-7029",
    email: "kristina.neu@vtg-rlp.de",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-12",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 11,
    name: "Maximilian Zerr",
    role: "Sachgebietsleitung IT, zentrale Datenverarbeitung",
    phone: "(06321) 4911-31",
    fax: "(06321) 4911-7031",
    email: "maximilian.zerr@vtg-rlp.de",
    image: "/images/personen/GS_Maximilian_Zerr.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-13",
    page: "geschaeftsstelle",
    section: "IT, Buchführung, Zahlungsmanagement",
    order: 12,
    name: "Alexander Jung",
    role: "IT Systemadministration",
    phone: "(06321) 4911-19",
    fax: "(06321) 4911-7019",
    email: "alexander.jung@vtg-rlp.de",
    image: "/images/personen/GS_Alexander_Jung.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-14",
    page: "geschaeftsstelle",
    section: "Bau, Landespflege, Vergabe",
    order: 13,
    name: "Guido Hübinger",
    role: "Geschäftsbereichsleitung",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsstelle-15",
    page: "geschaeftsstelle",
    section: "Bau, Landespflege, Vergabe",
    order: 14,
    name: "Manja Düben",
    role: "Personalverwaltung / Faktura",
    phone: "(06321) 4911-10",
    fax: "(06321) 4911-7010",
    email: "manja.dueben@vtg-rlp.de",
    image: "/images/personen/GS_Manja_Dueben.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Praesident ----
  {
    id: "seed-praesident-01",
    page: "praesident",
    order: 0,
    name: "Michael Haack",
    role: "Präsident",
    address: "Zweibrückerstr. 70, 66894 Martinshöhe",
    phone: "(06372) 61238",
    image: "/images/personen/vorstand/VS_MichaelHaack.JPG",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-praesident-02",
    page: "praesident",
    order: 1,
    name: "Werner Görgen",
    role: "stellvertretender Präsident",
    address: "Weinbergstr. 1a, 54517 Platten",
    phone: "(06535) 807",
    image: "/images/personen/vorstand/VS_WernerGörgen.JPG",
    updatedAt: SEED_DATE,
  },

  // ---- Geschaeftsfuehrer ----
  {
    id: "seed-geschaeftsfuehrer-01",
    page: "geschaeftsfuehrer",
    order: 0,
    name: "Michael Zürker",
    role: "Geschäftsführer",
    address: "Zweibrückerstr. 70, 66894 Martinshöhe",
    phone: "(06321) 4911-11",
    mobile: "(0151) 10837906",
    fax: "(06321) 4911-7011",
    email: "michael.zuerker@vtg-rlp.de",
    image: "/images/personen/GS_Michael_Zuerker.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-geschaeftsfuehrer-02",
    page: "geschaeftsfuehrer",
    order: 1,
    name: "Guido Hübinger",
    role: "stellvertretender Geschäftsführer",
    address: "Zweibrückerstr. 70, 66894 Martinshöhe",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Neustadt ----
  {
    id: "seed-neustadt-01",
    page: "neustadt",
    section: "Bau, Landespflege",
    order: 0,
    name: "Ralf Umbach",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4433",
    mobile: "(0151) 10837941",
    fax: "(06321) 4911-7433",
    email: "ralf.umbach@vtg-rlp.de",
    image: "/images/personen/NE_Ralf_Umbach.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-neustadt-02",
    page: "neustadt",
    section: "Bau, Landespflege",
    order: 1,
    name: "Heinrich Wyrott",
    role: "Bauaufsicht",
    phone: "(06321) 4911-4434",
    mobile: "(0151) 10837905",
    fax: "(06321) 4911-7434",
    email: "heinrich.wyrott@vtg-rlp.de",
    image: "/images/personen/NE_Heinrich_Wyrott.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Bernkastel-Kues ----
  {
    id: "seed-bernkastel-kues-01",
    page: "bernkastel-kues",
    section: "Bau, Landespflege",
    order: 0,
    name: "Guido Hübinger",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4132",
    mobile: "(0151) 10837902",
    fax: "(06321) 4911-7132",
    email: "guido.huebinger@vtg-rlp.de",
    image: "/images/personen/SI_Guido_Huebinger.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-bernkastel-kues-02",
    page: "bernkastel-kues",
    section: "Bau, Landespflege",
    order: 1,
    name: "Michael Krajewski",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4133",
    mobile: "(0151) 10837925",
    fax: "(06321) 4911-7133",
    email: "michael.krajewski@vtg-rlp.de",
    image: "/images/personen/BE_Michael_Krajewski.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-bernkastel-kues-03",
    page: "bernkastel-kues",
    section: "Bau, Landespflege",
    order: 2,
    name: "Thomas Reusch",
    role: "Bauaufsicht",
    mobile: "(0151) 10837917",
    email: "thomas.reusch@vtg-rlp.de",
    image: "/images/personen/BE_Thomas_Reusch.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-bernkastel-kues-04",
    page: "bernkastel-kues",
    section: "Bau, Landespflege",
    order: 3,
    name: "Andreas Scheer",
    role: "Bauaufsicht",
    mobile: "(0151) 10837918",
    email: "andreas.scheer@vtg-rlp.de",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-bernkastel-kues-05",
    page: "bernkastel-kues",
    section: "Bau, Landespflege",
    order: 4,
    name: "Susanne Rieb",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4131",
    fax: "(06321) 4911-7131",
    email: "susanne.rieb@vtg-rlp.de",
    image: "/images/personen/BE_Susanne_Rieb.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Simmern/Bad Kreuznach ----
  {
    id: "seed-simmern-bad-kreuznach-01",
    page: "simmern-bad-kreuznach",
    section: "Bau, Landespflege",
    order: 0,
    name: "Bartholomäus Stoltmann",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4632",
    mobile: "(0151) 10837945",
    fax: "(06321) 4911-7632",
    email: "bartholomaeus.stoltmann@vtg-rlp.de",
    image: "/images/personen/SI_Bartholomaeus_Stoltmann.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-simmern-bad-kreuznach-02",
    page: "simmern-bad-kreuznach",
    section: "Bau, Landespflege",
    order: 1,
    name: "Sylvia Pulcher",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4631",
    fax: "(06321) 4911-7631",
    email: "sylvia.pulcher@vtg-rlp.de",
    image: "/images/personen/SI_Sylvia_Pulcher.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Kaiserslautern ----
  {
    id: "seed-kaiserslautern-01",
    page: "kaiserslautern",
    section: "Bau, Landespflege",
    order: 0,
    name: "Sascha Hartig",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4232",
    mobile: "(0151) 10837924",
    fax: "(06321) 4911-7232",
    email: "sascha.hartig@vtg-rlp.de",
    image: "/images/personen/KA_Sascha_Hartig.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-kaiserslautern-02",
    page: "kaiserslautern",
    section: "Bau, Landespflege",
    order: 1,
    name: "Ralf Umbach",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4433",
    mobile: "(0151) 10837941",
    fax: "(06321) 4911-7433",
    email: "ralf.umbach@vtg-rlp.de",
    image: "/images/personen/NE_Ralf_Umbach.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-kaiserslautern-03",
    page: "kaiserslautern",
    section: "Bau, Landespflege",
    order: 2,
    name: "Arnold Ernst",
    role: "Bauaufsicht",
    mobile: "(0151) 10837907",
    email: "arnold.ernst@vtg-rlp.de",
    image: "/images/personen/KA_Arnold_Ernst.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-kaiserslautern-04",
    page: "kaiserslautern",
    section: "Bau, Landespflege",
    order: 3,
    name: "Gabriele Kratz",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4235",
    fax: "(06321) 4911-7231",
    email: "gabriele.kratz@vtg-rlp.de",
    image: "/images/personen/KA_Gabriele_Kratz.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Pruem/Bitburg/Trier ----
  {
    id: "seed-pruem-bitburg-trier-01",
    page: "pruem-bitburg-trier",
    section: "Bau, Landespflege",
    order: 0,
    name: "Dirk Thiex",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4532",
    mobile: "(0151) 10837943",
    fax: "(06321) 4911-7532",
    email: "dirk.thiex@vtg-rlp.de",
    image: "/images/personen/PR_Dirk_Thiex.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-pruem-bitburg-trier-02",
    page: "pruem-bitburg-trier",
    section: "Bau, Landespflege",
    order: 1,
    name: "Sascha Weiler",
    role: "Bauaufsicht",
    mobile: "(0151) 10837920",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-pruem-bitburg-trier-03",
    page: "pruem-bitburg-trier",
    section: "Bau, Landespflege",
    order: 2,
    name: "Jutta Hoffmann",
    role: "Information, Verwaltung, Mahnwesen",
    phone: "(06321) 4911-4531",
    fax: "(06321) 4911-7531",
    email: "jutta.hoffmann@vtg-rlp.de",
    image: "/images/personen/PR_Jutta_Hoffmann.jpg",
    updatedAt: SEED_DATE,
  },

  // ---- Mayen/Montabaur ----
  {
    id: "seed-mayen-montabaur-01",
    page: "mayen-montabaur",
    section: "Bau, Landespflege",
    order: 0,
    name: "Josef Oster-Daum",
    role: "Außenstellenleitung / Bauoberleitung",
    phone: "(06321) 4911-4332",
    mobile: "(0151) 10837904",
    fax: "(06321) 4911-7332",
    email: "josef.oster-daum@vtg-rlp.de",
    image: "/images/personen/MA_Josef_Oster-Daum.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-mayen-montabaur-02",
    page: "mayen-montabaur",
    section: "Bau, Landespflege",
    order: 1,
    name: "Christian Geisbüsch",
    role: "Bauoberleitung",
    phone: "(06321) 4911-4333",
    mobile: "(0151) 10837939",
    fax: "(06321) 4911-7333",
    email: "christian.geisbuesch@vtg-rlp.de",
    image: "/images/personen/MA_Christian_Geisbuesch.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-mayen-montabaur-03",
    page: "mayen-montabaur",
    section: "Bau, Landespflege",
    order: 2,
    name: "Thomas Pätz",
    role: "Bauaufsicht",
    mobile: "(0151) 10837933",
    image: "/images/personen/MO_Thomas_Paetz.jpg",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-mayen-montabaur-04",
    page: "mayen-montabaur",
    section: "Bau, Landespflege",
    order: 3,
    name: "Ralf Bohr",
    role: "Information, Verwaltung",
    phone: "(06321) 4911-4331",
    fax: "(06321) 4911-7331",
    email: "ralf.bohr@vtg-rlp.de",
    image: "/images/personen/MA_Ralf_Bohr.jpg",
    updatedAt: SEED_DATE,
  },
];

// Keine Modul-weite Zwischenspeicherung, siehe downloads.ts/public-downloads.ts:
// diese Metadaten werden von der Anwendung selbst laufend veraendert.
async function loadPersonen(): Promise<PersonEntry[]> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) {
    await savePersonen(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as PersonEntry[];
}

async function savePersonen(entries: PersonEntry[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getAllPersonen(): Promise<PersonEntry[]> {
  return loadPersonen();
}

export async function getPersonenByPage(page: PersonPageSlug): Promise<PersonEntry[]> {
  const entries = await loadPersonen();
  return entries.filter((e) => e.page === page).sort((a, b) => a.order - b.order);
}

export async function getPersonById(id: string): Promise<PersonEntry | undefined> {
  const entries = await loadPersonen();
  return entries.find((e) => e.id === id);
}

export async function addPerson(entry: PersonEntry): Promise<void> {
  const entries = await loadPersonen();
  entries.push(entry);
  await savePersonen(entries);
}

export type PersonChanges = {
  page: PersonPageSlug;
  section?: string;
  sectionMeta?: string;
  order: number;
  name: string;
  role: string;
  address?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  image?: string;
  blobPathname?: string;
  replaceImage: boolean;
};

export async function updatePerson(id: string, changes: PersonChanges): Promise<void> {
  const entries = await loadPersonen();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;

  if (changes.replaceImage && entry.blobPathname) {
    await del(entry.blobPathname, { token: BLOB_TOKEN }).catch(() => {});
  }

  entry.page = changes.page;
  entry.section = changes.section;
  entry.sectionMeta = changes.sectionMeta;
  entry.order = changes.order;
  entry.name = changes.name;
  entry.role = changes.role;
  entry.address = changes.address;
  entry.phone = changes.phone;
  entry.mobile = changes.mobile;
  entry.fax = changes.fax;
  entry.email = changes.email;
  if (changes.replaceImage) {
    entry.image = changes.image;
    entry.blobPathname = changes.blobPathname;
  }
  entry.updatedAt = new Date().toISOString();

  await savePersonen(entries);
}

export async function removePerson(id: string): Promise<void> {
  const entries = await loadPersonen();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  if (entry.blobPathname) {
    await del(entry.blobPathname, { token: BLOB_TOKEN }).catch(() => {});
  }
  await savePersonen(entries.filter((e) => e.id !== id));
}

// Gruppiert eine bereits nach `order` sortierte Liste nach `section`, in der
// Reihenfolge des ersten Vorkommens. Eintraege ohne section landen in einer
// Gruppe mit section === undefined.
export function groupPersonenBySection(
  entries: PersonEntry[],
): { section?: string; sectionMeta?: string; people: PersonEntry[] }[] {
  const groups: { section?: string; sectionMeta?: string; people: PersonEntry[] }[] = [];
  for (const entry of entries) {
    let group = groups.find((g) => g.section === entry.section);
    if (!group) {
      group = { section: entry.section, sectionMeta: entry.sectionMeta, people: [] };
      groups.push(group);
    }
    group.people.push(entry);
  }
  return groups;
}
