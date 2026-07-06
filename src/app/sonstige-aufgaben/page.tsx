import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Sonstige Aufgaben | VTG Rheinland-Pfalz" };

const aufgaben = [
  "Fortbildung der Mitglieder",
  "Beratung und Betreuung der Mitglieder (keine Rechtsberatung)",
  "Abschluss einer Haftpflichtversicherung bei Mitgliedschaft",
  "Förderung des Informationsaustauschs der Mitglieder",
  "Vertretung der Interessen der Mitglieder im politischen Raum",
  "Stellung und Abrechnung von Aushilfskräften",
  "Sicherstellung einfacher, einheitlicher und transparenter Verwaltungsabläufe",
  "Vertretung in Ausschüssen",
];

const nachAnordnung = [
  "Übernahme von Vorarbeiten, insbesondere agrarstrukturelle Vorplanungen",
  "Durchführung von Folgemaßnahmen beim freiwilligen Landtausch",
];

export default function SonstigeAufgabenPage() {
  return (
    <>
      <PageHero title="Sonstige Aufgaben" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-6 text-base leading-relaxed text-neutral-700">
        <p>
          Neben den Hauptaufgaben im Bereich des Kassenwesens / Buchführung
          und der Bauabwicklung nimmt der Verband folgende Aufgaben wahr:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          {aufgaben.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div>
          <p className="font-heading font-semibold text-neutral-900">
            Nach Anordnung bzw. Zustimmung der Flurbereinigungsbehörde:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {nachAnordnung.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
