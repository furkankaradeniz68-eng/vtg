import SimpleTable from "@/components/SimpleTable";
import type { StorageUsage } from "@/lib/storage-usage";
import { formatFileSize } from "@/lib/downloads";

function percent(part: number, whole: number): string {
  if (whole <= 0) return "0 %";
  const p = (part / whole) * 100;
  return `${p.toLocaleString("de-DE", { maximumFractionDigits: p < 10 ? 1 : 0 })} %`;
}

// Speicher-Uebersicht fuer den Analytics-Tab: wie viel vom enthaltenen
// Blob-Speicher belegt ist, wo er verbraucht wird und welche Dateien am
// groessten sind.
export default function StorageOverview({ usage }: { usage: StorageUsage }) {
  const usedShare = Math.min(100, (usage.totalBytes / usage.includedBytes) * 100);
  const over = usage.totalBytes > usage.includedBytes;
  return (
    <div className="mb-12">
      <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Speicher</h2>
      <p className="mb-4 max-w-2xl text-sm text-neutral-600">
        Belegung des Datei-Speichers (Vercel Blob), in dem alle hochgeladenen Dateien liegen. Beim Pro-Tarif sind
        laut Vercel-Preisliste 5 GB Speicher und 100 GB Datenübertragung pro Monat enthalten; darüber hinaus
        entstehen Kosten (Speicher ca. 0,023 USD je GB und Monat). Bitte die Werte im Vercel-Konto gegenprüfen.
      </p>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-base text-neutral-900">
            <span className="text-2xl font-bold">{formatFileSize(usage.totalBytes)}</span> von{" "}
            {formatFileSize(usage.includedBytes)} enthaltenem Speicher belegt
          </p>
          <p className="text-sm text-neutral-600">
            {usage.totalFiles.toLocaleString("de-DE")} Dateien · {percent(usage.totalBytes, usage.includedBytes)}
          </p>
        </div>
        <div className="h-3 w-full overflow-hidden rounded bg-neutral-200">
          <div
            className={`h-full ${over ? "bg-red-500" : usedShare > 80 ? "bg-vtg-orange" : "bg-vtg-yellow"}`}
            style={{ width: `${usedShare}%` }}
          />
        </div>
        {over && (
          <p className="mt-2 text-sm text-red-600">
            Der enthaltene Speicher ist überschritten, für den Mehrverbrauch fallen Kosten an.
          </p>
        )}
        <p className="mt-2 text-xs text-neutral-500">
          Stand {new Date(usage.measuredAt).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })} Uhr
          (wird höchstens alle 5 Minuten neu ermittelt)
        </p>
      </div>

      <h3 className="mb-2 text-sm font-bold text-neutral-900">Nach Bereich</h3>
      <div className="mb-6">
        <SimpleTable
          columns={["Bereich", "Dateien", "Größe", "Anteil"]}
          rows={usage.areas.map((a) => [
            a.label,
            a.files.toLocaleString("de-DE"),
            formatFileSize(a.bytes),
            percent(a.bytes, usage.totalBytes),
          ])}
        />
      </div>

      <h3 className="mb-2 text-sm font-bold text-neutral-900">Die größten Dateien</h3>
      <SimpleTable
        columns={["Datei", "Größe", "Hochgeladen"]}
        rows={usage.largest.map((f) => [
          f.pathname,
          formatFileSize(f.bytes),
          new Date(f.uploadedAt).toLocaleDateString("de-DE"),
        ])}
      />
    </div>
  );
}
