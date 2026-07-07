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
              title: "Fachtagung 2019 – Einsatz von Digitaltechnik zur Entwicklung des ländlichen Raumes",
              href: "/downloads/fachtagungen/Fachtagung_2019_Einsatz_von_Digitaltechnik_zur_Entwicklung_des_ländlichen_Raumes.zip",
            },
            {
              title: "Fachtagung 2018 – Landentwicklung zur Reduzierung des Flächenverbrauchs",
              href: "/downloads/fachtagungen/Fachtagung_2018_Landentwicklung_zur_Reduzierung_des_Flaechenverbrauchs.zip",
            },
            {
              title: "Fachtagung 2017 – Landentwicklung und Infrastruktur",
              href: "/downloads/fachtagungen/Fachtagung_2017_Landentwicklung_und_Infrastruktur.zip",
            },
            {
              title: "Fachtagung 2016 – Visionen der Landentwicklung in Deutschland",
              href: "/downloads/fachtagungen/Fachtagung_2016_Visionen_der_Landentwicklung_in_Deutschland.zip",
            },
            {
              title: "Fachtagung 2015 – Weinbergsflurbereinigung",
              href: "/downloads/fachtagungen/Fachtagung_2015_Weinbergsflurbereinigung.zip",
            },
            {
              title: "Fachtagung 2014 – Zusammenwirken regionaler Energieentwicklung und Landentwicklung",
              href: "/downloads/fachtagungen/Fachtagung_2014_Zusammenwirken_regionaler_Energieentwicklung_und_Landentwicklung.zip",
            },
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
      </section>
    </>
  );
}
