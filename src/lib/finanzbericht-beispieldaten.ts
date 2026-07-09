// Beispieldaten für die Entwicklung — kein produktiver Datenbestand.
// Bildet nur die Struktur der Finanzberichts-Tabellen ab (Kontengruppen,
// Positionen, Summen) mit plausiblen Platzhalterzahlen. Die echten Werte
// kommen später live über die BC-API (wp_finanz_positionen: Laufzeit =
// kumulierter Stand über die gesamte Verfahrensdauer, Haushaltsjahr =
// nur der Anteil des laufenden Haushaltsjahres — echte, unterschiedliche
// Datensätze pro Ansicht, keine umbenannten Duplikate).

export type FinanzZeile = {
  konto: string;
  ausgaben: number;
  plan: number;
  typ?: "gruppe" | "gesamt";
};

export type FinanzKategorie = {
  slug: string;
  titel: string;
  suffix?: string;
  zeilen: FinanzZeile[];
};

export type FinanzAnsicht = "laufzeit" | "haushaltsjahr";

const finanzKategorienProAnsicht: Record<string, Record<FinanzAnsicht, FinanzKategorie>> = {
  einnahmen: {
    laufzeit: {
      slug: "einnahmen",
      titel: "Einnahmen",
      zeilen: [
        { konto: "Summe 311:", ausgaben: 0, plan: 0, typ: "gruppe" },
        { konto: "311101 Zuschüsse", ausgaben: 0, plan: 0 },
        { konto: "Gesamtsumme", ausgaben: 0, plan: 0, typ: "gesamt" },
      ],
    },
    haushaltsjahr: {
      slug: "einnahmen",
      titel: "Einnahmen",
      zeilen: [
        { konto: "Summe 311:", ausgaben: 0, plan: 0, typ: "gruppe" },
        { konto: "311101 Zuschüsse", ausgaben: 0, plan: 0 },
        { konto: "Gesamtsumme", ausgaben: 0, plan: 0, typ: "gesamt" },
      ],
    },
  },
  "ausfuehrungskosten-a1": {
    laufzeit: {
      slug: "ausfuehrungskosten-a1",
      titel: "Ausführungskosten",
      suffix: "A1",
      zeilen: [
        { konto: "Summe 411:", ausgaben: 8000, plan: 8500, typ: "gruppe" },
        { konto: "411101 Vermessung u. Vermarkung / AG", ausgaben: 5000, plan: 5300 },
        { konto: "411106 Vermessung u. Vermarkung / WS", ausgaben: 3000, plan: 3200 },
        { konto: "Summe 412:", ausgaben: 2500, plan: 2600, typ: "gruppe" },
        { konto: "Summe 413:", ausgaben: 1800, plan: 1900, typ: "gruppe" },
        { konto: "Summe 414:", ausgaben: 1200, plan: 1250, typ: "gruppe" },
        { konto: "Summe 415:", ausgaben: 1400, plan: 1450, typ: "gruppe" },
        { konto: "Summe 416:", ausgaben: 1309.36, plan: 1350, typ: "gruppe" },
        { konto: "Gesamtsumme", ausgaben: 16209.36, plan: 17050, typ: "gesamt" },
      ],
    },
    haushaltsjahr: {
      slug: "ausfuehrungskosten-a1",
      titel: "Ausführungskosten",
      suffix: "A1",
      zeilen: [
        { konto: "Summe 411:", ausgaben: 950, plan: 1020, typ: "gruppe" },
        { konto: "411101 Vermessung u. Vermarkung / AG", ausgaben: 600, plan: 640 },
        { konto: "411106 Vermessung u. Vermarkung / WS", ausgaben: 350, plan: 380 },
        { konto: "Summe 412:", ausgaben: 300, plan: 320, typ: "gruppe" },
        { konto: "Summe 413:", ausgaben: 220, plan: 230, typ: "gruppe" },
        { konto: "Summe 414:", ausgaben: 140, plan: 150, typ: "gruppe" },
        { konto: "Summe 415:", ausgaben: 170, plan: 175, typ: "gruppe" },
        { konto: "Summe 416:", ausgaben: 155, plan: 160, typ: "gruppe" },
        { konto: "Gesamtsumme", ausgaben: 1935, plan: 2055, typ: "gesamt" },
      ],
    },
  },
  "sonstige-ausfuehrungskosten-a2": {
    laufzeit: {
      slug: "sonstige-ausfuehrungskosten-a2",
      titel: "Sonstige Ausführungskosten",
      suffix: "A2",
      zeilen: [
        { konto: "Summe 421:", ausgaben: 2053.91, plan: 2100, typ: "gruppe" },
        { konto: "421101 Sonstige Ausführungskosten", ausgaben: 2053.91, plan: 2100 },
        { konto: "Gesamtsumme", ausgaben: 2053.91, plan: 2100, typ: "gesamt" },
      ],
    },
    haushaltsjahr: {
      slug: "sonstige-ausfuehrungskosten-a2",
      titel: "Sonstige Ausführungskosten",
      suffix: "A2",
      zeilen: [
        { konto: "Summe 421:", ausgaben: 310, plan: 320, typ: "gruppe" },
        { konto: "421101 Sonstige Ausführungskosten", ausgaben: 310, plan: 320 },
        { konto: "Gesamtsumme", ausgaben: 310, plan: 320, typ: "gesamt" },
      ],
    },
  },
};

export type FinanzKategorieSlug =
  | "einnahmen"
  | "ausfuehrungskosten-a1"
  | "sonstige-ausfuehrungskosten-a2";

export function findeFinanzKategorie(
  slug: FinanzKategorieSlug,
  ansicht: FinanzAnsicht,
): FinanzKategorie {
  return finanzKategorienProAnsicht[slug][ansicht];
}

// Fuer die Finanzuebersicht-Kachelsummen wird, wie im Original, die
// kumulierte Laufzeit-Ansicht herangezogen.
export const finanzKategorien: Record<FinanzKategorieSlug, FinanzKategorie> = Object.fromEntries(
  (Object.keys(finanzKategorienProAnsicht) as FinanzKategorieSlug[]).map((slug) => [
    slug,
    finanzKategorienProAnsicht[slug].laufzeit,
  ]),
) as Record<FinanzKategorieSlug, FinanzKategorie>;

// Kennzahlen fuer die Finanzuebersicht-Kopfzeile (Kontostand etc.) —
// ebenfalls Platzhalter, bis die BC-API angebunden ist.
export const finanzUebersichtKennzahlenBeispiel = {
  kontostand: -20316.85,
  forderungenVerbindlichkeiten: 0,
  forderungenVerbindlichkeitenBD: -20316.85,
  vermoegenDerTG: -20316.85,
};
