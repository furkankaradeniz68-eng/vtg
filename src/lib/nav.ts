export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  // Auf der reduzierten Portal-Domain (z. B. VTG NRW) ausblenden — z. B.
  // TG-Einzeldaten, die dort laut Absprache nicht angeboten werden sollen,
  // auf der RLP-Hauptdomain aber weiterhin fuer DLRs sichtbar bleiben.
  hideOnPortal?: boolean;
};

// Links to static files (PDF/ZIP/...) must use a plain <a>, not next/link's
// client-side router — the router expects an RSC payload back and throws
// when a binary file is returned instead, crashing the whole page. Manche
// Dateien liegen inzwischen nicht mehr statisch unter /public, sondern werden
// ueber eine API-Route aus dem Blob-Speicher gestreamt (z.B. das admin-
// ersetzbare Kontenplan-PDF) — solche Routen tragen keine Dateiendung in der
// URL und muessen deshalb explizit gelistet werden.
const FILE_API_ROUTES = ["/api/kontenplan"];

export function isFileHref(href: string): boolean {
  return /\.[a-z0-9]{2,4}$/i.test(href) || FILE_API_ROUTES.includes(href);
}

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

export type MemberRole = "abonnent" | "intern";

export const header2Nav: Record<MemberRole, NavItem[]> = {
  abonnent: [
    { label: "Verfahrensdaten", href: "/mitgliederbereich/verfahrensdaten" },
    { label: "Energiekostenzuschlag", href: "/mitgliederbereich/energiekostenzuschlag" },
    { label: "Zins", href: "/mitgliederbereich/zins" },
    { label: "Umlage", href: "/mitgliederbereich/umlage" },
    { label: "Beitragssätze (PDF)", href: "/downloads/Flyer_Beitragssätze_Aktuell.pdf" },
    { label: "Kontenplan (PDF)", href: "/api/kontenplan" },
  ],
  intern: [
    { label: "Verfahrensauswahl", href: "/mitgliederbereich/verfahrensauswahl" },
    { label: "Verfahrensdaten", href: "/mitgliederbereich/verfahrensdaten" },
    { label: "Energiekostenzuschlag", href: "/mitgliederbereich/energiekostenzuschlag" },
    { label: "Zins", href: "/mitgliederbereich/zins" },
    { label: "Umlage", href: "/mitgliederbereich/umlage" },
    { label: "Beitragssätze (PDF)", href: "/downloads/Flyer_Beitragssätze_Aktuell.pdf" },
    { label: "TG-Einzeldaten (ZIP)", href: "/downloads/TGEinzeldaten.zip", hideOnPortal: true },
    { label: "Kontenplan (PDF)", href: "/api/kontenplan" },
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
