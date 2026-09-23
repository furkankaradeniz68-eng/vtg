// Geokoordinaten je Verfahren (fuer die Standort-Karte in Verfahrensdaten).
// TG-Vorsitzender-Name/Adresse kommen seit dem BC-Umstieg direkt aus BC
// (chairperson/address/postCode/city, siehe bc-companies.ts) und werden hier
// nicht mehr gelesen. Koordinaten liefert BC nicht (siehe Feldmapping.md),
// daher bleiben sie in diesem privaten Blob-Speicher.
import { get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const BLOB_PATHNAME = "verfahren-personendaten.json";

type Koordinaten = { lat: number; lng: number };

type KoordinatenMap = Record<string, Koordinaten>;

let cachedPromise: Promise<KoordinatenMap> | null = null;

async function loadKoordinaten(): Promise<KoordinatenMap> {
  if (!cachedPromise) {
    cachedPromise = (async () => {
      const result = await get(BLOB_PATHNAME, { access: "private", token: BLOB_TOKEN });
      if (!result || result.statusCode !== 200) {
        throw new Error("Verfahren-Personendaten-Blob nicht gefunden.");
      }
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text) as Record<string, { koordinaten?: Koordinaten | null }>;
      return Object.fromEntries(
        Object.entries(parsed)
          .filter(([, v]) => v.koordinaten)
          .map(([nr, v]) => [nr, v.koordinaten as Koordinaten]),
      );
    })();
  }
  return cachedPromise;
}

export async function getKoordinaten(nr: string): Promise<Koordinaten | undefined> {
  const map = await loadKoordinaten();
  return map[nr];
}
