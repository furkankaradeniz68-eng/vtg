import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { getSiteContent, parseContentBlocks } from "@/lib/site-content";

export const metadata: Metadata = { title: "Überblick | VTG Rheinland-Pfalz" };

export default async function UeberblickPage() {
  const content = await getSiteContent("ueberblick");
  const blocks = parseContentBlocks(content.body);

  return (
    <>
      <PageHero title="Überblick" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-neutral-900">
          Willkommen beim VTG Rheinland-Pfalz
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Verwaltung", image: "/images/ueberblick/Verwaltung.jpg" },
            { title: "Fortbildung", image: "/images/ueberblick/Fortbildung.jpg" },
            { title: "Ausbau", image: "/images/ueberblick/Ausbau.jpg" },
          ].map((item) => (
            <div key={item.title} className="relative h-40 w-full overflow-hidden rounded-lg">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4 text-base leading-relaxed text-neutral-700">
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
