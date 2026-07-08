// Beispieldaten für die Entwicklung — kein produktiver Datenbestand.
// Dient dazu, die Verfahrensauswahl/-daten-Seiten mit Inhalt zu testen,
// bis die echte Anbindung an den Verfahrensdatenbestand steht.

export type Verfahren = {
  nr: string;
  name: string;
  flaeche: string;
  stand: string;
};

export const verfahrenByKreis: Record<string, Verfahren[]> = {
  "Bernkastel-Kues": [
    { nr: "V-1001", name: "Musterverfahren Bernkastel Nord", flaeche: "84 ha", stand: "in Bearbeitung" },
    { nr: "V-1002", name: "Musterverfahren Kueser Plateau", flaeche: "112 ha", stand: "in Bearbeitung" },
    { nr: "V-1003", name: "Musterverfahren Moselhang", flaeche: "63 ha", stand: "abgeschlossen" },
  ],
};

export function findVerfahren(nr: string): Verfahren | undefined {
  for (const list of Object.values(verfahrenByKreis)) {
    const match = list.find((v) => v.nr === nr);
    if (match) return match;
  }
  return undefined;
}
