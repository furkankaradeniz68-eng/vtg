// Manuelle Verknuepfung zwischen Verfahren, die sich gegenseitig ihre
// Finanzuebersicht anzeigen duerfen sollen (z.B. ein Verfahren und seine
// EU-kofinanzierten Teilprojekte). Das ist keine BC-Feldspezifikation,
// sondern eine externe Zuordnungstabelle, die separat nachgereicht wird
// (siehe WordPress-Referenz: "Weitere verknuepfte Verfahren" unterhalb der
// Finanzuebersicht-Kacheln).
//
// Format: nr -> Liste der Nrn, deren Finanzuebersicht zusaetzlich sichtbar
// sein soll. Die Verknuepfung wird automatisch symmetrisch behandelt
// (getVerknuepfteNrs liefert auch die Rueckrichtung), auch wenn hier nur
// eine Richtung eingetragen wird.
//
// Testdaten aus der WordPress-Referenz (Kroev-Gruppe), bis die vollstaendige
// externe Tabelle nachgereicht wird.
export const VERFAHREN_VERKNUEPFUNGEN: Record<string, string[]> = {
  "11026": ["17026", "18026", "19026"],
};

export function getVerknuepfteNrs(nr: string): string[] {
  const ziele = new Set(VERFAHREN_VERKNUEPFUNGEN[nr] ?? []);
  for (const [andereNr, andereZiele] of Object.entries(VERFAHREN_VERKNUEPFUNGEN)) {
    if (andereZiele.includes(nr)) ziele.add(andereNr);
  }
  return [...ziele];
}
