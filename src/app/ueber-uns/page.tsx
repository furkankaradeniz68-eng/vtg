import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Über uns | VTG Rheinland-Pfalz" };

const aufgaben = [
  "Bauoberleitung (Beratung, Planung, Ausschreibung, Abrechnung und Dokumentation)",
  "Bauausführung zur Herstellung und Unterhaltung der gemeinschaftlichen Anlagen",
  "Vorhalten von Bauhöfen für Eigenregiearbeiten im Tiefbaubereich",
  "Leistung und Vorfinanzierung aller Zahlungen über ein zentrales Verbundkonto",
  "Forderung der Hebungsbeiträge und Ausgleichszahlungen bei den Grundstückseigentümern",
  "Anforderung von Zuschüssen bei den Zuwendungsgebern einschließlich Dokumentation und Verwendungsnachweis",
  "Mitgliedbezogene zentrale Buchhaltung mit Verwendungsnachweis",
  "Information und Weiterbildungsangebote",
  "Dialog mit Politik und Verbänden",
];

export default function UeberUnsPage() {
  return (
    <>
      <PageHero title="Über uns" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Der Verband der Teilnehmergemeinschaften (VTG) ist ein Zusammenschluss
          der Teilnehmergemeinschaften von Bodenordnungsverfahren (Mitglieder)
          im Lande Rheinland-Pfalz. Rechtsgrundlage sind die §§ 26a–f des
          Flurbereinigungsgesetzes (FlurbG). Der VTG hat danach wie seine
          Mitglieder die Rechtsform der Körperschaft des öffentlichen Rechts.
          Er verwaltet sich im Rahmen der Gesetze und seiner Satzung selbst.
        </p>
        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          Der VTG dient der gemeinsamen Durchführung von Aufgaben, die seinen
          Mitgliedern nach § 18 Flurbereinigungsgesetz obliegen. Er nimmt
          danach in den Flurbereinigungsverfahren des Landes Rheinland-Pfalz
          vor allem folgende Aufgaben für seine Mitglieder wahr:
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-700">
          {aufgaben.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          Sitz und Geschäftsstelle des VTG ist in 67433 Neustadt/Weinstraße,
          Roßlaufstraße 17. Bei den Dienstleistungszentren Ländlicher Raum
          (DLR) in Bernkastel-Kues, Kaiserslautern, Mayen, Neustadt, Simmern
          und Montabaur sind Außenstellen des VTG eingerichtet. Die DLR in
          Bitburg und Trier werden von der Außenstelle Prüm und das DLR in Bad
          Kreuznach von der Außenstelle in Simmern aus mitbetreut.
        </p>
      </section>
    </>
  );
}
