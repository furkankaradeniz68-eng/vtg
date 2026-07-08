// Beispieldaten für die Entwicklung — kein produktiver Datenbestand.
// Bildet nur die Struktur der Finanzberichts-Tabellen ab (Kontengruppen,
// Positionen, Summen). Die echten Werte kommen später live über die
// BC-API; bis dahin stehen hier überall Platzhalter-Nullen.

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
      { konto: "Summe 411:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "411101 Vermessung u. Vermarkung / AG", ausgaben: 0, plan: 0 },
      { konto: "411106 Vermessung u. Vermarkung / WS", ausgaben: 0, plan: 0 },
      { konto: "Summe 412:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "Summe 413:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "Summe 414:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "Summe 415:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "Summe 416:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "Gesamtsumme", ausgaben: 0, plan: 0, typ: "gesamt" },
    ],
  },
  "sonstige-ausfuehrungskosten-a2": {
    slug: "sonstige-ausfuehrungskosten-a2",
    titel: "Sonstige Ausführungskosten",
    suffix: "A2",
    zeilen: [
      { konto: "Summe 421:", ausgaben: 0, plan: 0, typ: "gruppe" },
      { konto: "421101 Sonstige Ausführungskosten", ausgaben: 0, plan: 0 },
      { konto: "Gesamtsumme", ausgaben: 0, plan: 0, typ: "gesamt" },
    ],
  },
};

export type FinanzKategorieSlug =
  | "einnahmen"
  | "ausfuehrungskosten-a1"
  | "sonstige-ausfuehrungskosten-a2";
