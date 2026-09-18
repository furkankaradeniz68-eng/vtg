import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";
import { getPublicDownloadsByCategory } from "@/lib/public-downloads";

export const metadata: Metadata = { title: "Fachtagungen | VTG Rheinland-Pfalz" };

export default async function FachtagungenPage() {
  const entries = await getPublicDownloadsByCategory("fachtagungen");

  return (
    <>
      <PageHero title="Fachtagungen" subtitle="Dokumentationen vergangener Fachtagungen des VTG." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="mb-8 text-base leading-relaxed text-neutral-700">
          Hier finden Sie alle wichtigen Dokumente zum runter laden.
        </p>
        <DownloadList
          items={entries.map((e) => ({ title: e.title, description: e.description, href: e.url }))}
        />
      </section>
    </>
  );
}
