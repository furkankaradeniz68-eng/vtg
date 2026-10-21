// Verfahrensumringe aus Business Central (Entity vtgProcedureAreas, API-Gruppe rlp).
// Der Abgleich holt alle Umringe samt Geometrie, fasst sie je Mandant zu einem
// MultiPolygon zusammen (voll und vereinfacht fuer die Gesamtkarte, wie bisher aus dem
// KML) und legt das Ergebnis als privaten Blob ab. Vorerst nur gegen die BC-Sandbox und
// nur fuer die Admin-Testansicht; die oeffentliche Karte nutzt weiter den KML-Stand.
// Geometrien werden nur neu geladen, wenn sich der geometryHash des Datensatzes geaendert
// hat; ohne Aenderung wird nichts geschrieben.
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

// Zwischenspeicher je Umring (Schluessel "Mandant#areaNo"): die zuletzt geladene, bereits
// aufbereitete Geometrie samt Hashes aus BC. Nur der Abgleich liest ihn.
const CACHE_PATHNAME: Record<UmringeZiel, string> = {
  test: "verfahren-umringe-bc-test-cache.json",
  produktion: "verfahren-umringe-bc-produktion-cache.json",
};
type Ring = number[][];
type BereichCache = { geometryHash: string; contentHash: string; voll: Ring[][]; ueb: Ring[][] };

export type UmringeStatistik = {
  datensaetze: number;
  neu: number;
  geometrieGeaendert: number;
  nurInhaltGeaendert: number;
  entfernt: number;
  unveraendert: number;
  geladen: number; // einzeln aus BC heruntergeladene Geometrien
  ohneHash: number;
  ohneGeometrie: number;
  geschrieben: boolean;
};

export function statistikText(s: UmringeStatistik): string {
  const teile = [
    `${s.datensaetze} Datensätze`,
    `${s.neu} neu`,
    `${s.geometrieGeaendert} Geometrie geändert`,
    `${s.nurInhaltGeaendert} nur Inhalt geändert`,
    `${s.entfernt} entfernt`,
    `${s.unveraendert} unverändert`,
    `${s.geladen} Geometrien geladen`,
  ];
  if (s.ohneHash) teile.push(`${s.ohneHash} ohne Hash`);
  if (s.ohneGeometrie) teile.push(`${s.ohneGeometrie} ohne Umring`);
  teile.push(s.geschrieben ? "gespeichert" : "keine Änderung, nichts gespeichert");
  return teile.join(" · ");
}

export type BcUmringeDaten = {
  syncedAt: string;
  umgebung: string;
  anzahlDatensaetze: number;
  voll: Record<string, VerfahrenPolygon>;
  uebersicht: Record<string, VerfahrenPolygon>;
};

type Row = Record<string, unknown>;

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

async function ladeBlobJson<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as T;
}

const hashVon = (v: unknown): string => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));

// vollstaendig: Zwischenspeicher ignorieren und alle Geometrien neu laden.
export async function syncUmringeVonBc(
  ziel: UmringeZiel = "test",
  optionen: { vollstaendig?: boolean } = {},
): Promise<{ daten: BcUmringeDaten; statistik: UmringeStatistik }> {
  const base = umringeBaseUrl(ziel);
  const [areas, companies, vorher, cacheAlt] = await Promise.all([
    bcGetAll("vtgProcedureAreas", base),
    bcGetAll("vtgCompanies", base),
    ladeBcUmringe(ziel),
    optionen.vollstaendig ? Promise.resolve(null) : ladeBlobJson<{ bereiche: Record<string, BereichCache> }>(CACHE_PATHNAME[ziel]),
  ]);
  const namen = new Map(companies.map((c) => [String(c.vtgCompanyNo), String(c.name ?? "")]));
  const alt = cacheAlt?.bereiche ?? {};

  // Je Datensatz entscheiden: aus dem Zwischenspeicher uebernehmen (gleicher geometryHash)
  // oder neu laden. Fehlt der Hash in BC, wird sicherheitshalber immer geladen.
  const statistik: UmringeStatistik = {
    datensaetze: areas.length, neu: 0, geometrieGeaendert: 0, nurInhaltGeaendert: 0, entfernt: 0,
    unveraendert: 0, geladen: 0, ohneHash: 0, ohneGeometrie: 0, geschrieben: false,
  };
  const keys: string[] = [];
  const zaehler = new Map<string, number>();
  const neuCache: Record<string, BereichCache> = {};
  const zuLaden: number[] = [];
  const hashes: { geo: string; inhalt: string }[] = [];
  areas.forEach((row, i) => {
    const nr = String(row.vtgCompanyNo);
    const lfd = row.areaNo != null && row.areaNo !== "" ? String(row.areaNo) : String((zaehler.get(nr) ?? 0) + 1);
    zaehler.set(nr, (zaehler.get(nr) ?? 0) + 1);
    let key = `${nr}#${lfd}`;
    while (keys.includes(key)) key += "+";
    keys.push(key);
    const geo = hashVon(row.geometryHash), inhalt = hashVon(row.contentHash);
    hashes.push({ geo, inhalt });
    if (!row["geometryGeoJson@odata.mediaReadLink"]) { statistik.ohneGeometrie++; return; }
    if (!geo) statistik.ohneHash++;
    const a = alt[key];
    if (!a) { statistik.neu++; zuLaden.push(i); }
    else if (!geo || a.geometryHash !== geo) { statistik.geometrieGeaendert++; zuLaden.push(i); }
    else {
      if (inhalt && a.contentHash !== inhalt) statistik.nurInhaltGeaendert++;
      else statistik.unveraendert++;
      neuCache[key] = { ...a, contentHash: inhalt || a.contentHash };
    }
  });
  statistik.entfernt = Object.keys(alt).filter((k) => !keys.includes(k)).length;

  // Geometrien parallel (6 gleichzeitig) holen; Link ist absolut oder relativ zur Basis-URL,
  // ohne zusaetzliches /$value.
  let next = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < zuLaden.length) {
        const i = zuLaden[next++];
        const link = areas[i]["geometryGeoJson@odata.mediaReadLink"] as string;
        const url = link.startsWith("http") ? link : `${base}/${link.replace(/^\//, "")}`;
        const polys = polygone(JSON.parse((await bcGet(url, false, base)) as string)).map((poly) => poly.map(runden));
        neuCache[keys[i]] = {
          geometryHash: hashes[i].geo,
          contentHash: hashes[i].inhalt,
          voll: polys,
          ueb: polys.map((ringe) => ringe.map((r) => vereinfacheRing(r, VEREINFACHUNG))),
        };
        statistik.geladen++;
      }
    }),
  );

  const voll: Record<string, VerfahrenPolygon> = {};
  const uebersicht: Record<string, VerfahrenPolygon> = {};
  areas.forEach((row, i) => {
    const c = neuCache[keys[i]];
    if (!c) return;
    const nr = String(row.vtgCompanyNo);
    const neu = (): VerfahrenPolygon => ({
      verfahrensname: namen.get(nr) ?? "",
      dlrName: String(row.dlrName ?? ""),
      type: "MultiPolygon",
      coordinates: [],
    });
    voll[nr] ??= neu();
    uebersicht[nr] ??= neu();
    voll[nr].coordinates.push(...c.voll);
    uebersicht[nr].coordinates.push(...c.ueb);
  });

  // Aenderung gegenueber dem gespeicherten Stand? Name und DLR kommen nicht aus den
  // Geometrie-Hashes, daher zusaetzlich direkt vergleichen.
  const nrNeu = Object.keys(voll), nrAlt = Object.keys(vorher?.voll ?? {});
  const stammdatenGeaendert =
    nrNeu.length !== nrAlt.length ||
    nrNeu.some((nr) => {
      const v = vorher?.voll[nr];
      return !v || v.verfahrensname !== voll[nr].verfahrensname || v.dlrName !== voll[nr].dlrName;
    });
  const geaendert =
    !vorher || !!optionen.vollstaendig || stammdatenGeaendert || statistik.neu + statistik.geometrieGeaendert + statistik.nurInhaltGeaendert + statistik.entfernt > 0;

  const daten: BcUmringeDaten = vorher && !geaendert
    ? vorher
    : {
        syncedAt: new Date().toISOString(),
        umgebung: base.match(/v2\.0\/[^/]+\/([^/]+)\//)?.[1] ?? "?",
        anzahlDatensaetze: areas.length,
        voll,
        uebersicht,
      };
  if (geaendert) {
    await put(BLOB_PATHNAME[ziel], JSON.stringify(daten), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: BLOB_TOKEN,
    });
    statistik.geschrieben = true;
  }
  if (!cacheAlt || statistik.geladen > 0 || statistik.entfernt > 0 || statistik.nurInhaltGeaendert > 0) {
    await put(CACHE_PATHNAME[ziel], JSON.stringify({ bereiche: neuCache }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: BLOB_TOKEN,
    });
  }
  return { daten, statistik };
}

export async function ladeBcUmringe(ziel: UmringeZiel = "test"): Promise<BcUmringeDaten | null> {
  return ladeBlobJson<BcUmringeDaten>(BLOB_PATHNAME[ziel]);
}
