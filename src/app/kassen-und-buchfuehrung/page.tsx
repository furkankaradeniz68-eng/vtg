import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Kassen- und Buchführung | VTG Rheinland-Pfalz",
};

export default async function KassenUndBuchfuehrungPage() {
  const content = await getSiteContent("kassen-und-buchfuehrung");
  const blocks = parseContentBlocks(content.body);
  const [first, ...rest] = blocks;

  return (
    <>
      <PageHero title="Kassen- und Buchführung" />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-base leading-relaxed text-neutral-700">
            <h3 className="font-heading text-xl font-bold text-neutral-900 sm:text-2xl">
              Im diesem Bereich übernimmt der VTG für seine Mitglieder im
              wesentlichen folgende Arbeiten:
            </h3>
            {first?.type === "ul" && (
              <ul className="list-disc space-y-2 pl-5">
                {first.lines.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <Image
              src={content.image ?? "/images/ueberblick/Verwaltung.jpg"}
              alt=""
              width={649}
              height={435}
              className="h-auto w-full max-w-[649px] rounded-lg"
            />
          </div>
        </div>
        <div className="mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700">
          {rest.map((block, i) =>
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
