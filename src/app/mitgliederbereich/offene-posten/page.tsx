import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { requireInternSession } from "@/lib/auth";
import { formatFileSize } from "@/lib/downloads";
import { getOffenePostenDateien, zifferFuerBenutzer, type OffenePostenDatei } from "@/lib/offene-posten";

export const metadata: Metadata = { title: "Offene Posten | VTG Rheinland-Pfalz" };

function stand(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" });
}

export default async function OffenePostenPage() {
  const session = await requireInternSession();
  const alleSehen = session.role === "admin" || !!session.alleMandanten;
  const eigene = alleSehen ? undefined : zifferFuerBenutzer(session.username);

  let dateien: OffenePostenDatei[] = [];
  let fehler = false;
  try {
    dateien = await getOffenePostenDateien();
  } catch {
    fehler = true;
  }
  const sichtbar = alleSehen ? dateien : dateien.filter((d) => d.ziffer === eigene);

  return (
    <>
      <PageHero title="Offene Posten" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="mb-8 text-base leading-relaxed text-neutral-700">
          Die Liste der Offenen Posten wird täglich aus Business Central erzeugt.
          {alleSehen ? " Sie können die Liste jedes DLR oder alle gemeinsam als ZIP laden." : " Hier steht die Liste Ihres DLR zum Download."}
        </p>
        {fehler ? (
          <p className="text-base text-neutral-700">Die Offenen Posten konnten gerade nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
        ) : !alleSehen && !eigene ? (
          <p className="text-base text-neutral-700">Für Ihr Konto ist kein DLR hinterlegt.</p>
        ) : sichtbar.length === 0 ? (
          <p className="text-base text-neutral-700">Derzeit liegt keine aktuelle Offene-Posten-Liste vor.</p>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
            {sichtbar.map((d) => (
              <li key={d.ziffer} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-neutral-900">{d.bezeichnung}</p>
                  <p className="text-sm text-neutral-600">
                    {d.filename} · Stand {stand(d.snapshotDateTime)}
                    {d.byteSize ? ` · ${formatFileSize(d.byteSize)}` : ""}
                  </p>
                </div>
                <a
                  href={`/api/offene-posten?dlr=${d.ziffer}`}
                  className="bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
