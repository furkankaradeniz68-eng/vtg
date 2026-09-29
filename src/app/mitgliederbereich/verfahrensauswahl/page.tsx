import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import VerfahrenSearchTable from "@/components/VerfahrenSearchTable";
import { requireInternSession } from "@/lib/auth";
import { getAllVerfahren, getVerfahrenByKreis } from "@/lib/bc-companies";
import { getAllDownloads, type DownloadEntry } from "@/lib/downloads";

export const metadata: Metadata = { title: "Verfahrensauswahl | VTG Rheinland-Pfalz" };

// Reine Downloadliste, gruppiert nach Mandant. Bewusst ohne Bestaetigungs-/
// Zaehl-Status hier — diese Infos sind nur im Admin-Bereich relevant (siehe
// /admin?tab=mitglieder), hier zaehlt nur der eigentliche Abruf der Datei.
function DownloadListe({
  nrToName,
  entries,
}: {
  nrToName: Map<string, string>;
  entries: Map<string, DownloadEntry[]>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {[...entries.entries()].map(([nr, downloads]) => (
        <div key={nr} className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-neutral-900">
            {nr} {nrToName.get(nr)}
          </p>
          <ul className="flex flex-col gap-2">
            {downloads.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-neutral-700"
              >
                <span>{entry.filename}</span>
                <a
                  href={`/api/downloads/${entry.id}`}
                  className="inline-block bg-vtg-yellow px-3 py-1 text-xs font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
                >
                  Herunterladen
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function VerfahrensauswahlPage() {
  const session = await requireInternSession();
  const isAdmin = session.role === "admin";
  const list = isAdmin ? await getAllVerfahren() : ((await getVerfahrenByKreis())[session.username] ?? []);

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

  // Admin sieht alle Kreise auf einmal — damit die Liste nicht unuebersichtlich
  // lang wird, hier zusaetzlich nach DLR-Dienstsitz gruppieren und als
  // aufklappbare Abschnitte darstellen. Ein Mandant kann (ueber
  // DLR_ZIFFER_ZU_DIENSTSITZ) mehreren Dienstsitzen zugeordnet sein, dann
  // erscheint er dort auch mehrfach — analog zur bestehenden Kreis-Logik.
  let downloadsByDienstsitz: [string, Map<string, DownloadEntry[]>][] = [];
  if (isAdmin && downloadsByMandant.size > 0) {
    const byKreis = await getVerfahrenByKreis();
    const gruppiert = new Map<string, Map<string, DownloadEntry[]>>();
    for (const [dienstsitz, verfahrenListe] of Object.entries(byKreis)) {
      for (const v of verfahrenListe) {
        const eintraege = downloadsByMandant.get(v.nr);
        if (!eintraege) continue;
        const mandantenGruppe = gruppiert.get(dienstsitz) ?? new Map<string, DownloadEntry[]>();
        mandantenGruppe.set(v.nr, eintraege);
        gruppiert.set(dienstsitz, mandantenGruppe);
      }
    }
    downloadsByDienstsitz = [...gruppiert.entries()].sort(([a], [b]) => a.localeCompare(b, "de"));
  }

  return (
    <>
      <PageHero title="Verfahrensauswahl" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {isAdmin
          ? downloadsByDienstsitz.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Mitglieder-Downloads</h2>
                <div className="flex flex-col gap-3">
                  {downloadsByDienstsitz.map(([dienstsitz, mandanten]) => (
                    <details key={dienstsitz} className="group rounded-lg border border-neutral-200 bg-white">
                      <summary className="cursor-pointer list-none px-4 py-3 font-medium text-neutral-900 marker:hidden [&::-webkit-details-marker]:hidden">
                        <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
                        {dienstsitz}
                      </summary>
                      <div className="border-t border-neutral-200 p-4">
                        <DownloadListe nrToName={nrToName} entries={mandanten} />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
          : downloadsByMandant.size > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Mitglieder-Downloads</h2>
                <DownloadListe nrToName={nrToName} entries={downloadsByMandant} />
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
