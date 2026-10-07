// Baustellen-Umringe je Verfahren fuer die Standort-Karte in Verfahrensdaten.
// Quelle: TZ_*.kml-Export der Landesvermessung (siehe
// scripts/convert-kml-verfahren-polygone.py), statisch als JSON gebuendelt,
// da sich Verfahrensgrenzen praktisch nie aendern und kein taeglicher
// BC/Blob-Abruf noetig ist. Ein Verfahren kann mehrere Baustellen
// (= mehrere Polygone) haben, daher MultiPolygon statt Polygon.
import polygonData from "@/data/verfahren-polygone.json";

export type VerfahrenPolygon = {
  verfahrensname: string;
  type: "MultiPolygon";
  // [polygon][ring][punkt][lon, lat] - ring[0] = Aussenkontur, weitere Ringe = Loecher
  coordinates: number[][][][];
};

const polygone = polygonData as Record<string, VerfahrenPolygon>;

export function getVerfahrenPolygon(nr: string): VerfahrenPolygon | undefined {
  return polygone[nr];
}
