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
// Quelle: VTG_Verb.xlsx (Haupt-TG -> Unter-TG), nachgereicht am 2026-09-23.
export const VERFAHREN_VERKNUEPFUNGEN: Record<string, string[]> = {
  "11003": ["19003"],
  "11026": ["17026", "18026", "19026"],
  "11125": ["19125"],
  "21122": ["29122"],
  "31033": ["39033"],
  "41230": ["49230"],
  "41250": ["49250"],
  "41274": ["49274"],
  "41286": ["49286"],
  "41436": ["49436"],
  "51079": ["59079"],
  "51143": ["59143"],
  "51151": ["59151"],
  "51167": ["59167"],
  "61117": ["69117"],
  "71028": ["78028", "79028"],
  "71124": ["79124"],
  "81189": ["89189"],
  "81193": ["89193"],
  "91316": ["99316"],
  "91809": ["99809"],
  "93002": ["99002"],
};

export function getVerknuepfteNrs(nr: string): string[] {
  const ziele = new Set(VERFAHREN_VERKNUEPFUNGEN[nr] ?? []);
  for (const [andereNr, andereZiele] of Object.entries(VERFAHREN_VERKNUEPFUNGEN)) {
    if (andereZiele.includes(nr)) ziele.add(andereNr);
  }
  return [...ziele];
}
