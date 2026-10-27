// OAuth2-Client-Credentials-Flow gegen Business Central + generisches Paging
// ueber @odata.nextLink. Das BC-Token ist laut Entwicklung ca. 60 Minuten
// gueltig und MUSS zwischengespeichert werden, sonst droht Rate-Limiting.
// Serverless-Functions sind zustandslos zwischen Cold-Starts, aber dieser
// Client wird ausschliesslich aus dem naechtlichen Sync-Job (Abschnitt "Weg A"
// im BC-Konzept) heraus aufgerufen, nicht pro Seitenaufruf - ein simpler
// Modul-Cache reicht daher aus.
import { BC_TOKEN_URL, BC_SCOPE, BC_RLP_BASE_URL, BC_GRANTS_BASE_URL } from "@/lib/bc-config";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} ist nicht gesetzt.`);
  return value;
}

type TokenCache = { accessToken: string; expiresAt: number };
let cachedToken: TokenCache | null = null;

async function fetchToken(): Promise<TokenCache> {
  const clientId = getEnv("BC_RLP_CLIENT_ID");
  const clientSecret = getEnv("BC_RLP_CLIENT_SECRET");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: BC_SCOPE,
  });

  const res = await fetch(BC_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    // Der Antwort-Body darf NIE in eine dem Aufrufer sichtbare Fehlermeldung
    // wandern: Azure AD spiegelt bei manchen Fehlern (z.B. AADSTS700016) den
    // von uns gesendeten client_id-Wert wortwoertlich zurueck - landet dort
    // versehentlich das Secret (z.B. durch Copy-Paste-Fehler in der
    // Env-Var), waere es sonst im API-Response/Log sichtbar. Nur serverseitig
    // loggen, dem Aufrufer nur den Status-Code zeigen.
    console.error(`BC-Token-Anfrage fehlgeschlagen: ${res.status} ${await res.text()}`);
    throw new Error(`BC-Token-Anfrage fehlgeschlagen: HTTP ${res.status} (Details im Server-Log)`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // 5 Minuten Sicherheitsabstand vor tatsaechlichem Ablauf.
  const expiresAt = Date.now() + (data.expires_in - 300) * 1000;
  return { accessToken: data.access_token, expiresAt };
}

// Auch fuer die Umringe (bc-umringe.ts) und die Offenen Posten (offene-posten.ts) genutzt.
export async function getBcToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }
  cachedToken = await fetchToken();
  return cachedToken.accessToken;
}

type ExportFileEntry = {
  filename: string;
  contentType?: string;
  snapshotDateTime: string;
  generationId?: string;
  "content@odata.mediaReadLink": string;
};

export type BcExportFile = {
  filename: string;
  // Aus den BC-Metadaten (Feld "contentType") - der Download-Header von BC selbst
  // ist immer application/octet-stream.
  contentType?: string;
  snapshotDateTime: string;
  generationId?: string;
  buffer: ArrayBuffer;
};

// Holt eine Datei aus einer BC-Export-Entity (tgExportFiles, grantOverviewExportFiles)
// ueber einen OData-$filter. Erster Request liefert nur Metadaten + Downloadlink
// (content@odata.mediaReadLink), zweiter Request (gleiches Token) liefert die
// eigentlichen Binaerdaten - siehe Anleitung von Erik (BC-Entwicklung, 2026).
// Der $filter ist hier immer so gebaut, dass genau ein aktueller Datensatz
// zurueckkommt, Paging ueber @odata.nextLink ist fuer diesen Anwendungsfall
// daher nicht noetig.
async function fetchBcFile(baseUrl: string, entity: string, filter: string): Promise<BcExportFile | null> {
  const token = await getBcToken();
  const url = `${baseUrl}/${entity}?${new URLSearchParams({ $filter: filter }).toString()}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    console.error(`BC-Abfrage fehlgeschlagen (${entity}): ${res.status} ${await res.text()}`);
    throw new Error(`BC-Abfrage fehlgeschlagen (${entity}): HTTP ${res.status} (Details im Server-Log)`);
  }
  const data = (await res.json()) as { value: ExportFileEntry[] };
  const entry = data.value[0];
  if (!entry) return null;

  const mediaRes = await fetch(entry["content@odata.mediaReadLink"], {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!mediaRes.ok) {
    console.error(`BC-Dateiabruf fehlgeschlagen (${entity}): ${mediaRes.status} ${await mediaRes.text()}`);
    throw new Error(`BC-Dateiabruf fehlgeschlagen (${entity}): HTTP ${mediaRes.status} (Details im Server-Log)`);
  }

  return {
    filename: entry.filename,
    contentType: entry.contentType,
    snapshotDateTime: entry.snapshotDateTime,
    generationId: entry.generationId,
    buffer: await mediaRes.arrayBuffer(),
  };
}

// Naechtlicher TG-Einzeldaten-Export (Entity "tgExportFiles").
export function fetchBcExportFile(filter: string): Promise<BcExportFile | null> {
  return fetchBcFile(BC_RLP_BASE_URL, "tgExportFiles", filter);
}

// Gemeinsame Abruf-/Zuwendungsuebersicht-Excel (Entity "grantOverviewExportFiles",
// API-Gruppe "grants") - eine Datei fuer alle Mandanten, nur die aktuelle.
export function fetchBcGrantOverviewFile(): Promise<BcExportFile | null> {
  return fetchBcFile(BC_GRANTS_BASE_URL, "grantOverviewExportFiles", "isCurrent eq true");
}

// Offene Posten (Entity "openLedgerExportFiles", API-Gruppe rlp): je Erzeugung eine
// Excel pro DLR (groupCode "1" bis "9", Dateiname OPn_TT.MM.JJ.xlsx) und ein ZIP mit allen
// (groupCode leer). isCurrent markiert die aktuelle Erzeugung.
export type BcOpenLedgerEntry = {
  id: string;
  groupCode: string;
  filename: string;
  fileType: string;
  contentType?: string;
  byteSize?: number;
  snapshotDateTime: string;
  "content@odata.mediaReadLink": string;
};

export async function listBcOpenLedgerFiles(): Promise<BcOpenLedgerEntry[]> {
  const token = await getBcToken();
  const url = `${BC_RLP_BASE_URL}/openLedgerExportFiles?${new URLSearchParams({ $filter: "isCurrent eq true" }).toString()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    console.error(`BC-Abfrage fehlgeschlagen (openLedgerExportFiles): ${res.status} ${await res.text()}`);
    throw new Error(`BC-Abfrage fehlgeschlagen (openLedgerExportFiles): HTTP ${res.status} (Details im Server-Log)`);
  }
  const data = (await res.json()) as { value: BcOpenLedgerEntry[] };
  return data.value.map((e) => ({ ...e, groupCode: String(e.groupCode ?? "") }));
}

// Laedt den Dateiinhalt ueber den Downloadlink eines Eintrags (mit Bearer-Token, ohne /$value).
export async function downloadBcMedia(entry: BcOpenLedgerEntry): Promise<ArrayBuffer> {
  const res = await fetch(entry["content@odata.mediaReadLink"], { headers: { Authorization: `Bearer ${await getBcToken()}` } });
  if (!res.ok) {
    console.error(`BC-Dateiabruf fehlgeschlagen (openLedgerExportFiles): ${res.status} ${await res.text()}`);
    throw new Error(`BC-Dateiabruf fehlgeschlagen: HTTP ${res.status} (Details im Server-Log)`);
  }
  return res.arrayBuffer();
}

type ODataResponse<T> = { value: T[]; "@odata.nextLink"?: string };

// Liest eine BC-Entity vollstaendig aus, inkl. Paging ueber @odata.nextLink
// (BC deckelt Antworten auf 20.000 Zeilen/Seite).
export async function fetchBcEntityAllPages<T>(entity: "vtgCompanies" | "vtgBudgetLines"): Promise<T[]> {
  // BC wirft bei seitenweisem Abruf gelegentlich 410 "SkipTokenIsNoLongerValid" (z. B. wenn BC
  // waehrenddessen neu aufbaut). Dann beginnt der Abruf von vorn, bis zu dreimal.
  const VERSUCHE = 3;
  for (let versuch = 1; ; versuch++) {
    try {
      return await holeAlleSeiten<T>(entity);
    } catch (err) {
      if (!(err instanceof BcSkipTokenError) || versuch >= VERSUCHE) throw err;
      console.warn(`BC-Abruf ${entity}: Skip-Token ungueltig, neuer Versuch ${versuch + 1}/${VERSUCHE}`);
      await new Promise((r) => setTimeout(r, versuch * 10_000));
    }
  }
}

class BcSkipTokenError extends Error {}

async function holeAlleSeiten<T>(entity: string): Promise<T[]> {
  const token = await getBcToken();
  const results: T[] = [];
  let url: string | undefined = `${BC_RLP_BASE_URL}/${entity}`;

  while (url) {
    const res: Response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`BC-Abfrage fehlgeschlagen (${entity}): ${res.status} ${body}`);
      const msg = `BC-Abfrage fehlgeschlagen (${entity}): HTTP ${res.status} (Details im Server-Log)`;
      throw res.status === 410 && body.includes("SkipTokenIsNoLongerValid") ? new BcSkipTokenError(msg) : new Error(msg);
    }
    const data = (await res.json()) as ODataResponse<T>;
    results.push(...data.value);
    url = data["@odata.nextLink"];
  }

  return results;
}
