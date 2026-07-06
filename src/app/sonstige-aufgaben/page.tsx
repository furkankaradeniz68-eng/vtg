import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Sonstige Aufgaben | VTG Rheinland-Pfalz" };

const aufgaben = [
  "Fortbildung der Mitglieder",
  "Beratung und Betreuung der Mitglieder (keine Rechtsberatung)",
  "Abschluss einer Haftpflichtversicherung bei Mitgliedschaft",
  "Förderung des Informationsaustauschs der Mitglieder",
  "Vertretung der Interessen der Mitglieder im politischen Raum",
  "Stellung und Abrechnung von Aushilfskräften",
  "Sicherstellung einfacher, einheitlicher und transparenter",
  "Verwaltungsabläufe",
  "Vertretung in Ausschüssen",
];

const nachAnordnung = [
  "Übernahme von Vorarbeiten, insbesondere agrarstrukturelle Vorplanungen",
  "Durchführung von Folgemassnahmen beim freiwilligen Landtausch",
];

export default function SonstigeAufgabenPage() {
  return (
    <>
      <PageHero title="Sonstige Aufgaben" />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 text-base leading-relaxed text-neutral-700">
            <h3 className="font-heading text-xl font-bold text-neutral-900 sm:text-2xl">
              Neben den Hauptaufgaben im Bereich des Kassenwesen / Buchführung
              und der Bauabwicklung nimmt der Verband folgende Aufgaben wahr:
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              {aufgaben.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div>
              <p>Nach Anordnung bzw. Zustimmung der Flurbereinigungsbehörde:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {nachAnordnung.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <Image
              src="/images/ueberblick/Fortbildung.jpg"
              alt=""
              width={450}
              height={300}
              className="h-auto w-full max-w-[450px] rounded-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
}
