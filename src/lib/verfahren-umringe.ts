// Quelle der Umringe fuer die Karte unter "Verfahrensdaten": BC zuerst, der bisherige
// KML-Stand als Ersatz. Je Verfahren gilt der BC-Umring, sonst der KML-Umring; so
// verliert kein Verfahren seine Karte, und abgeschlossene Verfahren bleiben im
// Hintergrund, bis der Kunde sagt, dass sie entfallen sollen.
//
// - oeffentlich: BC-Produktionsdaten, aber erst wenn BC_UMRINGE_QUELLE=produktion gesetzt
//   ist (Freigabe nach dem Go von BC); vorher nur der KML-Stand.
// - test: Admin-Testansicht (?quelle=bc) mit den Sandbox-Daten.
import { getVerfahrenPolygon, getAlleVerfahrenPolygoneUebersicht, type VerfahrenPolygon } from "@/lib/verfahren-polygone";
import { ladeBcUmringe, umringeAusBcAktiv, type BcUmringeDaten } from "@/lib/bc-umringe";

export type UmringeAnsicht = {
  polygon: (nr: string) => VerfahrenPolygon | undefined;
  // Woher der Umring dieses Verfahrens kommt (fuer den Hinweis in der Testansicht).
  herkunft: (nr: string) => "bc" | "kml" | undefined;
  uebersicht: Record<string, VerfahrenPolygon>;
  bc: BcUmringeDaten | null;
};

// Kurz zwischenspeichern: die Daten aendern sich hoechstens nachts, der Blob ist mehrere MB gross.
const CACHE_MS = 10 * 60 * 1000;
const cache: Partial<Record<"test" | "produktion", { at: number; daten: BcUmringeDaten | null }>> = {};

async function bcDaten(ziel: "test" | "produktion"): Promise<BcUmringeDaten | null> {
  const hit = cache[ziel];
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.daten;
  const daten = await ladeBcUmringe(ziel).catch(() => null);
  cache[ziel] = { at: Date.now(), daten };
  return daten;
}

// Nach einem Abgleich: gespeicherte Staende dieser Instanz verwerfen.
export function leereUmringeCache(): void {
  delete cache.test;
  delete cache.produktion;
}

function mitName(bc: VerfahrenPolygon, kml: VerfahrenPolygon | undefined): VerfahrenPolygon {
  // BC liefert den Namen aus den Mandantendaten; fehlt er, bleibt der KML-Name.
  return bc.verfahrensname || !kml ? bc : { ...bc, verfahrensname: kml.verfahrensname };
}

export async function getUmringe(modus: "oeffentlich" | "test"): Promise<UmringeAnsicht> {
  const ziel = modus === "test" ? "test" : "produktion";
  const bc = modus === "test" || umringeAusBcAktiv() ? await bcDaten(ziel) : null;
  const kmlUebersicht = getAlleVerfahrenPolygoneUebersicht();

  if (!bc) {
    return {
      polygon: (nr) => getVerfahrenPolygon(nr),
      herkunft: (nr) => (getVerfahrenPolygon(nr) ? "kml" : undefined),
      uebersicht: kmlUebersicht,
      bc: null,
    };
  }

  const uebersicht: Record<string, VerfahrenPolygon> = { ...kmlUebersicht };
  for (const [nr, p] of Object.entries(bc.uebersicht)) uebersicht[nr] = mitName(p, kmlUebersicht[nr]);
  return {
    polygon: (nr) => (bc.voll[nr] ? mitName(bc.voll[nr], getVerfahrenPolygon(nr)) : getVerfahrenPolygon(nr)),
    herkunft: (nr) => (bc.voll[nr] ? "bc" : getVerfahrenPolygon(nr) ? "kml" : undefined),
    uebersicht,
    bc,
  };
}
