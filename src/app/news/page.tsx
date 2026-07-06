import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "News | VTG Rheinland-Pfalz" };

export default function NewsPage() {
  return (
    <>
      <PageHero title="News" subtitle="Aktuelles rund um den VTG Rheinland-Pfalz." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Aktuell liegen keine News vor. Aktuelle Termine und Dokumente zu
          Fachtagungen finden Sie unter{" "}
          <a href="/fachtagungen" className="text-vtg-orange hover:underline">
            Fachtagungen
          </a>
          .
        </p>
      </section>
    </>
  );
}
