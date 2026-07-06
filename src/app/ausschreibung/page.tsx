import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Ausschreibung | VTG Rheinland-Pfalz" };

const items = [
  {
    title: "VOB/VOL",
    description: "Informationen zu Vergabeverfahren nach VOB und VOL.",
    href: "/vob-vol",
  },
  {
    title: "Stellenausschreibung",
    description: "Aktuelle Stellenangebote des VTG.",
    href: "/stellenausschreibung",
  },
];

export default function AusschreibungPage() {
  return (
    <>
      <PageHero title="Ausschreibung" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
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
