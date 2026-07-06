import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Aufgaben | VTG Rheinland-Pfalz" };

const aufgaben = [
  {
    title: "Bauabwicklung",
    description: "Planung, Vergabe und Überwachung der gemeinschaftlichen Baumaßnahmen.",
    href: "/bauabwicklung",
  },
  {
    title: "Kassen- und Buchführung",
    description: "Zentrale Kassenführung und Buchhaltung für die Teilnehmergemeinschaften.",
    href: "/kassen-und-buchfuehrung",
  },
  {
    title: "Sonstige Aufgaben",
    description: "Fortbildung, Beratung und weitere Dienstleistungen für die Mitglieder.",
    href: "/sonstige-aufgaben",
  },
];

export default function AufgabenPage() {
  return (
    <>
      <PageHero title="Aufgaben" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {aufgaben.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block h-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h2 className="font-heading text-lg font-bold text-neutral-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
