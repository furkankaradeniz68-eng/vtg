import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { MailIcon, PhoneIcon } from "@/components/PersonCard";
import { getPersonenByPage, groupPersonenBySection, type PersonEntry } from "@/lib/personen";

export const metadata: Metadata = { title: "Geschäftsstelle | VTG Rheinland-Pfalz" };

function Gruppe({ title, people }: { title?: string; people: PersonEntry[] }) {
  return (
    <div className="mt-10">
      <h2 className="font-heading text-xl font-bold text-neutral-900">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {people.map((p) => (
          <PersonCard key={p.id} person={p} />
        ))}
      </div>
    </div>
  );
}

export default async function GeschaeftsstellePage() {
  const entries = await getPersonenByPage("geschaeftsstelle");
  const groups = groupPersonenBySection(entries);

  return (
    <>
      <PageHero title="Geschäftsstelle" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <div className="mt-6 text-base text-neutral-700">
          <p className="font-heading font-bold text-neutral-900">Geschäftsstelle</p>
          <p className="mt-1 text-neutral-600">Roßlaufstraße 17</p>
          <p className="text-neutral-600">67433 Neustadt</p>
          <p className="mt-4 flex items-center gap-1.5">
            <PhoneIcon /> (06321) 4911-0
          </p>
          <p className="mt-1 flex items-center gap-1.5">
            <MailIcon />
            <a href="mailto:info@vtg-rlp.de" className="text-vtg-orange hover:underline">
              info@vtg-rlp.de
            </a>
          </p>
        </div>
        {groups.map((g) => (
          <Gruppe key={g.section} title={g.section} people={g.people} />
        ))}
      </section>
    </>
  );
}
