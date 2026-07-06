import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Downloads | VTG Rheinland-Pfalz" };

const categories = [
  {
    title: "Satzung und Vordrucke",
    description:
      "Satzung, Beitrittserklärung und Vordrucke rund um die Mitgliedschaft im VTG.",
    href: "/download-satzung-vordrucke",
  },
  {
    title: "Fachtagungen",
    description:
      "Dokumentationen der Fachtagungen des VTG zu Themen der Landentwicklung.",
    href: "/fachtagungen",
  },
  {
    title: "Sonstiges",
    description:
      "Weitere Informationsmaterialien, Broschüren und Übersichten des VTG.",
    href: "/sonstiges",
  },
];

export default function DownloadsPage() {
  return (
    <>
      <PageHero title="Downloads" subtitle="Formulare, Broschüren und Fachdokumente zum Download." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((cat) => (
            <li key={cat.href}>
              <Link
                href={cat.href}
                className="block h-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h2 className="font-heading text-lg font-bold text-neutral-900">
                  {cat.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600">{cat.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
