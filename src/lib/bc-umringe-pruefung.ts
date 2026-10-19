// Pruefung der BC-Schnittstelle "vtgProcedureAreas" (Verfahrensumringe) gegen den
// bisherigen KML-Stand. Nur lesende Abrufe; es wird nichts in BC oder auf der Homepage
// veraendert. Wird vom Admin ueber /api/bc-umringe-test aufgerufen und laeuft damit
// serverseitig mit den vorhandenen BC-Zugangsdaten (die nie ausgegeben werden).
// Vorlaeufiges Hilfsmittel fuer die Umstellung der Karte auf BC-Daten.
import polygonData from "@/data/verfahren-polygone.json";
import { umringeBaseUrl } from "@/lib/bc-umringe";
import { listBcCompanyNumbers } from "@/lib/bc-companies";
import { getBcToken } from "@/lib/bc-client";
import { dlrFarbe, normalisiereDlrName, type VerfahrenPolygon } from "@/lib/verfahren-polygone";

const DLR_FARBE_FALLBACK = dlrFarbe("__unbekannt__");

// Rheinland-Pfalz grob (WGS84): Werte ausserhalb deuten auf vertauschte Achsen oder ein
// anderes Koordinatensystem (z. B. EPSG:31466) hin.
const RLP = { lonMin: 5.9, lonMax: 8.6, latMin: 48.9, latMax: 51.0 };

type Row = Record<string, unknown>;
type Ring = number[][];
type GeoJsonLike = { type?: string; coordinates?: unknown; geometry?: unknown; features?: { geometry: unknown }[] };

const FELD = {
  nr: ["vtgCompanyNo", "companyNo", "vtgCompanyNumber", "procedureNo"],
  dlr: ["dlrName", "dlr"],
  center: ["hasCenter"],
};

function feld(row: Row, namen: string[]): unknown {
  for (const n of namen) if (row[n] !== undefined && row[n] !== null) return row[n];
  return undefined;
}

function polygoneVon(geo: GeoJsonLike | undefined): Ring[][] | null {
  if (!geo) return null;
  if (geo.type === "Polygon") return [geo.coordinates as Ring[]];
  if (geo.type === "MultiPolygon") return geo.coordinates as Ring[][];
  if (geo.type === "Feature") return polygoneVon(geo.geometry as GeoJsonLike);
  if (geo.type === "FeatureCollection") return (geo.features ?? []).flatMap((f) => polygoneVon(f.geometry as GeoJsonLike) ?? []);
  return null;
}

function ringFlaeche(ring: Ring, latRef: number): number {
  const k = Math.cos((latRef * Math.PI) / 180);
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * k * ring[i + 1][1] - ring[i + 1][0] * k * ring[i][1];
  return Math.abs(a / 2);
}

type Analyse = { fehler: string[]; teil: number; ringe: number; loecher: number; punkte: number; flaeche: number };

function analysiere(geo: GeoJsonLike | undefined): Analyse {
  const polys = polygoneVon(geo);
  if (!polys) return { fehler: [`unbekannter Typ „${geo?.type ?? "?"}“`], teil: 0, ringe: 0, loecher: 0, punkte: 0, flaeche: 0 };
  const fehler: string[] = [];
  let ringe = 0, loecher = 0, punkte = 0, flaeche = 0;
  let lonMin = Infinity, lonMax = -Infinity, latMin = Infinity, latMax = -Infinity;
  for (const poly of polys) {
    poly.forEach((ring, i) => {
      ringe += 1;
      if (i > 0) loecher += 1;
      punkte += ring.length;
      const first = ring[0], last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) fehler.push("Ring nicht geschlossen");
      if (ring.length < 4) fehler.push("Ring mit weniger als 4 Punkten");
      for (const [lon, lat] of ring) {
        lonMin = Math.min(lonMin, lon); lonMax = Math.max(lonMax, lon);
        latMin = Math.min(latMin, lat); latMax = Math.max(latMax, lat);
      }
    });
  }
  const latRef = (latMin + latMax) / 2;
  for (const poly of polys) poly.forEach((ring, i) => (flaeche += (i === 0 ? 1 : -1) * ringFlaeche(ring, latRef)));
  if (lonMin < RLP.lonMin || lonMax > RLP.lonMax || latMin < RLP.latMin || latMax > RLP.latMax) {
    const vertauscht = latMin >= RLP.lonMin && latMax <= RLP.lonMax && lonMin >= RLP.latMin && lonMax <= RLP.latMax;
    fehler.push(
      vertauscht
        ? "Achsen vertauscht (lat/lon statt lon/lat)"
        : `Koordinaten ausserhalb von Rheinland-Pfalz (lon ${lonMin.toFixed(2)}…${lonMax.toFixed(2)}, lat ${latMin.toFixed(2)}…${latMax.toFixed(2)}), anderes Koordinatensystem?`,
    );
  }
  return { fehler: [...new Set(fehler)], teil: polys.length, ringe, loecher, punkte, flaeche };
}

async function mitParallelitaet<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

type Optionen = { baseUrl?: string; getToken?: () => Promise<string> };

export async function erstelleUmringeBericht(opts: Optionen = {}): Promise<string> {
  const baseUrl = (opts.baseUrl ?? umringeBaseUrl()).replace(/\/$/, "");
  const getToken = opts.getToken ?? getBcToken;

  async function bcGet(url: string, json: boolean): Promise<unknown> {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken()}`, Accept: "application/json" } });
    if (!res.ok) {
      const hinweis = res.status === 401 || res.status === 403 ? " (Zugriff auf diese BC-Umgebung nicht freigeschaltet?)" : "";
      throw new Error(`GET ${url.replace(baseUrl, "…")} fehlgeschlagen: HTTP ${res.status}${hinweis}`);
    }
    return json ? res.json() : res.text();
  }
  async function bcGetAll(entity: string): Promise<{ rows: Row[]; seiten: number }> {
    const rows: Row[] = [];
    let url: string | undefined = `${baseUrl}/${entity}`;
    let seiten = 0;
    while (url) {
      const page = (await bcGet(url, true)) as { value?: Row[]; "@odata.nextLink"?: string };
      rows.push(...(page.value ?? []));
      url = page["@odata.nextLink"];
      seiten += 1;
    }
    return { rows, seiten };
  }

  const out: string[] = [];
  const log = (z = "") => void out.push(z);
  log("# Testbericht BC-Verfahrensumringe");
  log();
  log(`Stand: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })} · Umgebung: ${baseUrl.match(/v2\.0\/[^/]+\/([^/]+)\//)?.[1] ?? "?"}`);
  log();

  let areas: Row[];
  try {
    const r = await bcGetAll("vtgProcedureAreas");
    areas = r.rows;
    log("## 1. Abruf");
    log(`- vtgProcedureAreas: ${areas.length} Datensätze auf ${r.seiten} Seite(n). Zugang zur Umgebung funktioniert.`);
  } catch (e) {
    log("## 1. Abruf");
    log(`- FEHLER: ${(e as Error).message}`);
    return out.join("\n");
  }
  if (areas.length === 0) {
    log("- Keine Datensätze.");
    return out.join("\n");
  }
  const felder = Object.keys(areas[0]);
  log(`- Felder im ersten Datensatz: ${felder.join(", ")}`);
  const nrFeld = FELD.nr.find((n) => felder.includes(n));
  const mediaKey = felder.find((f) => f.startsWith("geometryGeoJson") && f.endsWith("@odata.mediaReadLink"));
  if (!nrFeld || !mediaKey) {
    log(`- FEHLER: ${!nrFeld ? `kein Feld für die Mandantennummer (erwartet: ${FELD.nr.join(", ")})` : "kein geometryGeoJson@odata.mediaReadLink"}.`);
    return out.join("\n");
  }

  const geoErgebnis = await mitParallelitaet(areas, 6, async (row) => {
    try {
      const link = row[mediaKey] as string | undefined;
      if (!link) return { fehler: ["kein Geometrie-Link"] } as Partial<Analyse>;
      const url = link.startsWith("http") ? link : `${baseUrl}/${link.replace(/^\//, "")}`;
      return analysiere(JSON.parse((await bcGet(url, false)) as string) as GeoJsonLike);
    } catch (e) {
      return { fehler: [`Abruf/Parsen fehlgeschlagen: ${(e as Error).message}`] } as Partial<Analyse>;
    }
  });

  type Pro = { nr: string; dlr: Set<string>; umringe: number; teil: number; loecher: number; punkte: number; flaeche: number; fehler: string[] };
  const proNr = new Map<string, Pro>();
  areas.forEach((row, i) => {
    const nr = String(row[nrFeld]);
    const g = geoErgebnis[i];
    const e = proNr.get(nr) ?? { nr, dlr: new Set<string>(), umringe: 0, teil: 0, loecher: 0, punkte: 0, flaeche: 0, fehler: [] };
    e.umringe += 1;
    const dlr = feld(row, FELD.dlr);
    if (dlr) e.dlr.add(String(dlr));
    e.teil += g.teil ?? 0;
    e.loecher += g.loecher ?? 0;
    e.punkte += g.punkte ?? 0;
    e.flaeche += g.flaeche ?? 0;
    e.fehler.push(...(g.fehler ?? []));
    proNr.set(nr, e);
  });
  const summe = (k: "teil" | "loecher" | "punkte") => [...proNr.values()].reduce((s, e) => s + e[k], 0);
  log(`- Mandanten mit Umring: ${proNr.size} · Umringe (Datensätze): ${areas.length} · Teilpolygone: ${summe("teil")} · Löcher: ${summe("loecher")} · Koordinatenpunkte: ${summe("punkte").toLocaleString("de-DE")}`);

  log();
  log("## 2. Geometrie");
  const fehlerhaft = [...proNr.values()].filter((e) => e.fehler.length);
  if (fehlerhaft.length === 0) {
    log("- Alle Geometrien gültig (Typ, geschlossene Ringe, Koordinaten in Rheinland-Pfalz, Achsenreihenfolge lon/lat).");
  } else {
    log(`- ${fehlerhaft.length} Mandant(en) mit Auffälligkeiten:`);
    for (const e of fehlerhaft.slice(0, 40)) log(`  - ${e.nr}: ${[...new Set(e.fehler)].join("; ")}`);
  }
  log(`- Verfahren mit Löchern: ${[...proNr.values()].filter((e) => e.loecher > 0).length} · mit mehreren Teilflächen: ${[...proNr.values()].filter((e) => e.teil > 1).length}`);

  log();
  log("## 3. DLR-Namen und Farben");
  const dlrZaehler = new Map<string, number>();
  for (const e of proNr.values()) for (const d of e.dlr) dlrZaehler.set(d, (dlrZaehler.get(d) ?? 0) + 1);
  for (const [d, n] of [...dlrZaehler.entries()].sort((a, b) => b[1] - a[1])) {
    log(`- ${d}: ${n} Mandanten · ${dlrFarbe(d) !== DLR_FARBE_FALLBACK ? "Farbe vorhanden" : "KEINE FARBE (grau), Schreibweise abweichend?"}`);
  }
  log(`- Mandanten ohne DLR-Angabe: ${[...proNr.values()].filter((e) => e.dlr.size === 0).length}`);

  log();
  log("## 4. Abgleich mit den BC-Mandanten");
  let companyNrs: Set<string> | null = null;
  try {
    const { rows: companies } = await bcGetAll("vtgCompanies");
    companyNrs = new Set(companies.map((c) => String(c.vtgCompanyNo)));
    const ohneUmring = [...companyNrs].filter((n) => !proNr.has(n));
    const ohneMandant = [...proNr.keys()].filter((n) => !companyNrs!.has(n));
    log(`- vtgCompanies: ${companies.length} Mandanten · mit Umring: ${companyNrs.size - ohneUmring.length} · ohne Umring: ${ohneUmring.length}`);
    if (ohneMandant.length) log(`- Umringe zu Nummern ohne Mandant in vtgCompanies: ${ohneMandant.join(", ")}`);
    if (areas.some((r) => feld(r, FELD.center) !== undefined)) {
      log(`- Ersatzpunkte (hasCenter=true): ${areas.filter((r) => feld(r, FELD.center) === true).length} von ${areas.length} Datensätzen`);
    } else {
      log("- Feld hasCenter nicht in vtgProcedureAreas gefunden.");
    }
    log(`- Mandanten ohne Umring: ${ohneUmring.sort().join(", ") || "keine"}`);
  } catch (e) {
    log(`- vtgCompanies konnte nicht abgerufen werden: ${(e as Error).message}`);
  }

  log();
  log("## 5. Vergleich mit dem bisherigen KML-Stand (TZ_20240227)");
  const kml = polygonData as Record<string, VerfahrenPolygon>;
  const kmlNr = new Set(Object.keys(kml));
  const nurBc = [...proNr.keys()].filter((n) => !kmlNr.has(n));
  const nurKml = [...kmlNr].filter((n) => !proNr.has(n) && (!companyNrs || companyNrs.has(n)));
  const nurKmlOhneMandant = [...kmlNr].filter((n) => !proNr.has(n) && companyNrs && !companyNrs.has(n));
  const gemeinsam = [...proNr.keys()].filter((n) => kmlNr.has(n));
  log(`- KML: ${kmlNr.size} Verfahren · BC: ${proNr.size} Mandanten · in beiden: ${gemeinsam.length}`);
  log(`- Nur in BC (neu): ${nurBc.length}${nurBc.length ? ` (${nurBc.slice(0, 30).join(", ")})` : ""}`);
  log(`- Nur im KML, aber BC-Mandant ohne Umring (fehlt in BC): ${companyNrs ? nurKml.length : "?"}${companyNrs && nurKml.length ? ` (${nurKml.join(", ")})` : ""}`);
  if (companyNrs) log(`- Nur im KML, ohne BC-Mandant (vermutlich abgeschlossene Verfahren): ${nurKmlOhneMandant.length}`);

  const abw = { teil: [] as string[], loch: [] as string[], flaeche: [] as string[], dlr: [] as string[] };
  for (const nr of gemeinsam) {
    const b = proNr.get(nr)!;
    const k = analysiere({ type: "MultiPolygon", coordinates: kml[nr].coordinates });
    if (b.teil !== k.teil) abw.teil.push(`${nr} (BC ${b.teil} / KML ${k.teil})`);
    if (b.loecher !== k.loecher) abw.loch.push(`${nr} (BC ${b.loecher} / KML ${k.loecher})`);
    const rel = k.flaeche ? Math.abs(b.flaeche - k.flaeche) / k.flaeche : 0;
    if (rel > 0.02) abw.flaeche.push(`${nr} (${(rel * 100).toFixed(1)} %)`);
    const bd = [...b.dlr][0];
    if (bd && kml[nr].dlrName && normalisiereDlrName(bd) !== normalisiereDlrName(kml[nr].dlrName)) abw.dlr.push(`${nr} (BC „${bd}“ / KML „${kml[nr].dlrName}“)`);
  }
  const zeig = (titel: string, liste: string[]) =>
    log(`- ${titel}: ${liste.length}${liste.length ? ` – ${liste.slice(0, 80).join("; ")}${liste.length > 80 ? " …" : ""}` : ""}`);
  zeig("Abweichende Anzahl Teilflächen", abw.teil);
  zeig("Abweichende Anzahl Löcher", abw.loch);
  zeig("Flächenabweichung über 2 %", abw.flaeche);
  zeig("Echte Abweichung bei der DLR-Zuordnung (Schreibweise ignoriert)", abw.dlr);

  log();
  log("## 6. Abgleich mit den Mandanten der Homepage");
  let homepageNrs: Set<string> | null = null;
  try {
    homepageNrs = new Set(await listBcCompanyNumbers());
  } catch (e) {
    log(`- Mandanten der Homepage nicht verfügbar: ${(e as Error).message}`);
  }
  let kmlFehltFuerHomepage: string[] = [];
  if (homepageNrs) {
    const hp = homepageNrs;
    const liste = (a: string[]) => `${a.length}${a.length ? ` (${a.sort().slice(0, 60).join(", ")}${a.length > 60 ? " …" : ""})` : ""}`;
    const hpMitBc = [...hp].filter((n) => proNr.has(n));
    const hpOhneBc = [...hp].filter((n) => !proNr.has(n));
    kmlFehltFuerHomepage = hpOhneBc.filter((n) => kmlNr.has(n));
    const hpOhneBeides = hpOhneBc.filter((n) => !kmlNr.has(n));
    log(`- Mandanten auf der Homepage (laufender BC-Stand): ${hp.size} · davon mit Umring in BC: ${hpMitBc.length} · ohne Umring in BC: ${hpOhneBc.length}`);
    log(`- Auf der Homepage, KML hat einen Umring, **BC nicht** (hier würde die Karte verloren gehen): ${liste(kmlFehltFuerHomepage)}`);
    log(`- Auf der Homepage, weder in BC noch im KML ein Umring: ${liste(hpOhneBeides)}`);
    const fehlt29 = nurKml;
    log(`- Von den ${fehlt29.length} „fehlt in BC“-Verfahren (Abschnitt 5) sind auf der Homepage vorhanden: ${liste(fehlt29.filter((n) => hp.has(n)))}`);
    log(`- … nicht auf der Homepage (vermutlich abgeschlossen, unkritisch): ${fehlt29.filter((n) => !hp.has(n)).length}`);
    log(`- Umringe in BC zu Mandanten, die nicht auf der Homepage sind: ${liste([...proNr.keys()].filter((n) => !hp.has(n)))}`);
  }

  log();
  log("## Fazit");
  const probleme: string[] = [];
  if (fehlerhaft.length) probleme.push(`${fehlerhaft.length} Mandant(en) mit Geometrie-Auffälligkeiten`);
  if ([...dlrZaehler.keys()].some((d) => dlrFarbe(d) === DLR_FARBE_FALLBACK)) probleme.push("DLR-Namen ohne Kartenfarbe");
  if (abw.teil.length || abw.loch.length) probleme.push("Teilflächen/Löcher weichen vom KML ab");
  if (abw.flaeche.length) probleme.push("Flächenabweichungen");
  if (abw.dlr.length) probleme.push(`${abw.dlr.length} abweichende DLR-Zuordnung(en)`);
  if (kmlFehltFuerHomepage.length) probleme.push(`${kmlFehltFuerHomepage.length} Verfahren der Homepage hätten in BC keinen Umring, obwohl das KML einen hat`);
  log(probleme.length ? `- Zu klären: ${probleme.join("; ")}.` : "- Keine Auffälligkeiten: Geometrie, Teilflächen, Löcher und DLR-Namen passen zum bisherigen Stand.");
  return out.join("\n");
}
