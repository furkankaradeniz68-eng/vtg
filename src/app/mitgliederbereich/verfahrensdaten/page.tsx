import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import VerfahrenKarte from "@/components/VerfahrenKarte";
import { requireSession } from "@/lib/auth";
import { findVerfahren, istVerfahrenErreichbar } from "@/lib/bc-companies";
import { getKoordinaten } from "@/lib/verfahren-personendaten";
import { getUmringe } from "@/lib/verfahren-umringe";

export const metadata: Metadata = { title: "Verfahrensdaten | VTG Rheinland-Pfalz" };

export default async function VerfahrensdatenPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; quelle?: string }>;
}) {
  const session = await requireSession();
  const { id: rawId, quelle } = await searchParams;
  const id = rawId ?? (session.role === "abonnent" ? session.username : undefined);
  const zugriffErlaubt = id ? await istVerfahrenErreichbar(session, id) : false;
  const verfahren = zugriffErlaubt && id ? await findVerfahren(id) : undefined;
  // Testansicht (nur Admin, ?quelle=bc): Sandbox-Daten mit KML als Ersatz, sonst der freigegebene Stand.
  const testAnsicht = quelle === "bc" && session.role === "admin";
  const umringe = await getUmringe(testAnsicht ? "test" : "oeffentlich");
  const polygon = verfahren ? umringe.polygon(verfahren.nr) : undefined;
  const koordinaten = verfahren && !polygon ? await getKoordinaten(verfahren.nr) : undefined;
  const showBackButton = session.role === "dlr" || session.role === "admin";

  return (
    <>
      <PageHero title="Verfahrensdaten" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {showBackButton && (
          <Link
            href="/mitgliederbereich/verfahrensauswahl"
            className="mb-6 inline-flex items-center gap-1.5 rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-vtg-orange hover:text-vtg-orange"
          >
            ‹ Zurück zur Verfahrensauswahl
          </Link>
        )}
        {verfahren ? (
          <>
            <div className="space-y-3 text-base leading-relaxed text-neutral-700">
              <p>
                <strong className="text-neutral-900">Produktnummer:</strong> {verfahren.nr}
              </p>
              <p>
                <strong className="text-neutral-900">Verfahren:</strong> {verfahren.name}
              </p>
              <p>
                <strong className="text-neutral-900">Aktenzeichen:</strong> {verfahren.aktenzeichen}
              </p>
              <p>
                <strong className="text-neutral-900">Landkreis:</strong> {verfahren.landkreis}
              </p>
              {verfahren.chairperson && (
                <p>
                  <strong className="text-neutral-900">TG-Vorsitzender:</strong>
                  <br />
                  {verfahren.chairperson}
                  <br />
                  {verfahren.address}
                  <br />
                  {verfahren.postCode} {verfahren.city}
                </p>
              )}
            </div>

            <Link
              href={`/mitgliederbereich/finanzuebersicht?id=${verfahren.nr}`}
              className="mt-6 inline-block bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
            >
              Zur Finanzübersicht
            </Link>

            {testAnsicht && (
              <p className="mt-6 rounded border border-vtg-yellow bg-yellow-50 px-4 py-3 text-sm text-neutral-800">
                {umringe.bc
                  ? `Testansicht (nur für Admins): Umringe aus BC, Umgebung ${umringe.bc.umgebung}, Stand ${new Date(umringe.bc.syncedAt).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })} Uhr, mit KML-Stand als Ersatz. Dieses Verfahren: ${
                      umringe.herkunft(verfahren.nr) === "bc"
                        ? "Umring aus BC."
                        : umringe.herkunft(verfahren.nr) === "kml"
                          ? "kein Umring in BC, KML-Umring als Ersatz."
                          : "weder in BC noch im KML ein Umring."
                    }`
                  : "Testansicht (nur für Admins): Es liegt noch kein Abgleich aus BC vor. Bitte zuerst /api/bc-umringe-sync aufrufen."}
              </p>
            )}

            {polygon ? (
              <VerfahrenKarte
                polygon={polygon}
                aktuelleNr={verfahren.nr}
                alleVerfahren={umringe.uebersicht}
              />
            ) : (
              koordinaten && (
                <div className="mt-10 overflow-hidden rounded-lg border border-neutral-200">
                  <iframe
                    title={`Standort ${verfahren.name}`}
                    src={`https://maps.google.com/maps?q=${koordinaten.lat},${koordinaten.lng}&z=15&output=embed`}
                    width="100%"
                    height="400"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )
            )}
          </>
        ) : id && !zugriffErlaubt ? (
          <p className="text-base leading-relaxed text-neutral-700">Kein Zugriff auf diese Daten.</p>
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
