import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getStellenausschreibung } from "@/lib/stellenausschreibung";

export const metadata: Metadata = {
  title: "Stellenausschreibung | VTG Rheinland-Pfalz",
};

export default async function StellenausschreibungPage() {
  const entry = await getStellenausschreibung();

  return (
    <>
      <PageHero title={entry.title} subtitle="Karriere machen beim VTG." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="whitespace-pre-line text-base leading-relaxed text-neutral-700">
          {entry.description}
        </p>
        {entry.pdfFilename && (
          <a
            href="/api/stellenausschreibung"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
          >
            Stellenausschreibung als PDF öffnen
          </a>
        )}
      </section>
    </>
  );
}
