import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Organe | VTG Rheinland-Pfalz" };

const organe = [
  { title: "Präsident", href: "/praesident" },
  { title: "Vorstand", href: "/vorstand" },
  { title: "Geschäftsführer", href: "/geschaeftsfuehrer" },
];

export default function OrganePage() {
  return (
    <>
      <PageHero title="Organe" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="mb-10 text-base leading-relaxed text-neutral-700">
          Organe des Verbands sind die Mitgliederversammlung, der Vorstand und
          der Präsident (§ 4 der Satzung).
        </p>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {organe.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block h-full rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <h2 className="font-heading text-lg font-bold text-neutral-900">
                  {item.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
