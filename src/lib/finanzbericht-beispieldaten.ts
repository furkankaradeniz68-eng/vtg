// Beispieldaten für die Entwicklung — kein produktiver Datenbestand.
// Bildet nur die Struktur der Finanzberichts-Tabellen ab (Kontengruppen,
// Positionen, Summen) mit plausiblen Platzhalterzahlen. Die echten Werte
// kommen später live über die BC-API.

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

export const finanzKategorien: Record<string, FinanzKategorie> = {
  einnahmen: {
    slug: "einnahmen",
    titel: "Einnahmen",
    zeilen: [
      { konto: "Summe 311:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "311101 Zuschüsse", ausgaben: 0, plan: 0 },
      { konto: "Gesamtsumme", ausgaben: 0, plan: 0, typ: "gesamt" },
    ],
  },
  "ausfuehrungskosten-a1": {
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
  "sonstige-ausfuehrungskosten-a2": {
    slug: "sonstige-ausfuehrungskosten-a2",
    titel: "Sonstige Ausführungskosten",
    suffix: "A2",
    zeilen: [
      { konto: "Summe 421:", ausgaben: 2053.91, plan: 2100, typ: "gruppe" },
      { konto: "421101 Sonstige Ausführungskosten", ausgaben: 2053.91, plan: 2100 },
      { konto: "Gesamtsumme", ausgaben: 2053.91, plan: 2100, typ: "gesamt" },
    ],
  },
};

export type FinanzKategorieSlug =
  | "einnahmen"
  | "ausfuehrungskosten-a1"
  | "sonstige-ausfuehrungskosten-a2";

// Kennzahlen fuer die Finanzuebersicht-Kopfzeile (Kontostand etc.) —
// ebenfalls Platzhalter, bis die BC-API angebunden ist.
export const finanzUebersichtKennzahlenBeispiel = {
  kontostand: -20316.85,
  forderungenVerbindlichkeiten: 0,
  forderungenVerbindlichkeitenBD: -20316.85,
  vermoegenDerTG: -20316.85,
};
