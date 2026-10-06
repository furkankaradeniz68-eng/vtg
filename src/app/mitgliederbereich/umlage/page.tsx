import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import { requireSession } from "@/lib/auth";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";
import { formatUmlageProzent, getUmlageRows } from "@/lib/umlage";

export const metadata: Metadata = { title: "Umlage | VTG Rheinland-Pfalz" };

export default async function UmlagePage() {
  await requireSession();
  const [content, rows] = await Promise.all([getSiteContent("umlage"), getUmlageRows()]);
  const blocks = parseContentBlocks(content.body);
  return (
    <>
      <PageHero title="Umlage" />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="lg:w-72 lg:shrink-0">
            <SimpleTable
              columns={["Jahr", "Prozent"]}
              rows={rows.map((r) => [r.year, formatUmlageProzent(r.percent)])}
              compact
            />
          </div>
          <div>
            <h2 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
              Umlage
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
          </div>
        </div>
      </section>
    </>
  );
}
