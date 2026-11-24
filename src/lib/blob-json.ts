// Gemeinsames Laden der JSON-Daten, die die Anwendung selbst im privaten
// Vercel-Blob-Speicher pflegt (Personen, Links, Umlage, Downloads ...).
//
// Frueher behandelte jedes Modul "Datei fehlt" und "Lesen fehlgeschlagen"
// gleich und speicherte in beiden Faellen seine Startdaten. Ein einzelner
// Timeout konnte so alle im Admin gepflegten Daten ueberschreiben. Deshalb:
//  - ladeBlobJson/ladeOderLegeAn werfen bei einem Lesefehler. Alles, was
//    anschliessend speichert, muss diese Varianten benutzen: lieber eine
//    Fehlermeldung als ein Speichern auf falscher Grundlage.
//  - zurAnzeige() faengt den Fehler fuer reine Anzeigen ab und liefert einen
//    Ersatzwert, ohne etwas zu speichern.
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";

async function leseText(pathname: string): Promise<string | undefined> {
  const result = await get(pathname, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  });
  // get() liefert nur bei 404 null, alle anderen Fehler werden geworfen.
  if (!result) return undefined;
  if (result.statusCode !== 200) throw new Error(`Blob ${pathname}: unerwarteter Status ${result.statusCode}`);
  return new Response(result.stream).text();
}

// undefined = Datei existiert nicht. Ein kurzer Aussetzer wird einmal
// wiederholt; nach einem Timeout nicht, sonst wartet die Seite doppelt so lang.
export async function ladeBlobJson<T>(pathname: string): Promise<T | undefined> {
  let text: string | undefined;
  try {
    text = await leseText(pathname);
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) throw error;
    await new Promise((resolve) => setTimeout(resolve, 300));
    text = await leseText(pathname);
  }
  return text === undefined ? undefined : (JSON.parse(text) as T);
}

// Legt die Startdaten an, wenn die Datei noch nicht existiert. allowOverwrite
// ist bewusst aus: existiert sie doch, schlaegt das Anlegen fehl, statt
// gepflegte Daten zu ersetzen.
export async function ladeOderLegeAn<T>(pathname: string, startdaten: T): Promise<T> {
  const daten = await ladeBlobJson<T>(pathname);
  if (daten !== undefined) return daten;
  await put(pathname, JSON.stringify(startdaten), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: false,
    token: BLOB_TOKEN,
  });
  return structuredClone(startdaten);
}

export async function zurAnzeige<T>(laden: () => Promise<T>, ersatz: T): Promise<T> {
  try {
    return await laden();
  } catch (error) {
    console.error("Blob-Daten nicht lesbar, zeige Ersatzwerte an (nichts gespeichert):", error);
    return structuredClone(ersatz);
  }
}
