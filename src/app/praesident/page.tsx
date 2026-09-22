import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { getPersonenByPage } from "@/lib/personen";

export const metadata: Metadata = { title: "Präsident | VTG Rheinland-Pfalz" };

export default async function PraesidentPage() {
  const people = await getPersonenByPage("praesident");

  return (
    <>
      <PageHero title="Präsident" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700">
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
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>
    </>
  );
}
