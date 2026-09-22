import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { getPersonenByPage } from "@/lib/personen";

export const metadata: Metadata = { title: "Simmern/Bad Kreuznach | VTG Rheinland-Pfalz" };

export default async function SimmernBadKreuznachPage() {
  const team = await getPersonenByPage("simmern-bad-kreuznach");

  return (
    <>
      <PageHero title="Simmern / Bad Kreuznach" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <p className="mt-2 text-base text-neutral-600">
          <strong>Aussenstelle Simmern</strong>
          <br />
          Schlossplatz 10
          <br />
          55469 Simmern
        </p>
        <h2 className="mt-8 font-heading text-xl font-bold text-neutral-900">Bau, Landespflege</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {team.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>
    </>
  );
}
