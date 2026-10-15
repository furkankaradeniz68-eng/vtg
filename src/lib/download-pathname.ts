// Pfade und Grenzen fuer direkte Browser-Uploads in den Blob-Speicher.
// Dateien > 4,5 MB duerfen nicht durch eine Vercel-Funktion laufen
// (Request-Limit), daher laedt der Browser selbst hoch. Wird vom Browser und vom
// Server identisch benutzt, daher ohne Server-only-Abhaengigkeiten.
export const MAX_DOWNLOAD_BYTES = 500 * 1024 * 1024;

// Ab dieser Groesse laden die Admin-Formulare direkt hoch; kleinere Dateien
// gehen wie bisher im Formular mit (Vercel-Limit liegt bei ca. 4,5 MB).
export const DIRECT_UPLOAD_THRESHOLD_BYTES = 3 * 1024 * 1024;

// Zwischenablage fuer direkte Uploads aus den Admin-Formularen: Die Datei landet
// unter uploads/{uuid}-{name}; die zugehoerige Route uebernimmt diesen Pfad
// unveraendert als Blob-Pfad des Eintrags.
export const UPLOAD_PREFIX = "uploads/";

function safeName(filename: string): string {
  return filename.replace(/[\\/]/g, "_");
}

export function downloadBlobPathname(id: string, filename: string): string {
  return `downloads/${id}-${safeName(filename)}`;
}

export function uploadBlobPathname(id: string, filename: string): string {
  return `${UPLOAD_PREFIX}${id}-${safeName(filename)}`;
}
