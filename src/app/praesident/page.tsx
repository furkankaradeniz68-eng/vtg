import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { getPersonenByPage } from "@/lib/personen";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Präsident | VTG Rheinland-Pfalz" };

export default async function PraesidentPage() {
  const people = await getPersonenByPage("praesident");
  const content = await getSiteContent("praesident");
  const blocks = parseContentBlocks(content.body);

  return (
    <>
      <PageHero title="Präsident" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700">
          {blocks.map((block, i) =>
            block.type === "ul" ? (
              <ul key={i} className="list-disc space-y-2 pl-5">
                {block.lines.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className="whitespace-pre-line">
                {block.lines[0]}
              </p>
            ),
          )}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>
    </>
  );
}
