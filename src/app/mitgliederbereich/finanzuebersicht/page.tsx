import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { requireSession } from "@/lib/auth";
import { findVerfahren } from "@/lib/verfahren-beispieldaten";
import { getPersonendaten } from "@/lib/verfahren-personendaten";

export const metadata: Metadata = { title: "Finanzübersicht | VTG Rheinland-Pfalz" };

const berichte = [
  { titel: "Einnahmen", href: "einnahmen-laufzeit" },
  { titel: "Ausführungskosten/A1", href: "ausfuehrungskosten-a1-laufzeit" },
  { titel: "Sonstige Ausführungskosten/A2", href: "sonstige-ausfuehrungskosten-a2-laufzeit" },
];

export default async function FinanzuebersichtPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireSession();
  const { id } = await searchParams;
  const verfahren = id ? findVerfahren(id) : undefined;
  const personendaten = id ? getPersonendaten(id) : undefined;

  return (
    <>
      <PageHero title="Finanzübersicht" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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
              {personendaten && (
                <p>
                  <strong className="text-neutral-900">TG-Vorsitzender:</strong>
                  <br />
                  {personendaten.vorsitzender.name}
                  <br />
                  {personendaten.vorsitzender.strasse}
                  <br />
                  {personendaten.vorsitzender.plzOrt}
                </p>
              )}
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {berichte.map((bericht) => (
                <li key={bericht.href}>
                  <Link
                    href={`/mitgliederbereich/${bericht.href}?id=${verfahren.nr}`}
                    className="inline-block bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
                  >
                    {bericht.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">
            Dieser Bereich wird mit den persönlichen Finanzdaten Ihres Verfahrens
            verknüpft, sobald der Mitgliederlogin freigeschaltet ist.
          </p>
        )}
      </section>
    </>
  );
}
