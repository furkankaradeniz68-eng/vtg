import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MitgliederTable from "@/components/MitgliederTable";

export const metadata: Metadata = { title: "Mitglieder | VTG Rheinland-Pfalz" };

export default function MitgliederPage() {
  return (
    <>
      <PageHero title="Mitglieder" />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Jede Teilnehmergemeinschaft (TG) eines in Rheinland-Pfalz
            liegenden Flurbereinigungsverfahrens kann auf Antrag Mitglied im
            VTG werden. Die Mitgliedschaft entsteht mit Zustimmung durch die
            Flurbereinigungsbehörde. Die Mitgliedschaft erlischt in der Regel
            mit der Beendigung des Flurbereinigungsverfahrens
            (Schlussfeststellung gem. § 149 FlurbG). Über die interaktive
            Mitgliederkarte erhalten Sie mehr Informationen zu den einzelnen
            Verfahren. Die Umringsgrenzen der Flurbereinigungsverfahren sowie
            die Informationen zu Art und Stand der Flurbereinigungsverfahren
            werden zu bestimmten Stichzeitpunkten der Homepage www.dlr.rlp.de
            entnommen. Für aktuelle Daten besuchen Sie bitte direkt diese
            Internetseite.
          </p>
          <div>
            <h2 className="font-heading text-xl font-bold text-neutral-900">Mitgliederversammlung</h2>
            <p className="mt-3">
              Die Mitgliederversammlung ist das höchste Organ des VTG.
              Teilnehmer sind die dem VTG beigetretenen
              Teilnehmergemeinschaften von Flurbereinigungsverfahren in
              Rheinland-Pfalz. Die Mitglieder werden in der jährlich
              mindestens einmal einzuberufenden Mitgliederversammlung
              vertreten durch ihre Vorsitzenden. Wesentliche Aufgaben der
              Versammlung sind
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>die Wahl des Vorstandes aus ihrer Mitte</li>
              <li>Beschluss über den Jahresabschluss einschließlich Entlastung</li>
              <li>Beschluss über die Aufstellung des Wirtschaftsplanes und die Höhe der Umlage</li>
            </ul>
          </div>
          <p>
            Ein Verzeichnis der aktuellen Mitglieder bzw. deren Vorsitzenden
            ist in nachfolgender Tabelle aufgelistet:
          </p>
        </div>
        <div className="mt-8">
          <MitgliederTable />
        </div>
      </section>
    </>
  );
}
