import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";

export const metadata: Metadata = { title: "Sonstiges | VTG Rheinland-Pfalz" };

export default function SonstigesPage() {
  return (
    <>
      <PageHero title="Sonstiges" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <DownloadList
          items={[
            {
              title: "Kontenplan TG",
              description: "Kontenplan für die Buchführung der Teilnehmergemeinschaften.",
              href: "/downloads/Kontenplan_TG.pdf",
            },
            {
              title: "Zuwendungsübersicht",
              description: "Übersicht der Zuwendungen und Fördermittel.",
              href: "/downloads/Zuwendungsübersicht.xlsx",
            },
            {
              title: "Übernahme Buchführung",
              description: "Informationen zur Übernahme der Buchführung durch den VTG.",
              href: "/downloads/Uebernahme_Buchfuehrung.doc",
            },
            {
              title: "Flurbereinigung schafft Zukunft",
              description: "Flyer zur Flurbereinigung.",
              href: "/downloads/BTG Flyer - Flurbereinigung schafft Zukunft.pdf",
            },
            {
              title: "Wege in die Zukunft – Sonderheft der DLKG",
              href: "/downloads/Wege_in_die_Zukunft_Sonderheft_der_DLKG.pdf",
            },
          ]}
        />
      </section>
    </>
  );
}
