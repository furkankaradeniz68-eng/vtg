import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Finanzierung | VTG Rheinland-Pfalz" };

export default async function FinanzierungPage() {
  const content = await getSiteContent("finanzierung");
  const blocks = parseContentBlocks(content.body);

  return (
    <>
      <PageHero title="Finanzierung" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-4 text-base leading-relaxed text-neutral-700">
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
      </section>
    </>
  );
}
