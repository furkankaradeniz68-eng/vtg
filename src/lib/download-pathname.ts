// Pfad der Mitglieder-Download-Dateien im Blob-Speicher. Wird vom Browser (direkter
// Upload) und vom Server (Registrierung) identisch berechnet, daher ohne
// Server-only-Abhaengigkeiten.
export const MAX_DOWNLOAD_BYTES = 500 * 1024 * 1024;

export function downloadBlobPathname(id: string, filename: string): string {
  const name = filename.replace(/[\\/]/g, "_");
  return `downloads/${id}-${name}`;
}
