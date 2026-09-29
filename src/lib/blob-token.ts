// Beim Umzug des Blob-Stores auf die Frankfurt-Region (fra1) hat Vercel das
// Token beim Verbinden mit dem Projekt unter dem Namen "BLOB_FRA_READ_WRITE_TOKEN"
// statt des von @vercel/blob standardmaessig erwarteten "BLOB_READ_WRITE_TOKEN"
// angelegt. Ohne explizite Angabe suchen put()/get()/del()/head()/list() nur nach
// der Standard-Variable und schlagen in Produktion mit "No blob credentials found"
// fehl. Dieser Helfer loest das Token robust auf (Standardname zuerst, sonst der
// Frankfurt-Name) und wird an jeden @vercel/blob-Aufruf im Projekt uebergeben.
export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_FRA_READ_WRITE_TOKEN;

// Alle `get()`-Aufrufe gegen den Blob-Store liefen bisher ohne Timeout: haengt
// der zugrunde liegende fetch (z.B. bei einer kalten Serverless-Instanz oder
// einem Netzwerk-Hickup), haengt die gesamte Anfrage bis zum Vercel-Plattform-
// Limit von ~300s (siehe Ausfall vom 2026-09-29 und der daran anschliessende
// intermittierende Haenger auf /mitgliederbereich/verfahrensauswahl). Dieses
// AbortSignal wird an jeden get()-Aufruf uebergeben, damit ein haengender
// Blob-Request spaetestens nach BLOB_TIMEOUT_MS mit einem Fehler abbricht,
// statt die Anfrage bis zum Plattform-Limit zu blockieren.
export const BLOB_TIMEOUT_MS = 8000;

export function blobAbortSignal(): AbortSignal {
  return AbortSignal.timeout(BLOB_TIMEOUT_MS);
}
