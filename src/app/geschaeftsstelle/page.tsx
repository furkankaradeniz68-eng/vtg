import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PersonCard, { MailIcon, PhoneIcon } from "@/components/PersonCard";
import { getPersonenByPage, groupPersonenBySection, type PersonEntry } from "@/lib/personen";

export const metadata: Metadata = { title: "Geschäftsstelle | VTG Rheinland-Pfalz" };

// Dieser Bereich ist nicht einfach der Reihe nach gelistet (Kundenwunsch
// 2026-11-24): Geschaeftsbereichsleitung allein oben, darunter die IT, danach
// unter eigener kleiner Ueberschrift die Buchfuehrung. Die Zuordnung ergibt sich
// aus der im Admin gepflegten Funktion, die Reihenfolge aus dem Nachnamen.
const IT_BUCHFUEHRUNG_SECTION = "IT, Buchführung, Zahlungsmanagement";

function nachNachname(a: PersonEntry, b: PersonEntry) {
  const nachname = (p: PersonEntry) => p.name.trim().split(/\s+/).at(-1) ?? "";
  return nachname(a).localeCompare(nachname(b), "de") || a.name.localeCompare(b.name, "de");
}

function teileItBuchfuehrung(people: PersonEntry[]) {
  const leitung: PersonEntry[] = [];
  const it: PersonEntry[] = [];
  const buchfuehrung: PersonEntry[] = [];
  for (const p of people) {
    const funktion = p.role.normalize("NFC").toLowerCase();
    if (funktion.includes("geschäftsbereichsleitung")) leitung.push(p);
    else if (funktion.includes("buchführung")) buchfuehrung.push(p);
    else it.push(p);
  }
  return { leitung, it: it.sort(nachNachname), buchfuehrung: buchfuehrung.sort(nachNachname) };
}

function Karten({ people, className }: { people: PersonEntry[]; className: string }) {
  if (people.length === 0) return null;
  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${className}`}>
      {people.map((p) => (
        <PersonCard key={p.id} person={p} />
      ))}
    </div>
  );
}

function Gruppe({ title, people }: { title?: string; people: PersonEntry[] }) {
  const geteilt = title?.normalize("NFC") === IT_BUCHFUEHRUNG_SECTION ? teileItBuchfuehrung(people) : undefined;
  return (
    <div className="mt-10">
      <h2 className="font-heading text-xl font-bold text-neutral-900">{title}</h2>
      {geteilt ? (
        <>
          <Karten people={geteilt.leitung} className="mt-4" />
          <Karten people={geteilt.it} className="mt-6" />
          {geteilt.buchfuehrung.length > 0 && (
            <>
              <h3 className="mt-8 font-heading text-lg font-bold text-neutral-900">Buchführung</h3>
              <Karten people={geteilt.buchfuehrung} className="mt-4" />
            </>
          )}
        </>
      ) : (
        <Karten people={people} className="mt-4" />
      )}
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
