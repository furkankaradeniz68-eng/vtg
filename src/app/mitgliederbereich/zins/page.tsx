import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Zins | VTG Rheinland-Pfalz" };

export default async function ZinsPage() {
  await requireSession();
  return (
    <>
      <PageHero title="Zins" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-4 text-base leading-relaxed text-neutral-700">
        <p>
          Die Gelder aus Zuwendungen und Eigenleistungen aller Mitglieder
          werden über ein Verbundkonto bewirtschaftet. Dadurch ist
          sichergestellt, dass die Mitglieder des VTG jederzeit liquide sind
          und Sollzinszahlungen für Vorfinanzierungen minimiert werden.
        </p>
        <p>
          Die in der Buchführung des VTG für jedes Mitglied eingerichtete
          Unterkonto dieses Verbundkontos gewährleistet eine
          mitgliederscharfe Abrechnung aller Ausgaben und Einnahmen.
        </p>
        <p>
          Dieses Unterkonto ist als Kontokorrentkonto eingerichtet. Guthaben
          und Überziehungen dieser TG-Unterkonten wurden bis 2019 verzinst.
        </p>
        <p>
          Seit dem Jahr 2020 gibt es weder Guthaben- noch Sollzinsen. Etwaig
          erforderliche Vorfinanzierungen von Zuwendungen oder
          Eigenleistungen erfolgen somit zinslos.
        </p>
      </section>
    </>
  );
}
