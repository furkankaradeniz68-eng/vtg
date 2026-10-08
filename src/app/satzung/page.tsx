import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";

export const metadata: Metadata = { title: "Satzung | VTG Rheinland-Pfalz" };

const SATZUNG_PDF = "/downloads/VTG_Satzung.pdf";

export default function SatzungPage() {
  return (
    <>
      <PageHero title="Satzung" subtitle="Hauptsatzung des Verbands der Teilnehmergemeinschaften Rheinland-Pfalz." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="mb-8">
          <DownloadList
            items={[
              {
                title: "VTG Satzung",
                description: "Die aktuelle Satzung als PDF-Download.",
                href: SATZUNG_PDF,
              },
            ]}
          />
        </div>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <iframe
            src={`${SATZUNG_PDF}#view=FitH&navpanes=0`}
            title="Vorschau VTG Satzung (PDF)"
            className="h-[75vh] min-h-[480px] w-full"
          />
        </div>
        <p className="mt-3 text-sm text-neutral-600">
          Wird die Vorschau nicht angezeigt, laden Sie die Satzung bitte über den Download‑Button herunter.
        </p>
      </section>
    </>
  );
}
