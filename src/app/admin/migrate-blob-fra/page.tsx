"use client";

// TEMPORÄR: Auslöse-Seite für die einmalige Blob-Storage-Migration
// US -> Frankfurt (fra1). Nach erfolgreicher Migration und Umstellung von
// BLOB_READ_WRITE_TOKEN auf den Frankfurt-Store: diese Seite (und die Route
// unter /api/admin/migrate-blob-fra) wieder entfernen.
import { useState } from "react";

type MigrationResult = {
  migratedCount: number;
  migrated: string[];
  failedCount: number;
  failed: { pathname: string; error: string }[];
};

type MigrationError = { error: string };

export default function MigrateBlobFraPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | MigrationError | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/migrate-blob-fra", { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-4 font-heading text-lg font-bold text-neutral-900">
        Blob-Storage-Migration: US → Frankfurt (fra1)
      </h1>
      <p className="mb-2 text-sm text-neutral-700">
        Kopiert jede Datei aus dem alten Store (<code>BLOB_READ_WRITE_TOKEN</code>) 1:1 in den neuen
        Frankfurt-Store (<code>BLOB_FRA_READ_WRITE_TOKEN</code>) — gleicher Pfad, gleicher Inhalt.
      </p>
      <p className="mb-6 text-sm text-neutral-700">
        Löscht nichts im alten Store und kann gefahrlos mehrfach ausgeführt werden (überschreibt im
        Zielstore lediglich gleichnamige Dateien mit dem aktuellen Stand).
      </p>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white disabled:opacity-50"
      >
        {loading ? "Migriere…" : "Migration starten"}
      </button>

      {result && (
        <pre className="mt-6 max-h-[32rem] overflow-auto rounded-lg border border-neutral-200 bg-white p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
