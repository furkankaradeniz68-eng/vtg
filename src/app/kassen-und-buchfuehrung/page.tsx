import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Kassen- und Buchführung | VTG Rheinland-Pfalz",
};

export default function KassenUndBuchfuehrungPage() {
  return (
    <>
      <PageHero title="Kassen- und Buchführung" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-4 text-base leading-relaxed text-neutral-700">
        <p>
          In diesem Bereich übernimmt der VTG für seine Mitglieder im
          Wesentlichen folgende Arbeiten:
        </p>
        <div>
          <p className="font-heading font-semibold text-neutral-900">
            Sicherstellung der Liquidität durch
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Einrichtung eines Verbundkontos mit Kontokorrent-Unterkonten</li>
            <li>Beantragung und Abruf der öffentlichen Mittel</li>
            <li>Hebung der Flurbereinigungsbeiträge bei den Teilnehmern mit Mahnwesen</li>
            <li>Aufnahme von Darlehen und Weitergabe an Mitglieder</li>
          </ul>
        </div>
        <div>
          <p className="font-heading font-semibold text-neutral-900">Kaufmännische Buchführung</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Abwicklung des Zahlungsverkehrs</li>
            <li>Finanzierungsüberwachung</li>
            <li>Aufstellung von Verwendungsnachweisen für den Zuwendungsgeber</li>
          </ul>
        </div>
        <p>
          Die aktuellen Sollzinssätze bei erforderlicher Vorfinanzierung, weil
          z. B. öffentliche Mittel oder Flurbereinigungsbeiträge fehlen,
          finden Sie im Mitgliederbereich.
        </p>
      </section>
    </>
  );
}
