import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Satzung | VTG Rheinland-Pfalz" };

// Paragraphen-Ueberschriften ("§ N Titel") stehen als eigene Absaetze im
// Freitext und werden hier per Regex erkannt, um sie als <h2> statt als
// normalen Absatz darzustellen -- so bleibt der Text ein einziges, im Admin
// frei bearbeitbares Dokument (siehe site-content.ts), ohne dass
// parseContentBlocks() selbst um ein Heading-Konzept erweitert werden muss.
const HEADING_PATTERN = /^§\s*\d+/;

export default async function SatzungPage() {
  const content = await getSiteContent("satzung");
  const blocks = parseContentBlocks(content.body);

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
        <div className="space-y-3">
          {blocks.map((block, i) => {
            if (block.type === "ul") {
              return (
                <ul key={i} className="list-disc space-y-1 pl-5 text-base leading-relaxed text-neutral-700">
                  {block.lines.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              );
            }
            const text = block.lines[0];
            if (HEADING_PATTERN.test(text)) {
              return (
                <h2 key={i} className="pt-6 font-heading text-xl font-bold text-neutral-900 first:pt-0">
                  {text}
                </h2>
              );
            }
            return (
              <p key={i} className="text-base leading-relaxed whitespace-pre-line text-neutral-700">
                {text}
              </p>
            );
          })}
        </div>
      </section>
    </>
  );
}
