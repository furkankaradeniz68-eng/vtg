import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import VerfahrenSearchTable from "@/components/VerfahrenSearchTable";
import { requireInternSession } from "@/lib/auth";
import { getAllVerfahren, getVerfahrenByKreis } from "@/lib/bc-companies";
import { getAllDownloads, type DownloadEntry } from "@/lib/downloads";

export const metadata: Metadata = { title: "Verfahrensauswahl | VTG Rheinland-Pfalz" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

export default async function VerfahrensauswahlPage() {
  const session = await requireInternSession();
  const list =
    session.role === "admin"
      ? await getAllVerfahren()
      : ((await getVerfahrenByKreis())[session.username] ?? []);

  // Downloads-Uebersicht: nur fuer DLR/Admin sichtbar (diese Seite ist ueber
  // requireInternSession ohnehin fuer Mandanten gesperrt), gescoped auf genau
  // die Verfahren, die in `list` stehen — also DLR1 sieht nur die eigenen
  // Mandanten, Admin sieht alle. Pro Mandant gruppiert ("untergeordnet"),
  // nicht als flache Liste.
  const nrToName = new Map(list.map((v) => [v.nr, v.name]));
  const downloadsByMandant = new Map<string, DownloadEntry[]>();
  if (list.length > 0) {
    const alleDownloads = await getAllDownloads();
    for (const d of alleDownloads) {
      if (!nrToName.has(d.username)) continue;
      const gruppe = downloadsByMandant.get(d.username);
      if (gruppe) gruppe.push(d);
      else downloadsByMandant.set(d.username, [d]);
    }
  }

  return (
    <>
      <PageHero title="Verfahrensauswahl" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {downloadsByMandant.size > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Mitglieder-Downloads</h2>
            <div className="flex flex-col gap-3">
              {[...downloadsByMandant.entries()].map(([nr, entries]) => (
                <div key={nr} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <p className="mb-2 text-sm font-medium text-neutral-900">
                    {nr} {nrToName.get(nr)}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {entries.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-sm text-neutral-700"
                      >
                        <span>{entry.filename}</span>
                        <span className="text-xs text-neutral-500">
                          {entry.lastDownloadedAt
                            ? `Bestätigt am ${formatDate(entry.lastDownloadedAt)} · ${entry.downloadCount}×`
                            : "Noch nicht heruntergeladen"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {list.length > 0 ? (
          <VerfahrenSearchTable list={list} />
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">
            Dieser Bereich wird mit den persönlichen Daten Ihres Verfahrens
            verknüpft, sobald der Mitgliederlogin freigeschaltet ist.
          </p>
        )}
      </section>
    </>
  );
}
