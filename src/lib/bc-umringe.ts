// Verfahrensumringe aus Business Central (Entity vtgProcedureAreas, API-Gruppe rlp).
// Der Abgleich holt alle Umringe samt Geometrie, fasst sie je Mandant zu einem
// MultiPolygon zusammen (voll und vereinfacht fuer die Gesamtkarte, wie bisher aus dem
// KML) und legt das Ergebnis als privaten Blob ab. Vorerst nur gegen die BC-Sandbox und
// nur fuer die Admin-Testansicht; die oeffentliche Karte nutzt weiter den KML-Stand.
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { BC_RLP_BASE_URL } from "@/lib/bc-config";
import { getBcToken } from "@/lib/bc-client";
import type { VerfahrenPolygon } from "@/lib/verfahren-polygone";

// Zwei getrennte Staende: "test" (BC-Sandbox, nur fuer die Admin-Testansicht) und
// "produktion" (echte BC-Daten, fuer die oeffentliche Karte, sobald sie freigegeben ist).
export type UmringeZiel = "test" | "produktion";
// Frueherer gemeinsamer Name (enthielt Sandbox-Daten); wird beim naechsten Abgleich geloescht.
export const ALTER_BLOB_PATHNAME = "verfahren-umringe-bc.json";
const BLOB_PATHNAME: Record<UmringeZiel, string> = {
  test: "verfahren-umringe-bc-test.json",
  produktion: "verfahren-umringe-bc-produktion.json",
};
// Sandbox-Umgebung laut Mail von Erik (BC-Entwicklung); per Env-Variable aenderbar.
const SANDBOX_UMGEBUNG = "Test_22-09-2026";
// Toleranz der Vereinfachung fuer die Gesamtkarte (Grad, ca. 30 m) wie im KML-Skript.
const VEREINFACHUNG = 0.0003;

export function umringeBaseUrl(ziel: UmringeZiel = "test"): string {
  const url =
    ziel === "produktion"
      ? (process.env.BC_UMRINGE_PRODUKTION_BASE_URL ?? BC_RLP_BASE_URL)
      : (process.env.BC_UMRINGE_BASE_URL ?? BC_RLP_BASE_URL.replace("/Production/", `/${SANDBOX_UMGEBUNG}/`));
  return url.replace(/\/$/, "");
}

// Schalter fuer die oeffentliche Karte und den naechtlichen Abgleich: erst wenn BC die
// Umringe in der Produktion bereitgestellt hat, wird BC_UMRINGE_QUELLE=produktion gesetzt.
export function umringeAusBcAktiv(): boolean {
  return process.env.BC_UMRINGE_QUELLE === "produktion";
}

export type BcUmringeDaten = {
  syncedAt: string;
  umgebung: string;
  anzahlDatensaetze: number;
  voll: Record<string, VerfahrenPolygon>;
  uebersicht: Record<string, VerfahrenPolygon>;
};

type Row = Record<string, unknown>;
type Ring = number[][];

async function bcGet(url: string, json: boolean, base: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${await getBcToken()}`, Accept: "application/json" } });
  if (!res.ok) throw new Error(`BC-Abruf fehlgeschlagen: HTTP ${res.status} (${url.replace(base, "…").slice(0, 80)})`);
  return json ? res.json() : res.text();
}

async function bcGetAll(entity: string, base: string): Promise<Row[]> {
  const rows: Row[] = [];
  let url: string | undefined = `${base}/${entity}`;
  while (url) {
    const page = (await bcGet(url, true, base)) as { value?: Row[]; "@odata.nextLink"?: string };
    rows.push(...(page.value ?? []));
    url = page["@odata.nextLink"];
  }
  return rows;
}

function perpDist(p: number[], a: number[], b: number[]): number {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

// Douglas-Peucker (iterativ), wie scripts/convert-kml-verfahren-polygone.py.
function vereinfacheRing(ring: Ring, epsilon: number): Ring {
  if (ring.length <= 4) return ring;
  const keep = new Array<boolean>(ring.length).fill(false);
  keep[0] = keep[ring.length - 1] = true;
  const stack: [number, number][] = [[0, ring.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop()!;
    let dmax = 0, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perpDist(ring[i], ring[s], ring[e]);
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (idx !== -1 && dmax > epsilon) {
      keep[idx] = true;
      stack.push([s, idx], [idx, e]);
    }
  }
  const out = ring.filter((_, i) => keep[i]);
  return out.length < 4 ? ring : out;
}

function polygone(geo: { type?: string; coordinates?: unknown } | undefined): Ring[][] {
  if (geo?.type === "Polygon") return [geo.coordinates as Ring[]];
  if (geo?.type === "MultiPolygon") return geo.coordinates as Ring[][];
  throw new Error(`Unerwarteter Geometrietyp „${geo?.type ?? "?"}“`);
}

const runden = (ring: Ring): Ring => ring.map(([lon, lat]) => [Math.round(lon * 1e6) / 1e6, Math.round(lat * 1e6) / 1e6]);

export async function syncUmringeVonBc(ziel: UmringeZiel = "test"): Promise<BcUmringeDaten> {
  const base = umringeBaseUrl(ziel);
  const [areas, companies] = await Promise.all([bcGetAll("vtgProcedureAreas", base), bcGetAll("vtgCompanies", base)]);
  const namen = new Map(companies.map((c) => [String(c.vtgCompanyNo), String(c.name ?? "")]));

  // Geometrien parallel (6 gleichzeitig) holen; Link ist absolut oder relativ zur Basis-URL,
  // ohne zusaetzliches /$value.
  const geos: Ring[][][] = new Array(areas.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < areas.length) {
        const i = next++;
        const link = areas[i]["geometryGeoJson@odata.mediaReadLink"] as string | undefined;
        if (!link) throw new Error(`Datensatz ${String(areas[i].vtgCompanyNo)} hat keinen Geometrie-Link`);
        const url = link.startsWith("http") ? link : `${base}/${link.replace(/^\//, "")}`;
        geos[i] = polygone(JSON.parse((await bcGet(url, false, base)) as string));
      }
    }),
  );

  const voll: Record<string, VerfahrenPolygon> = {};
  const uebersicht: Record<string, VerfahrenPolygon> = {};
  areas.forEach((row, i) => {
    const nr = String(row.vtgCompanyNo);
    const neu = (): VerfahrenPolygon => ({
      verfahrensname: namen.get(nr) ?? "",
      dlrName: String(row.dlrName ?? ""),
      type: "MultiPolygon",
      coordinates: [],
    });
    voll[nr] ??= neu();
    uebersicht[nr] ??= neu();
    for (const poly of geos[i]) {
      const ringe = poly.map(runden);
      voll[nr].coordinates.push(ringe);
      uebersicht[nr].coordinates.push(ringe.map((r) => vereinfacheRing(r, VEREINFACHUNG)));
    }
  });

  const daten: BcUmringeDaten = {
    syncedAt: new Date().toISOString(),
    umgebung: base.match(/v2\.0\/[^/]+\/([^/]+)\//)?.[1] ?? "?",
    anzahlDatensaetze: areas.length,
    voll,
    uebersicht,
  };
  await put(BLOB_PATHNAME[ziel], JSON.stringify(daten), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
  return daten;
}

export async function ladeBcUmringe(ziel: UmringeZiel = "test"): Promise<BcUmringeDaten | null> {
  const result = await get(BLOB_PATHNAME[ziel], { access: "private", useCache: false, token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as BcUmringeDaten;
}
