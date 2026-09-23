import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { getPersonenByPage, groupPersonenBySection } from "@/lib/personen";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Vorstand | VTG Rheinland-Pfalz" };

export default async function VorstandPage() {
  const entries = await getPersonenByPage("vorstand");
  const groups = groupPersonenBySection(entries);
  const praesidium = groups.find((g) => g.section === "Präsidium")?.people ?? [];
  const gruppen = groups.filter((g) => g.section !== "Präsidium");
  const content = await getSiteContent("vorstand");
  const blocks = parseContentBlocks(content.body);

  return (
    <>
      <PageHero title="Vorstand" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
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
          {praesidium.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>

        {gruppen.map((g) => (
          <div key={g.section} className="mt-10">
            {g.sectionMeta && (
              <p className="text-sm font-bold uppercase tracking-widest text-vtg-orange">{g.sectionMeta}</p>
            )}
            <h3 className="mt-2 font-heading text-xl font-bold text-neutral-900">{g.section}</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {g.people.map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
