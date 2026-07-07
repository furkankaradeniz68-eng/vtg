import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Sonstiges | VTG Rheinland-Pfalz" };

const downloads = [
  {
    title: "Fortbildung für TG-Vorstände 14./15.11.2019 Neustadt",
    href: "/downloads/Fortbildung_TG_Vorstände_2019.zip",
  },
  {
    title: '"Wege in die Zukunft" Neue Anforderungen an ländliche Infrastrukturen',
    href: "/downloads/Wege_in_die_Zukunft_Sonderheft_der_DLKG.pdf",
  },
  {
    title: "BTG Flyer",
    href: "/downloads/BTG Flyer - Flurbereinigung schafft Zukunft.pdf",
  },
];

export default function SonstigesPage() {
  return (
    <>
      <PageHero title="Sonstiges" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Hier finden Sie alle wichtigen Dokumente zum runter laden.
        </p>

        <div className="mt-8 flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {downloads.map((item) => (
            <div key={item.href} className="flex items-center justify-between gap-4 p-5">
              <p className="font-heading font-semibold text-neutral-900">{item.title}</p>
              <a
                href={item.href}
                download
                className="shrink-0 rounded bg-vtg-orange px-4 py-2 text-sm font-heading font-bold uppercase tracking-wide text-neutral-900 hover:bg-vtg-yellow"
              >
                Download
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="font-heading text-xl font-bold text-neutral-900">
            Video des Weingut Jostock-Sohn zum Steillagenwein- und mauerbau an der Mosel
          </h3>
          <video
            controls
            className="mt-4 h-auto w-full max-w-xl rounded-lg"
            src="/downloads/Weinbergsmauern.mp4"
          />
        </div>
      </section>
    </>
  );
}
