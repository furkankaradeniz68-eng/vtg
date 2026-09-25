// Ersetzt verfahren-beispieldaten.ts: Verfahrens-Stammdaten kommen jetzt aus
// dem naechtlichen BC-Snapshot (siehe bc-sync.ts) statt aus einer hart
// codierten Liste. `aktenzeichen`/`landkreis` fehlen (noch) im BC-Feldmapping
// und werden bis auf Weiteres aus VERFAHREN_ERGAENZUNG nachgetragen.
import { cache } from "react";
import { get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { COMPANIES_PATHNAME } from "@/lib/bc-sync";
import type { BcCompany } from "@/lib/bc-types";
import type { SessionRole } from "@/lib/auth";
import { VERFAHREN_ERGAENZUNG } from "@/lib/verfahren-ergaenzungsdaten";
import { getVerknuepfteNrs } from "@/lib/verfahren-verknuepfungen";
import { getLatestFinancialYear } from "@/lib/bc-budget-lines";

export type Verfahren = {
  nr: string;
  name: string;
  dienstsitz: string;
  aktenzeichen: string;
  landkreis: string;
  hj: number;
  stand: string;
  chairperson: string;
  address: string;
  postCode: string;
  city: string;
};

const DLR_ZIFFER_ZU_DIENSTSITZ: Record<string, string[]> = {
  "1": ["Bernkastel-Kues"],
  "2": ["Kaiserslautern"],
  "3": ["Mayen"],
  "4": ["Neustadt"],
  "5": ["Prüm", "Bittburg"],
  "6": ["Simmern"],
  "7": ["Trier"],
  "8": ["Montabaur"],
  "9": ["BadKreuznach"],
};

// React-Request-Memoization statt Modul-Level-Cache: eine warme Serverless-
// Instanz darf den Blob nicht ueber mehrere Requests hinweg cachen, sonst
// bleiben "Stand" & Co. nach einem erfolgreichen naechtlichen Sync trotzdem
// eingefroren, bis die Instanz irgendwann neu startet. `cache()` dedupliziert
// nur innerhalb eines einzelnen Request-Renders.
const loadCompanies = cache(async (): Promise<BcCompany[]> => {
  const result = await get(COMPANIES_PATHNAME, { access: "private", token: BLOB_TOKEN }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    throw new Error("BC-Firmendaten-Snapshot nicht gefunden — wurde der naechtliche Sync schon ausgefuehrt?");
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as BcCompany[];
});

function formatStand(snapshotDateTime: string): string {
  const d = new Date(snapshotDateTime);
  if (Number.isNaN(d.getTime())) return snapshotDateTime;
  const datePart = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "Europe/Berlin" });
  const timePart = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
  return `${datePart} ${timePart}`;
}

async function toVerfahren(company: BcCompany): Promise<Verfahren> {
  const ergaenzung = VERFAHREN_ERGAENZUNG[company.vtgCompanyNo];
  const dienstsitzNamen = DLR_ZIFFER_ZU_DIENSTSITZ[company.dlr] ?? [];
  const hj = (await getLatestFinancialYear(company.vtgCompanyNo)) ?? new Date().getFullYear();

  return {
    nr: company.vtgCompanyNo,
    name: company.name,
    dienstsitz: dienstsitzNamen.join(" / "),
    aktenzeichen: ergaenzung?.aktenzeichen ?? "",
    landkreis: ergaenzung?.landkreis ?? "",
    hj,
    stand: formatStand(company.snapshotDateTime),
    chairperson: company.chairperson,
    address: company.address,
    postCode: company.postCode,
    city: company.city,
  };
}

export async function getAllVerfahren(): Promise<Verfahren[]> {
  const companies = await loadCompanies();
  return Promise.all(companies.map(toVerfahren));
}

export async function findVerfahren(nr: string): Promise<Verfahren | undefined> {
  const companies = await loadCompanies();
  const company = companies.find((c) => c.vtgCompanyNo === nr);
  return company ? toVerfahren(company) : undefined;
}

export async function findBcCompanyByHomepageUsername(username: string): Promise<BcCompany | undefined> {
  if (!username) return undefined;
  const companies = await loadCompanies();
  return companies.find((c) => c.homepageUsername === username);
}

// Fuer die Downloads-Zuweisung im Admin-Bereich: alle Verfahren mit BC-Login
// (homepageUsername leer = kein Mandanten-Login, siehe BC-Feldmapping).
export async function listBcAbonnenten(): Promise<{ username: string; label: string }[]> {
  const companies = await loadCompanies();
  return companies
    .filter((c) => c.homepageUsername)
    .map((c) => ({ username: c.homepageUsername, label: c.name }));
}

// Verfahren, die manuell mit `nr` verknuepft sind (z.B. EU-kofinanzierte
// Teilprojekte). Wird unterhalb der Finanzuebersicht als eigene Liste
// angezeigt, siehe verfahren-verknuepfungen.ts.
export async function getVerknuepfteVerfahren(nr: string): Promise<Verfahren[]> {
  const nrs = getVerknuepfteNrs(nr);
  if (nrs.length === 0) return [];
  const companies = await loadCompanies();
  const gefunden = companies.filter((c) => nrs.includes(c.vtgCompanyNo));
  return Promise.all(gefunden.map(toVerfahren));
}

export async function getVerfahrenByKreis(): Promise<Record<string, Verfahren[]>> {
  const companies = await loadCompanies();
  const acc: Record<string, Verfahren[]> = {};
  for (const company of companies) {
    const verfahren = await toVerfahren(company);
    for (const dienstsitz of DLR_ZIFFER_ZU_DIENSTSITZ[company.dlr] ?? []) {
      (acc[dienstsitz] ??= []).push(verfahren);
    }
  }
  return acc;
}

// Zugriffsregeln (analog zur urspruenglichen WP-Rollenlogik):
// Abonnent sieht nur die eigene Produktnummer (username == produkt_nr),
// DLR sieht nur Verfahren seines Dienstsitzes, Admin hat vollen Zugriff.
export async function istVerfahrenErreichbar(
  session: { role: SessionRole; username: string },
  nr: string,
): Promise<boolean> {
  if (session.role === "admin") return true;
  if (session.role === "abonnent") {
    return nr === session.username || getVerknuepfteNrs(session.username).includes(nr);
  }
  const byKreis = await getVerfahrenByKreis();
  const eigene = byKreis[session.username] ?? [];
  if (eigene.some((v) => v.nr === nr)) return true;
  return eigene.some((v) => getVerknuepfteNrs(v.nr).includes(nr));
}
