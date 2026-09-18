import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import { requireAdminSession } from "@/lib/auth";
import { listAbonnenten } from "@/lib/credentials";
import { getAllDownloads, isDownloadActive } from "@/lib/downloads";

export const metadata: Metadata = { title: "Downloads verwalten | VTG Rheinland-Pfalz" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

export default async function DownloadsVerwaltenPage() {
  await requireAdminSession();
  const abonnenten = listAbonnenten();
  const downloads = await getAllDownloads();

  return (
    <>
      <PageHero title="Downloads verwalten" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/mitgliederbereich/verfahrensauswahl"
          className="mb-6 inline-flex items-center gap-1.5 rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-vtg-orange hover:text-vtg-orange"
        >
          ‹ Zurück zur Verfahrensauswahl
        </Link>

        <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Neue Datei zuweisen</h2>
        <form
          action="/api/downloads/upload"
          method="POST"
          encType="multipart/form-data"
          className="mb-12 flex flex-col gap-4"
        >
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-neutral-800">
              Benutzer
            </label>
            <select
              id="username"
              name="username"
              required
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
            >
              {abonnenten.map((a) => (
                <option key={a.username} value={a.username}>
                  {a.label} ({a.username})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="file" className="mb-1 block text-sm font-medium text-neutral-800">
              Datei
            </label>
            <input
              id="file"
              name="file"
              type="file"
              required
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
            />
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
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
          >
            Hochladen
          </button>
        </form>

        <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Zugewiesene Downloads</h2>
        {downloads.length > 0 ? (
          <SimpleTable
            columns={["Benutzer", "Datei", "Hochgeladen", "Läuft ab", "Status", ""]}
            rows={downloads.map((d) => [
              d.username,
              d.filename,
              formatDate(d.uploadedAt),
              formatDate(d.expiresAt),
              isDownloadActive(d) ? "Aktiv" : "Abgelaufen",
              <form key={d.id} action="/api/downloads/delete" method="POST">
                <input type="hidden" name="id" value={d.id} />
                <button type="submit" className="text-sm text-red-600 hover:underline">
                  Löschen
                </button>
              </form>,
            ])}
          />
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">Es sind noch keine Downloads zugewiesen.</p>
        )}
      </section>
    </>
  );
}
