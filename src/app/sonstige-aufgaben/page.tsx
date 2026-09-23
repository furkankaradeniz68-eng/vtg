import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Sonstige Aufgaben | VTG Rheinland-Pfalz" };

export default async function SonstigeAufgabenPage() {
  const content = await getSiteContent("sonstige-aufgaben");
  const [aufgaben, nachAnordnung] = parseContentBlocks(content.body);

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
            {aufgaben?.type === "ul" && (
              <ul className="list-disc space-y-2 pl-5">
                {aufgaben.lines.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            )}
            {nachAnordnung?.type === "ul" && (
              <div>
                <p>Nach Anordnung bzw. Zustimmung der Flurbereinigungsbehörde:</p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {nachAnordnung.lines.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <Image
              src={content.image ?? "/images/ueberblick/Fortbildung.jpg"}
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
