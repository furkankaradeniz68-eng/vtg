import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";

export const metadata: Metadata = { title: "VOB/VOL | VTG Rheinland-Pfalz" };

export default function VobVolPage() {
  return (
    <>
      <PageHero title="VOB/VOL" subtitle="Informationen zu Vergabeverfahren." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Der VTG vergibt Bau- und Dienstleistungen im Rahmen der
          Bauabwicklung für seine Mitglieder nach den Vorgaben der
          Vergabe- und Vertragsordnung für Bauleistungen (VOB) sowie der
          Vergabe- und Vertragsordnung für Leistungen (VOL).
        </p>
        <div className="mt-8">
          <DownloadList
            items={[
              {
                title: "Informationen VOB/VOL",
                description: "Zusammenfassung der Vergabegrundsätze.",
                href: "/downloads/Informationen_VOB_VOL.pdf",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
