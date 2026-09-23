import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";
import { getSatzungParagraphen } from "@/lib/satzung-inhalt";

export const metadata: Metadata = { title: "Satzung | VTG Rheinland-Pfalz" };

export default async function SatzungPage() {
  const paragraphen = await getSatzungParagraphen();

  return (
    <>
      <PageHero title="Satzung" subtitle="Hauptsatzung des Verbands der Teilnehmergemeinschaften Rheinland-Pfalz." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8">
          <DownloadList
            items={[
              {
                title: "VTG Satzung",
                description: "Die aktuelle Satzung als PDF-Download.",
                href: "/downloads/VTG_Satzung.pdf",
              },
            ]}
          />
        </div>
        <div className="space-y-10">
          {paragraphen.map((p) => (
            <div key={p.title}>
              <h2 className="font-heading text-xl font-bold text-neutral-900">{p.title}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed whitespace-pre-line text-neutral-700">
                {p.body.split(/\n{2,}/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
