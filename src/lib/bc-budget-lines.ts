// Ersetzt finanzbericht-beispieldaten.ts: Finanzpositionen kommen jetzt pro
// Verfahren aus dem naechtlichen BC-Snapshot (vtgBudgetLines), gruppiert nach
// Sachkonto-Praefix. Anders als die alte Platzhalterdatei sind diese Zahlen
// jetzt echt pro Verfahren unterschiedlich, nicht global.
//
// Kontogruppen-Zuordnung anhand der realen Beispieldaten bestaetigt:
//   Ausfuehrungskosten/A1        -> 411xxx - 416xxx
//   Sonstige Ausfuehrungskosten/A2 -> 422xx - 425xx
//   Einnahmen                    -> alle Konten, die mit "8" beginnen (811xx-891xx)
// Die Bilanzkonten-Formel fuer die Finanzuebersicht-Kennzahlen (Kontostand/
// Forderungen-Verbindlichkeiten/Vermoegen der TG) wurde am 2026-10-07 von
// Furkan mit dem Kunden vor Ort validiert und verbindlich festgelegt
// (ersetzt den bisherigen Ableitungsversuch aus BILANZKONTEN-Summe):
//   Kontostand                     = Saldo(1200)
//   Forderungen/Verbindlichkeiten  = Saldo(1400) + Saldo(1590)
//   Forderungen/Verbindlichkeiten BD = Saldo(1591)
//   Vermoegen der TG               = Kontostand + Forderungen/Verbindlichkeiten
//                                     + Forderungen/Verbindlichkeiten BD
// Konto 1591 ("BD") ist ein normales Sachkonto aus demselben vtgBudgetLines-
// Snapshot wie alle anderen Konten hier (kein Extra-Sync noetig).
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

// ---------------------------------------------------------------------------
// Download-Berichte (Ausfuehrungskosten A1/A2, Einnahmen) — 1:1-Nachbau der
// alten vtg-rlp.de-Berichte (Soll-Ist-Vergleich mit Diff%, nicht zuwendungs-
// faehiger AK und "Summe BD (8.3)"), fachlich am 2026-10-07 anhand der
// Original-PDFs (Verfahren 11003 Graach/Himmelreich, vtg-rlp.de/?page_id=
// 775/794/804) verifiziert und mit dem Kunden abgestimmt.
//
// Bewusst eine EIGENE Funktion neben findeFinanzKategorie() — nicht als
// Ersatz: findeFinanzKategorie() bleibt unveraendert fuer die Finanzuebersicht
// -Kachel (gesamtsummeFuerKategorie), die eine andere Vorzeichen-Konvention
// braucht (Einnahmen dort positiv gedreht fuer die Kachel-Anzeige). Hier,
// fuer die Downloads, werden Einnahmen bewusst ROH/negativ gefuehrt, genau
// wie im Original (Einnahmen.pdf: Gesamtsumme = -6.244.360,56 / 227.848,90).
// ---------------------------------------------------------------------------

export type FinanzDownloadSpalten = {
  ausgaben: number;
  nichtZuFaehig: number | null;
  plan: number | null;
  diffEur: number | null;
  diffProz: number | null;
};

export type FinanzDownloadZeile = {
  konto: string;
  typ?: "gruppe" | "gesamt" | "sonder";
  laufzeit: FinanzDownloadSpalten;
  haushaltsjahr: FinanzDownloadSpalten;
};

export type FinanzDownloadKategorie = {
  slug: FinanzKategorieSlug;
  titel: string;
  suffix?: string;
  // true = Ausfuehrungskosten A1 (volle 5-Spalten-Soll-Ist-Tabelle je Seite).
  // false = A2/Einnahmen (nur der rohe Ausgaben-Betrag je Seite, kein Plan/
  // Diff im Original vorhanden).
  vollSpalten: boolean;
  zeilen: FinanzDownloadZeile[];
};

function leereSpalten(ausgaben: number): FinanzDownloadSpalten {
  return { ausgaben, nichtZuFaehig: null, plan: null, diffEur: null, diffProz: null };
}

function diffProzent(plan: number, diffEur: number): number {
  return plan !== 0 ? (diffEur / plan) * 100 : 0;
}

// Haushaltsjahr-Diff%-Maskierung (vom Kunden am Original-PDF bestaetigt,
// Foto-Annotation zu Ausführungskosten-A1.pdf): auf allen Zwischensummen-/
// Positionszeilen wird ein positiver oder neutraler Prozentwert als "0,0"
// ausgewiesen, ein negativer Wert bleibt sichtbar (z.B. "Summe 415: -0,6%").
// Nur auf den beiden finalen Zeilen (Gesamtsumme, Zuwendungsfaehige AK) wird
// immer der echte Wert gezeigt, auch wenn er positiv ist. Die Laufzeit-Seite
// wird NIE maskiert (ruft diese Funktion also gar nicht auf).
function maskiertesHaushaltsjahrProzent(diffProz: number): number {
  return diffProz >= 0 ? 0 : diffProz;
}

export async function findeFinanzDownloadKategorie(
  nr: string,
  slug: FinanzKategorieSlug,
  vorgeladeneRows?: BcBudgetLine[],
): Promise<FinanzDownloadKategorie> {
  const alleRows = vorgeladeneRows ?? (await getBudgetLinesForCompany(nr));
  const jahr = jahrAusRows(alleRows);
  const rowsImJahr = jahr ? alleRows.filter((r) => r.financialYear === jahr) : alleRows;

  const kategorieRows = rowsImJahr.filter((r) => kategorieVonKonto(r.glAccountNo) === slug);
  const vollSpalten = slug === "ausfuehrungskosten-a1";

  // Rohwerte je Zeile, bewusst OHNE Vorzeichen-Korrektur (anders als
  // findeFinanzKategorie): Downloads muessen 1:1 die alte Webseite abbilden.
  const ausgabenL = (row: BcBudgetLine) => row.balance;
  const ausgabenHj = (row: BcBudgetLine) => row.balance - row.carryOverPrevYear;
  const planL = (row: BcBudgetLine) => row.termBudget;
  const planHj = (row: BcBudgetLine) => row.annualBudget;
  const nichtZuFaehigL = (row: BcBudgetLine) => row.notEligibleFinYear;
  const nichtZuFaehigHj = (row: BcBudgetLine) => row.notEligibleFinYear - row.notEligiblePrevYear;

  // Gruppierung: 3-stellig fuer A1/A2, 2-stellig fuer Einnahmen — mit
  // Sonderfall Konto "9000" (Saldenuebernahme Sachkonten), das laut
  // Original-PDF (Einnahmen.pdf) in die Gruppe "89" einsortiert wird statt
  // in eine eigene Gruppe "90".
  const gruppenSchluessel = (glAccountNo: string): string => {
    if (slug === "einnahmen") {
      if (glAccountNo.startsWith("9000")) return "89";
      return glAccountNo.slice(0, 2);
    }
    return glAccountNo.slice(0, 3);
  };

  const gruppen = new Map<string, BcBudgetLine[]>();
  for (const row of kategorieRows) {
    const schluessel = gruppenSchluessel(row.glAccountNo);
    const list = gruppen.get(schluessel);
    if (list) list.push(row);
    else gruppen.set(schluessel, [row]);
  }

  const zeilen: FinanzDownloadZeile[] = [];
  let gesamtAusgabenL = 0;
  let gesamtPlanL = 0;
  let gesamtAusgabenHj = 0;
  let gesamtPlanHj = 0;

  for (const [schluessel, gruppenRows] of [...gruppen.entries()].sort()) {
    let gL = 0;
    let pL = 0;
    let gHj = 0;
    let pHj = 0;
    const positionsZeilen: FinanzDownloadZeile[] = [];

    // Positionszeilen werden nach Kontonummer MINUS letzter Ziffer zusammen-
    // gefasst (das letzte Zeichen ist der Teilbereich-Code: 1=AG, 2=D, 3=L,
    // 4=W, 5=WD, 6=WS, 8=EU, 9=U) — exakt wie im Original (z.B. 412101..
    // 412109 werden zu einer Zeile "41210"). Beschreibung = Text vor dem
    // ersten "/" in glAccountName (am Original verifiziert anhand des
    // Grenzfalls "Planierg./Rodung+Kultivier./AG" -> "Planierg."). Diff% wird
    // auf dieser Ebene im Original nicht ausgewiesen (nur bei Summe-/
    // Gesamtzeilen).
    const positionsGruppen = new Map<string, BcBudgetLine[]>();
    for (const row of gruppenRows) {
      const posSchluessel = row.glAccountNo.length > 1 ? row.glAccountNo.slice(0, -1) : row.glAccountNo;
      const list = positionsGruppen.get(posSchluessel);
      if (list) list.push(row);
      else positionsGruppen.set(posSchluessel, [row]);
    }

    for (const [posSchluessel, posRows] of [...positionsGruppen.entries()].sort()) {
      let aL = 0;
      let aHj = 0;
      let plL = 0;
      let plHj = 0;
      let nzL = 0;
      let nzHj = 0;
      for (const row of posRows) {
        aL += ausgabenL(row);
        aHj += ausgabenHj(row);
        plL += planL(row);
        plHj += planHj(row);
        nzL += nichtZuFaehigL(row);
        nzHj += nichtZuFaehigHj(row);
      }
      gL += aL;
      pL += plL;
      gHj += aHj;
      pHj += plHj;

      const rohBeschreibung = posRows[0].glAccountName;
      const beschreibung = (rohBeschreibung.split("/")[0] ?? rohBeschreibung).trim();

      if (vollSpalten) {
        positionsZeilen.push({
          konto: `${posSchluessel} ${beschreibung}`,
          laufzeit: { ausgaben: aL, nichtZuFaehig: nzL, plan: plL, diffEur: plL - aL, diffProz: null },
          haushaltsjahr: { ausgaben: aHj, nichtZuFaehig: nzHj, plan: plHj, diffEur: plHj - aHj, diffProz: null },
        });
      } else {
        positionsZeilen.push({
          konto: `${posSchluessel} ${beschreibung}`,
          laufzeit: leereSpalten(aL),
          haushaltsjahr: leereSpalten(aHj),
        });
      }
    }

    if (vollSpalten) {
      const nzL = gruppenRows.reduce((summe, row) => summe + nichtZuFaehigL(row), 0);
      const nzHj = gruppenRows.reduce((summe, row) => summe + nichtZuFaehigHj(row), 0);
      const diffEurL = pL - gL;
      const diffEurHj = pHj - gHj;
      zeilen.push({
        konto: `Summe ${schluessel}`,
        typ: "gruppe",
        laufzeit: { ausgaben: gL, nichtZuFaehig: nzL, plan: pL, diffEur: diffEurL, diffProz: diffProzent(pL, diffEurL) },
        haushaltsjahr: {
          ausgaben: gHj,
          nichtZuFaehig: nzHj,
          plan: pHj,
          diffEur: diffEurHj,
          diffProz: maskiertesHaushaltsjahrProzent(diffProzent(pHj, diffEurHj)),
        },
      });
    } else {
      zeilen.push({ konto: `Summe ${schluessel}`, typ: "gruppe", laufzeit: leereSpalten(gL), haushaltsjahr: leereSpalten(gHj) });
    }
    zeilen.push(...positionsZeilen);

    gesamtAusgabenL += gL;
    gesamtPlanL += pL;
    gesamtAusgabenHj += gHj;
    gesamtPlanHj += pHj;
  }

  if (vollSpalten) {
    const gesamtNzL = kategorieRows.reduce((summe, row) => summe + nichtZuFaehigL(row), 0);
    const gesamtNzHj = kategorieRows.reduce((summe, row) => summe + nichtZuFaehigHj(row), 0);
    const gDiffEurL = gesamtPlanL - gesamtAusgabenL;
    const gDiffEurHj = gesamtPlanHj - gesamtAusgabenHj;

    zeilen.push({
      konto: "Gesamtsumme",
      typ: "gesamt",
      laufzeit: {
        ausgaben: gesamtAusgabenL,
        nichtZuFaehig: gesamtNzL,
        plan: gesamtPlanL,
        diffEur: gDiffEurL,
        diffProz: diffProzent(gesamtPlanL, gDiffEurL),
      },
      haushaltsjahr: {
        ausgaben: gesamtAusgabenHj,
        nichtZuFaehig: gesamtNzHj,
        plan: gesamtPlanHj,
        diffEur: gDiffEurHj,
        diffProz: diffProzent(gesamtPlanHj, gDiffEurHj), // finale Zeile: NIE maskiert
      },
    });

    // "Nicht zuwendungsfaehige AK (Plan)": nur Ausgaben + Diff(=0,00)
    // sichtbar, FinPl/nicht-zu.fae/% bleiben leer (Original-PDF) — es gibt
    // dafuer keinen eigenen Planwert in BC.
    zeilen.push({
      konto: "Nicht zuwendungsfähige AK (Plan)",
      typ: "sonder",
      laufzeit: { ausgaben: gesamtNzL, nichtZuFaehig: null, plan: null, diffEur: 0, diffProz: null },
      haushaltsjahr: { ausgaben: gesamtNzHj, nichtZuFaehig: null, plan: null, diffEur: 0, diffProz: null },
    });

    // "Summe BD (8.3)": Saldo der Einnahmen-Gruppe 83xxx, als Abzugsposten bei
    // den Ausfuehrungskosten. Diff/% werden auf dieser Zeile im Original nicht
    // ausgewiesen.
    // Vorzeichen (am Original-PDF verifiziert, Verfahren 11003): der Ausgaben-
    // Wert (balance-basiert) ist auf der Einnahmen-Seite roh negativ gefuehrt
    // (siehe Einnahmen.pdf, Summe 83: -16.902,18) und muss daher gedreht
    // werden (-> 16.902,18). Die Plan-Werte (termBudget/annualBudget) sind in
    // BC dagegen bereits POSITIV gespeichert und duerfen NICHT gedreht werden
    // (sonst: -9.462,00 statt korrekt 9.462,00 — verifiziert anhand des
    // Original-PDFs: "Summe BD (8.3): 16.902,18 / 9.462,00 / 0,00 / 0,00").
    const einnahmenRows = rowsImJahr.filter(
      (row) => kategorieVonKonto(row.glAccountNo) === "einnahmen" && row.glAccountNo.startsWith("83"),
    );
    const bdAusgabenL = -einnahmenRows.reduce((summe, row) => summe + ausgabenL(row), 0);
    const bdAusgabenHj = -einnahmenRows.reduce((summe, row) => summe + ausgabenHj(row), 0);
    const bdPlanL = einnahmenRows.reduce((summe, row) => summe + planL(row), 0);
    const bdPlanHj = einnahmenRows.reduce((summe, row) => summe + planHj(row), 0);
    zeilen.push({
      konto: "Summe BD (8.3)",
      typ: "sonder",
      laufzeit: { ausgaben: bdAusgabenL, nichtZuFaehig: null, plan: bdPlanL, diffEur: null, diffProz: null },
      haushaltsjahr: { ausgaben: bdAusgabenHj, nichtZuFaehig: null, plan: bdPlanHj, diffEur: null, diffProz: null },
    });

    // "Zuwendungsfaehige AK" = Gesamtsumme − nicht zuwendungsfaehige AK − BD.
    // Wichtig (am Original-PDF verifiziert, Verfahren 11003 — Ausgaben-Seite:
    // 6.259.045,33 − 1.256,44 − 16.902,18 = 6.240.886,71; Plan-Seite:
    // 7.005.350,00 − 0 − 9.462,00 = 6.995.888,00): auf der FinPl/
    // Jahresprogramm-Seite traegt "nicht zuwendungsfaehig" NICHT bei (kein
    // eigener Planwert in BC) — dort wird nur BD abgezogen. Auf der Ausgaben-
    // Seite wird nicht-zu-fae. dagegen sehr wohl abgezogen.
    const zAusgabenL = gesamtAusgabenL - gesamtNzL - bdAusgabenL;
    const zAusgabenHj = gesamtAusgabenHj - gesamtNzHj - bdAusgabenHj;
    const zPlanL = gesamtPlanL - bdPlanL;
    const zPlanHj = gesamtPlanHj - bdPlanHj;
    const zDiffEurL = zPlanL - zAusgabenL;
    const zDiffEurHj = zPlanHj - zAusgabenHj;
    zeilen.push({
      konto: "Zuwendungsfähige AK",
      typ: "gesamt",
      laufzeit: {
        ausgaben: zAusgabenL,
        nichtZuFaehig: null,
        plan: zPlanL,
        diffEur: zDiffEurL,
        diffProz: diffProzent(zPlanL, zDiffEurL),
      },
      haushaltsjahr: {
        ausgaben: zAusgabenHj,
        nichtZuFaehig: null,
        plan: zPlanHj,
        diffEur: zDiffEurHj,
        diffProz: diffProzent(zPlanHj, zDiffEurHj), // finale Zeile: NIE maskiert
      },
    });
  } else {
    zeilen.push({
      konto: "Gesamtsumme",
      typ: "gesamt",
      laufzeit: leereSpalten(gesamtAusgabenL),
      haushaltsjahr: leereSpalten(gesamtAusgabenHj),
    });
  }

  const info = KATEGORIE_INFO[slug];
  return { slug, titel: info.titel, suffix: info.suffix, vollSpalten, zeilen };
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
  const forderungenVerbindlichkeiten = saldoVon("1400") + saldoVon("1590");
  const forderungenVerbindlichkeitenBD = saldoVon("1591");
  const vermoegenDerTG = kontostand + forderungenVerbindlichkeiten + forderungenVerbindlichkeitenBD;

  return {
    kontostand,
    forderungenVerbindlichkeiten,
    forderungenVerbindlichkeitenBD,
    vermoegenDerTG,
  };
}
