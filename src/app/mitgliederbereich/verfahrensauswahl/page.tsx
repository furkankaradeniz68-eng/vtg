import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { requireInternSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Verfahrensauswahl | VTG Rheinland-Pfalz" };

export default async function VerfahrensauswahlPage() {
  await requireInternSession();
  return (
    <>
      <PageHero title="Verfahrensauswahl" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/mitgliederbereich/verfahrensdaten"
          className="mb-6 inline-flex items-center gap-1.5 rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-vtg-orange hover:text-vtg-orange"
        >
          ‹ Zurück zu Verfahrensdaten
        </Link>
        <p className="text-base leading-relaxed text-neutral-700">
          Dieser Bereich wird mit den persönlichen Daten Ihres Verfahrens
          verknüpft, sobald der Mitgliederlogin freigeschaltet ist.
        </p>
      </section>
    </>
  );
}
