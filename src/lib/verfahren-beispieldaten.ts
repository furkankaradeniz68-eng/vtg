// Beispieldaten für die Entwicklung — kein produktiver Datenbestand.
// Dient dazu, die Verfahrensauswahl/-daten-Seiten mit Inhalt zu testen,
// bis die echte Anbindung an den Verfahrensdatenbestand steht.
// Namen, Adressen und Koordinaten sind frei erfunden.

export type Verfahren = {
  nr: string;
  name: string;
  aktenzeichen: string;
  landkreis: string;
  vorsitzender: {
    name: string;
    strasse: string;
    plzOrt: string;
  };
  koordinaten: { lat: number; lng: number };
  hj: number;
  stand: string;
};

export const verfahrenByKreis: Record<string, Verfahren[]> = {
  "Bernkastel-Kues": [
    {
      nr: "V-1001",
      name: "Musterverfahren Bernkastel Nord",
      aktenzeichen: "AZ-V-1001",
      landkreis: "Bernkastel-Wittlich",
      vorsitzender: {
        name: "Herr Max Mustermann",
        strasse: "Musterstraße 1",
        plzOrt: "54470 Bernkastel-Kues",
      },
      koordinaten: { lat: 49.9167, lng: 7.0667 },
      hj: 2024,
      stand: "31.12.2024",
    },
    {
      nr: "V-1002",
      name: "Musterverfahren Kueser Plateau",
      aktenzeichen: "AZ-V-1002",
      landkreis: "Bernkastel-Wittlich",
      vorsitzender: {
        name: "Frau Erika Musterfrau",
        strasse: "Beispielweg 4",
        plzOrt: "54470 Bernkastel-Kues",
      },
      koordinaten: { lat: 49.92, lng: 7.07 },
      hj: 2024,
      stand: "31.12.2024",
    },
    {
      nr: "V-1003",
      name: "Musterverfahren Moselhang",
      aktenzeichen: "AZ-V-1003",
      landkreis: "Bernkastel-Wittlich",
      vorsitzender: {
        name: "Herr Peter Beispiel",
        strasse: "Testallee 9",
        plzOrt: "54470 Bernkastel-Kues",
      },
      koordinaten: { lat: 49.91, lng: 7.06 },
      hj: 2024,
      stand: "31.12.2024",
    },
  ],
};

export function findVerfahren(nr: string): Verfahren | undefined {
  for (const list of Object.values(verfahrenByKreis)) {
    const match = list.find((v) => v.nr === nr);
    if (match) return match;
  }
  return undefined;
}
