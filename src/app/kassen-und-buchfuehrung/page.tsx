import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Kassen- und Buchführung | VTG Rheinland-Pfalz",
};

export default function KassenUndBuchfuehrungPage() {
  return (
    <>
      <PageHero title="Kassen- und Buchführung" />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-base leading-relaxed text-neutral-700">
            <h3 className="font-heading text-xl font-bold text-neutral-900 sm:text-2xl">
              Im diesem Bereich übernimmt der VTG für seine Mitglieder im
              wesentlichen folgende Arbeiten:
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Sicherstellung der Liquidität durch
                <ul className="mt-2 list-[circle] space-y-2 pl-5">
                  <li>Einrichtung eines Verbundkontos mit Kontokorrent-Unterkonten</li>
                  <li>Beantragung und Abruf der öffentlichen Mittel</li>
                  <li>Hebung der Flurbereinigungsbeiträge bei den Teilnehmern mit Mahnwesen</li>
                  <li>Aufnahme von Darlehen und Weitergabe an Mitglieder</li>
                </ul>
              </li>
              <li>Kaufmännische Buchführung</li>
              <li>Abwicklung des Zahlungsverkehrs</li>
              <li>Finanzierungsüberwachung</li>
              <li>Aufstellung von Verwendungsnachweisen für den Zuwendungsgeber</li>
            </ul>
          </div>
          <div>
            <Image
              src="/images/ueberblick/Verwaltung.jpg"
              alt=""
              width={649}
              height={435}
              className="h-auto w-full max-w-[649px] rounded-lg"
            />
          </div>
        </div>
        <div className="mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Die aktuellen Sollzinssätze bei erforderlicher Vorfinanzierung, weil
            z. B. öffentliche Mittel oder Flurbereinigungsbeiträge fehlen,
            finden Sie im Mitgliederbereich.
          </p>
        </div>
      </section>
    </>
  );
}
