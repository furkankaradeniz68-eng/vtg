import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import { requireSession } from "@/lib/auth";
import { findVerfahren } from "@/lib/verfahren-beispieldaten";

export const metadata: Metadata = { title: "Verfahrensdaten | VTG Rheinland-Pfalz" };

export default async function VerfahrensdatenPage({
  searchParams,
}: {
  searchParams: Promise<{ verfahren?: string }>;
}) {
  const session = await requireSession();
  const { verfahren: nr } = await searchParams;
  const verfahren = nr ? findVerfahren(nr) : undefined;
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
          <SimpleTable
            columns={["Feld", "Wert"]}
            rows={[
              ["Nr.", verfahren.nr],
              ["Verfahren", verfahren.name],
              ["Fläche", verfahren.flaeche],
              ["Stand", verfahren.stand],
            ]}
          />
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
