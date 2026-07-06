import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadList from "@/components/DownloadList";

export const metadata: Metadata = { title: "Fachtagungen | VTG Rheinland-Pfalz" };

export default function FachtagungenPage() {
  return (
    <>
      <PageHero title="Fachtagungen" subtitle="Dokumentationen vergangener Fachtagungen des VTG." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <DownloadList
          items={[
            {
              title: "Fachtagung 2013 – Dorfflurbereinigung – Chance für die Innenentwicklung der Dörfer",
              href: "/downloads/fachtagungen/Fachtagung_2013_Dorfflurbereinigung_-_Chance_für_die_Innenentwicklung_der_Dörfer.zip",
            },
            {
              title: "Fachtagung 2012 – Bodenordnung und Wasserwirtschaft",
              href: "/downloads/fachtagungen/Fachtagung_2012_Bodenordnung_und_Wasserwirtschaft.zip",
            },
          ]}
        />
        <p className="mt-8 text-sm text-neutral-500">
          Weitere Fachtagungen (2014–2019) sowie aktuelle Mitgliederversammlungen
          folgen in Kürze an dieser Stelle.
        </p>
      </section>
    </>
  );
}
