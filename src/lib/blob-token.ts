// Beim Umzug des Blob-Stores auf die Frankfurt-Region (fra1) hat Vercel das
// Token beim Verbinden mit dem Projekt unter dem Namen "BLOB_FRA_READ_WRITE_TOKEN"
// statt des von @vercel/blob standardmaessig erwarteten "BLOB_READ_WRITE_TOKEN"
// angelegt. Ohne explizite Angabe suchen put()/get()/del()/head()/list() nur nach
// der Standard-Variable und schlagen in Produktion mit "No blob credentials found"
// fehl. Dieser Helfer loest das Token robust auf (Standardname zuerst, sonst der
// Frankfurt-Name) und wird an jeden @vercel/blob-Aufruf im Projekt uebergeben.
export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_FRA_READ_WRITE_TOKEN;
