// Ersetzt finanzbericht-beispieldaten.ts: Finanzpositionen kommen jetzt pro
// Verfahren aus dem naechtlichen BC-Snapshot (vtgBudgetLines), gruppiert nach
// Sachkonto-Praefix. Anders als die alte Platzhalterdatei sind diese Zahlen
// jetzt echt pro Verfahren unterschiedlich, nicht global.
//
// Kontogruppen-Zuordnung anhand der realen Beispieldaten bestaetigt:
//   Ausfuehrungskosten/A1        -> 411xxx - 416xxx
//   Sonstige Ausfuehrungskosten/A2 -> 422xx - 425xx
//   Einnahmen                    -> alle Konten, die mit "8" beginnen (811xx-891xx)
// Die Bilanzkonten (0730-1890) fuer die Finanzuebersicht-Kennzahlen
// (Kontostand/Forderungen/Vermoegen) sind NICHT Teil der von BC gelieferten
// Feldspezifikation (Feldmapping.md hat dafuer keine eigene Entity, obwohl das
// urspruengliche Anforderungsdokument eine separate "Finanzuebersicht-
// Kennzahlen"-Tabelle vorsah). Kontostand/Forderungen/Vermoegen unten sind
// daher ein bestmoeglicher Ableitungsversuch aus den Bilanzkonten und sollten
// mit der Buchhaltung (Umut/BC-Entwicklung) validiert werden, bevor sie
// produktiv angezeigt werden.
import { get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";
import { BUDGET_LINES_PATHNAME } from "@/lib/bc-sync";
import type { BcBudgetLine } from "@/lib/bc-types";

export type FinanzZeile = {
  konto: string;
  ausgaben: number;
  plan: number;
  typ?: "gruppe" | "gesamt";
};

export type FinanzKategorie = {
  slug: string;
  titel: string;
  suffix?: string;
  zeilen: FinanzZeile[];
};

export type FinanzAnsicht = "laufzeit" | "haushaltsjahr";
export type FinanzKategorieSlug = "einnahmen" | "ausfuehrungskosten-a1" | "sonstige-ausfuehrungskosten-a2";

export const KATEGORIE_INFO: Record<FinanzKategorieSlug, { titel: string; suffix?: string }> = {
  einnahmen: { titel: "Einnahmen" },
  "ausfuehrungskosten-a1": { titel: "Ausführungskosten", suffix: "A1" },
  "sonstige-ausfuehrungskosten-a2": { titel: "Sonstige Ausführungskosten", suffix: "A2" },
};

function kategorieVonKonto(glAccountNo: string): FinanzKategorieSlug | undefined {
  const praefix3 = glAccountNo.slice(0, 3);
  if (["411", "412", "413", "414", "415", "416"].includes(praefix3)) return "ausfuehrungskosten-a1";
  if (["422", "423", "424", "425"].includes(praefix3)) return "sonstige-ausfuehrungskosten-a2";
  if (glAccountNo.startsWith("8")) return "einnahmen";
  return undefined;
}

// Bewusst ohne Modul-Level-Cache und ohne React `cache()` — siehe Begruendung
// in bc-companies.ts: `cache()` scoped nicht zuverlaessig in Route Handlern
// (z.B. /api/finanzbericht/pdf) und kann dort einen einmal haengenden Promise
// dauerhaft auf einer warmen Serverless-Instanz festhalten.
async function loadBudgetLines(): Promise<BcBudgetLine[]> {
  const result = await get(BUDGET_LINES_PATHNAME, { access: "private", token: BLOB_TOKEN, abortSignal: blobAbortSignal() }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    throw new Error("BC-Finanzdaten-Snapshot nicht gefunden — wurde der naechtliche Sync schon ausgefuehrt?");
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as BcBudgetLine[];
}

async function loadByCompany(): Promise<Map<string, BcBudgetLine[]>> {
  const all = await loadBudgetLines();
  const byCompany = new Map<string, BcBudgetLine[]>();
  for (const row of all) {
    const list = byCompany.get(row.vtgCompanyNo);
    if (list) list.push(row);
    else byCompany.set(row.vtgCompanyNo, [row]);
  }
  return byCompany;
}

export async function getLatestFinancialYear(nr: string): Promise<number | undefined> {
  const byCompany = await loadByCompany();
  const rows = byCompany.get(nr);
  if (!rows || rows.length === 0) return undefined;
  return Math.max(...rows.map((r) => r.financialYear));
}

// Fuer Listen-Ansichten (getAllVerfahren/getVerfahrenByKreis): dort wurde
// bisher pro Verfahren einzeln getLatestFinancialYear() aufgerufen, was ohne
// Cache bei jedem Aufruf den kompletten Budget-Lines-Blob neu laedt - bei N
// Verfahren also N volle Blob-Downloads (parallel oder sogar sequenziell),
// was regelmaessig zu Zeitueberschreitungen fuehrte (siehe Ausfall vom
// 2026-09-29). Diese Variante laedt den Blob genau einmal und liefert das
// Ergebnis fuer alle Firmen auf einen Schlag.
export async function getLatestFinancialYearsByCompany(): Promise<Map<string, number>> {
  const byCompany = await loadByCompany();
  const result = new Map<string, number>();
  for (const [nr, rows] of byCompany) {
    if (rows.length === 0) continue;
    result.set(nr, Math.max(...rows.map((r) => r.financialYear)));
  }
  return result;
}

function summeZeile(konto: string, ausgaben: number, plan: number): FinanzZeile {
  return { konto, ausgaben, plan };
}

function jahrAusRows(rows: BcBudgetLine[]): number | undefined {
  if (rows.length === 0) return undefined;
  return Math.max(...rows.map((r) => r.financialYear));
}

// Fuer Detail-Seiten (Finanzuebersicht/Finanzbericht), die fuer dasselbe
// Verfahren mehrere Kategorien/Kennzahlen auf einmal brauchen: laedt den
// Budget-Lines-Blob genau einmal und liefert nur die Zeilen der gewuenschten
// Firma. Aufrufer koennen das Ergebnis an findeFinanzKategorie/
// getFinanzUebersichtKennzahlen als `vorgeladeneRows` durchreichen, statt
// dass jede dieser Funktionen den kompletten Blob selbst erneut abruft
// (siehe N+1-Ausfall vom 2026-09-29 — dasselbe Muster wie in bc-companies.ts,
// nur auf Einzelverfahren-Detailseiten statt Listenansichten).
export async function getBudgetLinesForCompany(nr: string): Promise<BcBudgetLine[]> {
  const byCompany = await loadByCompany();
  return byCompany.get(nr) ?? [];
}

export async function findeFinanzKategorie(
  nr: string,
  slug: FinanzKategorieSlug,
  ansicht: FinanzAnsicht,
  vorgeladeneRows?: BcBudgetLine[],
): Promise<FinanzKategorie> {
  const alleRows = vorgeladeneRows ?? (await getBudgetLinesForCompany(nr));
  const rows = alleRows.filter((r) => kategorieVonKonto(r.glAccountNo) === slug);
  // Jahr wird aus denselben, bereits geladenen Zeilen abgeleitet statt ueber
  // einen zweiten getLatestFinancialYear()-Aufruf (der intern wieder den
  // kompletten Blob neu laden wuerde — vorheriger Bug, verdoppelte jeden
  // Aufruf dieser Funktion unnoetig).
  const jahr = jahrAusRows(alleRows);
  const aktuelleRows = jahr ? rows.filter((r) => r.financialYear === jahr) : rows;

  // Laufzeit: kumulierter Saldo (balance) vs. Laufzeitbudget (termBudget).
  // Haushaltsjahr: nur der Anteil des laufenden Jahres (balance minus
  // Vorjahresuebertrag) vs. Jahresprogramm (annualBudget).
  //
  // Vorzeichen-Korrektur fuer Einnahmen: BC fuehrt Ertragskonten (alle "8"-
  // Konten) auf der Haben-Seite, ihr Saldo kommt aus der OData-Schnittstelle
  // daher naturgemaess negativ. Ausfuehrungskosten (Aufwand, Soll-Konten)
  // sind davon nicht betroffen und bleiben unveraendert. Siehe Nacharbeiten-
  // PDF Punkt 4/9: "Einnahmen im Minus" trotz korrekter Betraege.
  const vorzeichenFaktor = slug === "einnahmen" ? -1 : 1;
  const werte = (row: BcBudgetLine): { ausgaben: number; plan: number } =>
    ansicht === "laufzeit"
      ? { ausgaben: vorzeichenFaktor * row.balance, plan: vorzeichenFaktor * row.termBudget }
      : {
          ausgaben: vorzeichenFaktor * (row.balance - row.carryOverPrevYear),
          plan: vorzeichenFaktor * row.annualBudget,
        };

  // Punkt 10 (Nacharbeiten-PDF): Einnahmen-Konten (811xx-891xx) sollen
  // 2-stellig gruppiert werden (81, 82, ... statt 811, 812, ...) — bei
  // Ausfuehrungskosten/Sonstige Ausfuehrungskosten bleibt die bisherige
  // 3-stellige Gruppierung.
  const gruppenStellen = slug === "einnahmen" ? 2 : 3;
  const gruppen = new Map<string, BcBudgetLine[]>();
  for (const row of aktuelleRows) {
    const gruppenSchluessel = row.glAccountNo.slice(0, gruppenStellen);
    const list = gruppen.get(gruppenSchluessel);
    if (list) list.push(row);
    else gruppen.set(gruppenSchluessel, [row]);
  }

  const zeilen: FinanzZeile[] = [];
  let gesamtAusgaben = 0;
  let gesamtPlan = 0;

  for (const [gruppenSchluessel, gruppenRows] of [...gruppen.entries()].sort()) {
    let gruppenAusgaben = 0;
    let gruppenPlan = 0;
    const positionsZeilen: FinanzZeile[] = [];
    for (const row of [...gruppenRows].sort((a, b) => a.glAccountNo.localeCompare(b.glAccountNo))) {
      const { ausgaben, plan } = werte(row);
      gruppenAusgaben += ausgaben;
      gruppenPlan += plan;
      positionsZeilen.push(summeZeile(`${row.glAccountNo} ${row.glAccountName}`, ausgaben, plan));
    }
    zeilen.push({ konto: `Summe ${gruppenSchluessel}:`, ausgaben: gruppenAusgaben, plan: gruppenPlan, typ: "gruppe" });
    zeilen.push(...positionsZeilen);
    gesamtAusgaben += gruppenAusgaben;
    gesamtPlan += gruppenPlan;
  }

  zeilen.push({ konto: "Gesamtsumme", ausgaben: gesamtAusgaben, plan: gesamtPlan, typ: "gesamt" });

  // Punkt 11 (Nacharbeiten-PDF): A1-Download fehlte der untere Soll-Ist-
  // Vergleich. Nur die zwei Zeilen, die sich zuverlaessig aus vorhandenen
  // BC-Feldern ableiten lassen, werden ergaenzt — "Summe BD (8.3)" bleibt
  // aussen vor, da die dafuer noetige BC-Dimension noch mit Umut/
  // Buchhaltung geklaert werden muss (gleiche offene Frage wie bei
  // getFinanzUebersichtKennzahlen). Plan = Ausgaben, da es fuer diese
  // abgeleiteten Zeilen keinen eigenen Plan-Wert in BC gibt — so zeigt die
  // Differenz-Spalte neutral 0,00 statt eines erfundenen Werts.
  if (slug === "ausfuehrungskosten-a1") {
    const nichtZuwendungsfaehig =
      ansicht === "laufzeit"
        ? aktuelleRows.reduce((summe, row) => summe + row.notEligibleFinYear, 0)
        : aktuelleRows.reduce((summe, row) => summe + (row.notEligibleFinYear - row.notEligiblePrevYear), 0);
    const zuwendungsfaehig = gesamtAusgaben - nichtZuwendungsfaehig;
    zeilen.push({ konto: "Nicht zuwendungsfähige AK (Plan)", ausgaben: nichtZuwendungsfaehig, plan: nichtZuwendungsfaehig, typ: "gesamt" });
    zeilen.push({ konto: "Zuwendungsfähige AK", ausgaben: zuwendungsfaehig, plan: zuwendungsfaehig, typ: "gesamt" });
  }

  const info = KATEGORIE_INFO[slug];
  return { slug, titel: info.titel, suffix: info.suffix, zeilen };
}

export async function gesamtsummeFuerKategorie(
  nr: string,
  slug: FinanzKategorieSlug,
  vorgeladeneRows?: BcBudgetLine[],
): Promise<number> {
  // Fuer die Finanzuebersicht-Kachelsummen wird, wie im Original, die
  // kumulierte Laufzeit-Ansicht herangezogen.
  const kategorie = await findeFinanzKategorie(nr, slug, "laufzeit", vorgeladeneRows);
  return kategorie.zeilen.find((z) => z.typ === "gesamt")?.ausgaben ?? 0;
}

export type FinanzUebersichtKennzahlen = {
  kontostand: number;
  forderungenVerbindlichkeiten: number;
  forderungenVerbindlichkeitenBD: number;
  vermoegenDerTG: number;
};

const BILANZKONTEN = ["0730", "0800", "1000", "1200", "1360", "1400", "1500", "1590", "1600", "1800", "1890"];

export async function getFinanzUebersichtKennzahlen(
  nr: string,
  vorgeladeneRows?: BcBudgetLine[],
): Promise<FinanzUebersichtKennzahlen> {
  const rows = vorgeladeneRows ?? (await getBudgetLinesForCompany(nr));
  const jahr = jahrAusRows(rows);
  const aktuelleRows = jahr ? rows.filter((r) => r.financialYear === jahr) : rows;

  const saldoVon = (konto: string) =>
    aktuelleRows.filter((r) => r.glAccountNo === konto).reduce((sum, r) => sum + r.balance, 0);

  const kontostand = saldoVon("1200");
  const forderungenVerbindlichkeiten = saldoVon("1400") - saldoVon("1600");
  const vermoegenDerTG = BILANZKONTEN.reduce((sum, konto) => sum + saldoVon(konto), 0);

  return {
    kontostand,
    forderungenVerbindlichkeiten,
    // "BD" ist in der BC-Feldspezifikation nicht erklaert und laesst sich aus
    // der reinen Sachkonto-Liste nicht sicher ableiten — vorlaeufig 0, bis
    // BC-Entwicklung (Umut) das Konto/die Dimension dafuer benennt.
    forderungenVerbindlichkeitenBD: 0,
    vermoegenDerTG,
  };
}
