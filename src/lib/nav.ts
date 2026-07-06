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

export const footerNav = {
  legal: [
    { label: "Datenschutzerklärung", href: "/datenschutzerklaerung" },
    { label: "Impressum", href: "/impressum" },
    { label: "Links", href: "/links" },
  ],
  uebersicht: [
    { label: "Überblick", href: "/ueberblick" },
    { label: "Bauabwicklung", href: "/bauabwicklung" },
    { label: "Kassen- und Buchführung", href: "/kassen-und-buchfuehrung" },
    { label: "Sonstige Aufgaben", href: "/sonstige-aufgaben" },
  ],
  service: [
    { label: "Startseite", href: "/" },
    { label: "Geschäftsstelle", href: "/geschaeftsstelle" },
    { label: "Mitglieder", href: "/mitglieder" },
    { label: "Kontakt", href: "/kontakt" },
  ],
};
