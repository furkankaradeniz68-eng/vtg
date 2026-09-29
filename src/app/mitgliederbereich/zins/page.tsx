import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { requireSession } from "@/lib/auth";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Zins | VTG Rheinland-Pfalz" };

export default async function ZinsPage() {
  await requireSession();
  const content = await getSiteContent("zins");
  const blocks = parseContentBlocks(content.body);
  return (
    <>
      <PageHero title="Zins" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
          Zins
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-neutral-700">
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
      </section>
    </>
  );
}
