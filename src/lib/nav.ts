export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  {
    label: "Über uns",
    href: "/ueber-uns",
    children: [
      { label: "Überblick", href: "/ueberblick" },
      {
        label: "Organe",
        href: "/organe",
        children: [
          { label: "Präsident", href: "/praesident" },
          { label: "Vorstand", href: "/vorstand" },
          { label: "Geschäftsführer", href: "/geschaeftsfuehrer" },
        ],
      },
      { label: "Satzung", href: "/satzung" },
      {
        label: "Aufgaben",
        href: "/aufgaben",
        children: [
          { label: "Bauabwicklung", href: "/bauabwicklung" },
          { label: "Kassen- und Buchführung", href: "/kassen-und-buchfuehrung" },
          { label: "Sonstige Aufgaben", href: "/sonstige-aufgaben" },
        ],
      },
      { label: "Finanzierung", href: "/finanzierung" },
    ],
  },
  { label: "Mitglieder", href: "/mitglieder" },
  {
    label: "Kontakt",
    href: "/kontakt",
    children: [
      { label: "Geschäftsstelle", href: "/geschaeftsstelle" },
      { label: "Bernkastel-Kues", href: "/bernkastel-kues" },
      { label: "Kaiserslautern", href: "/kaiserslautern" },
      { label: "Mayen/Montabaur", href: "/mayen-montabaur" },
      { label: "Neustadt", href: "/neustadt" },
      { label: "Prüm/Bitburg/Trier", href: "/pruem-bitburg-trier" },
      { label: "Simmern/Bad Kreuznach", href: "/simmern-bad-kreuznach" },
    ],
  },
  { label: "News", href: "/news" },
  {
    label: "Downloads",
    href: "/downloads",
    children: [
      { label: "Satzung und Vordrucke", href: "/download-satzung-vordrucke" },
      { label: "Fachtagungen", href: "/fachtagungen" },
      { label: "Sonstiges", href: "/sonstiges" },
      { label: "TeamViewerQS", href: "/downloads/TeamViewerQS_VTGRLP.zip" },
    ],
  },
  {
    label: "Ausschreibung",
    href: "/ausschreibung",
    children: [
      { label: "VOB/VOL", href: "/vob-vol" },
      { label: "Stellenausschreibung", href: "/stellenausschreibung" },
    ],
  },
  { label: "Login", href: "/login" },
];

export type MemberRole = "abonnent" | "intern";

export const header2Nav: Record<MemberRole, NavItem[]> = {
  abonnent: [
    { label: "Verfahrensdaten", href: "/mitgliederbereich/verfahrensdaten" },
    { label: "Energiekostenzuschlag", href: "/mitgliederbereich/energiekostenzuschlag" },
    { label: "Zins", href: "/mitgliederbereich/zins" },
    { label: "Umlage", href: "/mitgliederbereich/umlage" },
    { label: "Beitragssätze (PDF)", href: "/downloads/Flyer_Beitragssätze_Aktuell.pdf" },
    { label: "Kontenplan (PDF)", href: "/downloads/Kontenplan_TG.pdf" },
  ],
  intern: [
    { label: "Verfahrensdaten", href: "/mitgliederbereich/verfahrensdaten" },
    { label: "Verfahrensauswahl", href: "/mitgliederbereich/verfahrensauswahl" },
    { label: "Energiekostenzuschlag", href: "/mitgliederbereich/energiekostenzuschlag" },
    { label: "Zins", href: "/mitgliederbereich/zins" },
    { label: "Umlage", href: "/mitgliederbereich/umlage" },
    { label: "Beitragssätze (PDF)", href: "/downloads/Flyer_Beitragssätze_Aktuell.pdf" },
    { label: "TG-Einzeldaten (ZIP)", href: "/downloads/TGEinzeldaten.zip" },
    { label: "Kontenplan (PDF)", href: "/downloads/Kontenplan_TG.pdf" },
  ],
};

export const header2SecondRow: Partial<Record<MemberRole, NavItem[]>> = {
  intern: [
    { label: "Bewilligungs- und Abrufübersicht", href: "/mitgliederbereich/bewilligungs-und-abrufuebersicht" },
  ],
};

export const footerNav = {
  legal: [
    { label: "Datenschutzerklärung", href: "/datenschutzerklaerung" },
    { label: "Impressum", href: "/impressum" },
    { label: "Links", href: "/links" },
  ],
  uebersicht: [
    { label: "Überblick", href: "/ueberblick" },
    { label: "Bauabwicklung", href: "/bauabwicklung" },
    { label: "Sonstige Aufgaben", href: "/sonstige-aufgaben" },
    { label: "Kassen- & Buchführung", href: "/kassen-und-buchfuehrung" },
  ],
  service: [
    { label: "Startseite", href: "/" },
    { label: "Geschäftsstelle", href: "/geschaeftsstelle" },
  ],
};
