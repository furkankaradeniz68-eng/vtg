import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";

export const metadata: Metadata = {
  title: "Satzung und Vordrucke | VTG Rheinland-Pfalz",
};

export default function SatzungVordruckePage() {
  return (
    <>
      <PageHero title="Satzung und Vordrucke" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <DownloadList
          items={[
            {
              title: "VTG Satzung",
              description: "Die aktuelle Satzung des Verbands der Teilnehmergemeinschaften Rheinland-Pfalz.",
              href: "/downloads/VTG_Satzung.pdf",
            },
            {
              title: "VTG Broschüre mit Satzung",
              description: "Informationsbroschüre des VTG inklusive Satzungstext.",
              href: "/downloads/VTG_Broschuere_mit_Satzung.pdf",
            },
            {
              title: "Beitrittserklärung",
              description: "Vordruck zur Beitrittserklärung für Teilnehmergemeinschaften.",
              href: "/downloads/Beitrittserklaerung_2018_01.pdf",
            },
            {
              title: "Flyer Beitragssätze",
              description: "Übersicht der aktuellen Beitragssätze.",
              href: "/downloads/Flyer_Beitragssätze_Aktuell.pdf",
            },
          ]}
        />
      </section>
    </>
  );
}
