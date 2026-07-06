import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Kontakt | VTG Rheinland-Pfalz" };

const orte = [
  { title: "Geschäftsstelle Neustadt", href: "/geschaeftsstelle" },
  { title: "Bernkastel-Kues", href: "/bernkastel-kues" },
  { title: "Kaiserslautern", href: "/kaiserslautern" },
  { title: "Mayen/Montabaur", href: "/mayen-montabaur" },
  { title: "Neustadt", href: "/neustadt" },
  { title: "Prüm/Bitburg/Trier", href: "/pruem-bitburg-trier" },
  { title: "Simmern/Bad Kreuznach", href: "/simmern-bad-kreuznach" },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero title="Kontakt" subtitle="Unsere Geschäftsstelle und Dienstleistungszentren in Rheinland-Pfalz." />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orte.map((ort) => (
            <li key={ort.href}>
              <Link
                href={ort.href}
                className="block h-full rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <h2 className="font-heading text-lg font-bold text-neutral-900">
                  {ort.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
