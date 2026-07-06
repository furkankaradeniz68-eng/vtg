import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Finanzierung | VTG Rheinland-Pfalz" };

export default function FinanzierungPage() {
  return (
    <>
      <PageHero title="Finanzierung" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-4 text-base leading-relaxed text-neutral-700">
        <p>Die Finanzierung des VTG erfolgt satzungsgemäß über</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>die jährliche Umlage (§ 16 Abs. 1) und</li>
          <li>die Beiträge aus dem Eigenregiebetrieb (§ 16 Abs. 2 und 3)</li>
        </ul>
        <p>
          Mit der Umlage werden diejenigen Kosten finanziert, die für die
          Durchführung der Kassengeschäfte und des Bauwesens erforderlich sind
          und nicht über Beitragseinnahmen (Stundensätze) des
          Eigenregiebetriebes abgedeckt sind. Die Höhe der Umlage wird
          jährlich von der Mitgliederversammlung festgelegt.
        </p>
        <p>
          Die Leistungen der Arbeiter und Maschinen aus dem Eigenregiebetrieb
          werden über Beiträge abgerechnet, und zwar nach tatsächlicher
          Inanspruchnahme. Es handelt sich dabei in der Regel um Stunden- oder
          Tagessätze, die vom Vorstand zu Jahresbeginn festgelegt werden. Bei
          den Stundensätzen für das Personal sind Reisekosten, Rüstzeiten und
          Aufwendungen für Dienstfahrzeuge in den Preisen enthalten. Es werden
          also nur die tatsächlichen Einsatzstunden berechnet.
        </p>
        <p>Auf Umlage und Beiträge kann der Verband satzungsgemäß Vorschüsse erheben.</p>
      </section>
    </>
  );
}
