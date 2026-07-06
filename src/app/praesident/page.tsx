import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";

export const metadata: Metadata = { title: "Präsident | VTG Rheinland-Pfalz" };

export default function PraesidentPage() {
  return (
    <>
      <PageHero title="Präsident" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Der ehrenamtliche Präsident und dessen Stellvertreter werden vom
            Vorstand aus seiner Mitte auf 5 Jahre gewählt. Wiederwahl ist
            möglich. Der Präsident
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>vertritt den VTG gerichtlich und außergerichtlich</li>
            <li>leitet die Mitgliederversammlungen und die Vorstandssitzungen</li>
          </ul>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <PersonCard
            person={{
              name: "Michael Haack",
              role: "Präsident",
              address: "Zweibrückerstr. 70, 66894 Martinshöhe",
              phone: "(06372) 61238",
              image: "/images/personen/vorstand/VS_MichaelHaack.JPG",
            }}
          />
          <PersonCard
            person={{
              name: "Werner Görgen",
              role: "stellvertretender Präsident",
              address: "Weinbergstr. 1a, 54517 Platten",
              phone: "(06535) 807",
              image: "/images/personen/vorstand/VS_WernerGörgen.JPG",
            }}
          />
        </div>
      </section>
    </>
  );
}
