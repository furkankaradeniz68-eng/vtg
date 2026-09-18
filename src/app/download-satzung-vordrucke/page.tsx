import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";
import { getPublicDownloadsByCategory } from "@/lib/public-downloads";

export const metadata: Metadata = {
  title: "Satzung und Vordrucke | VTG Rheinland-Pfalz",
};

export default async function SatzungVordruckePage() {
  const entries = await getPublicDownloadsByCategory("satzung-vordrucke");

  return (
    <>
      <PageHero title="Satzung und Vordrucke" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <DownloadList
          items={entries.map((e) => ({ title: e.title, description: e.description, href: e.url }))}
        />
      </section>
    </>
  );
}
