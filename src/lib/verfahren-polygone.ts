// Baustellen-Umringe je Verfahren fuer die Standort-Karte in Verfahrensdaten.
// Quelle: TZ_*.kml-Export der Landesvermessung (siehe
// scripts/convert-kml-verfahren-polygone.py), statisch als JSON gebuendelt,
// da sich Verfahrensgrenzen praktisch nie aendern und kein taeglicher
// BC/Blob-Abruf noetig ist. Ein Verfahren kann mehrere Baustellen
// (= mehrere Polygone) haben, daher MultiPolygon statt Polygon.
//
// Zwei Datensaetze:
// - verfahren-polygone.json: volle Praezision, fuer das EINE hervorgehobene
//   Verfahren der aktuellen Seite.
// - verfahren-polygone-uebersicht.json: geometrisch vereinfacht (siehe
//   Konvertierungsskript), fuer die Gesamtkarte mit allen ~290 Verfahren
//   gleichzeitig - volle Praezision waere dort >10x so gross.
import polygonData from "@/data/verfahren-polygone.json";
import uebersichtData from "@/data/verfahren-polygone-uebersicht.json";

export type VerfahrenPolygon = {
  verfahrensname: string;
  dlrName: string;
  type: "MultiPolygon";
  // [polygon][ring][punkt][lon, lat] - ring[0] = Aussenkontur, weitere Ringe = Loecher
  coordinates: number[][][][];
};

const polygone = polygonData as Record<string, VerfahrenPolygon>;
const uebersichtPolygone = uebersichtData as Record<string, VerfahrenPolygon>;

export function getVerfahrenPolygon(nr: string): VerfahrenPolygon | undefined {
  return polygone[nr];
}

export function getAlleVerfahrenPolygoneUebersicht(): Record<string, VerfahrenPolygon> {
  return uebersichtPolygone;
}

// Feste Farbe je DLR fuer die Gesamtkarte - das eigene/aktuelle Verfahren
// wird stattdessen in vtg-orange hervorgehoben, daher bewusst keine
// gelb/orangenen Toene hier, um Verwechslung zu vermeiden.
const DLR_FARBEN: Record<string, string> = {
  "DLR Mosel": "#2563eb",
  "DLR Rheinpfalz": "#16a34a",
  "DLR Westerwald - Osteifel": "#9333ea",
  "DLR Rheinhessen - Nahe - Hunsrück": "#dc2626",
  "DLR Westpfalz": "#0891b2",
  "DLR Eifel": "#92400e",
};
const DLR_FARBE_FALLBACK = "#6b7280";

export function dlrFarbe(dlrName: string): string {
  return DLR_FARBEN[dlrName] ?? DLR_FARBE_FALLBACK;
}
