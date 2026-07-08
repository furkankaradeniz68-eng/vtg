import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { requireSession } from "@/lib/auth";
import { findVerfahren } from "@/lib/verfahren-beispieldaten";

export const metadata: Metadata = { title: "Finanzübersicht | VTG Rheinland-Pfalz" };

export default async function FinanzuebersichtPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireSession();
  const { id } = await searchParams;
  const verfahren = id ? findVerfahren(id) : undefined;

  return (
    <>
      <PageHero title="Finanzübersicht" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          {verfahren
            ? `Die Finanzübersicht für ${verfahren.name} (Produkt-Nr. ${verfahren.nr}) wird mit den persönlichen Finanzdaten verknüpft, sobald der Mitgliederlogin freigeschaltet ist.`
            : "Dieser Bereich wird mit den persönlichen Finanzdaten Ihres Verfahrens verknüpft, sobald der Mitgliederlogin freigeschaltet ist."}
        </p>
      </section>
    </>
  );
}
