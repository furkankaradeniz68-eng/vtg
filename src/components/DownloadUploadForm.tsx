"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import AbonnentSearchSelect from "@/components/AbonnentSearchSelect";
import { downloadBlobPathname, MAX_DOWNLOAD_BYTES } from "@/lib/download-pathname";

type Abonnent = { username: string; label: string };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const primaryButtonClass =
  "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white disabled:opacity-60";

function formatMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
}

// Mitglieder-Download hochladen. Die Datei geht direkt vom Browser in den
// Blob-Speicher (Dateien > 4,5 MB duerfen nicht durch eine Vercel-Funktion
// laufen); danach wird sie nur noch registriert.
export default function DownloadUploadForm({ abonnenten }: { abonnenten: Abonnent[] }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const username = String(data.get("username") ?? "");
    const expiryDays = Number(data.get("expiryDays"));
    const file = data.get("file");
    if (!username || !(file instanceof File) || file.size === 0 || !(expiryDays > 0)) {
      setError("Bitte Benutzer, Datei und Gültigkeit angeben.");
      return;
    }
    if (file.size > MAX_DOWNLOAD_BYTES) {
      setError(`Die Datei ist mit ${formatMb(file.size)} zu groß (maximal ${formatMb(MAX_DOWNLOAD_BYTES)}).`);
      return;
    }

    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const id = crypto.randomUUID();
      await upload(downloadBlobPathname(id, file.name), file, {
        access: "private",
        handleUploadUrl: "/api/downloads/upload-token",
        multipart: file.size > 50 * 1024 * 1024,
        contentType: file.type || "application/octet-stream",
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      const res = await fetch("/api/downloads/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username, filename: file.name, expiryDays }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Die Datei konnte nicht zugewiesen werden.");
      }
      window.location.href = "/admin?tab=mitglieder";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-12 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
    >
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-neutral-800">
          Benutzer
        </label>
        <AbonnentSearchSelect abonnenten={abonnenten} name="username" />
      </div>
      <div>
        <label htmlFor="file" className="mb-1 block text-sm font-medium text-neutral-800">
          Datei (bis {formatMb(MAX_DOWNLOAD_BYTES)})
        </label>
        <input id="file" name="file" type="file" required disabled={busy} className={inputClass} />
      </div>
      <div>
        <label htmlFor="expiryDays" className="mb-1 block text-sm font-medium text-neutral-800">
          Gültig für (Tage)
        </label>
        <input
          id="expiryDays"
          name="expiryDays"
          type="number"
          min={1}
          defaultValue={30}
          required
          disabled={busy}
          className={inputClass}
        />
      </div>
      {busy && (
        <div aria-live="polite">
          <div className="h-2 w-full overflow-hidden rounded bg-neutral-200">
            <div className="h-full bg-vtg-yellow transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-sm text-neutral-600">Wird hochgeladen … {progress} %. Bitte das Fenster nicht schließen.</p>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className={`mt-2 ${primaryButtonClass}`}>
        {busy ? "Lädt hoch …" : "Hochladen"}
      </button>
    </form>
  );
}
