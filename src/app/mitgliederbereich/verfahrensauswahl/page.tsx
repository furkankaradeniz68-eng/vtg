import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SimpleTable from "@/components/SimpleTable";
import { requireInternSession } from "@/lib/auth";
import { verfahrenByKreis } from "@/lib/verfahren-beispieldaten";

export const metadata: Metadata = { title: "Verfahrensauswahl | VTG Rheinland-Pfalz" };

export default async function VerfahrensauswahlPage() {
  const session = await requireInternSession();
  const list = verfahrenByKreis[session.username] ?? [];

  return (
    <>
      <PageHero title="Verfahrensauswahl" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {list.length > 0 ? (
          <SimpleTable
            columns={["Nr.", "Verfahren", "Fläche", "Stand"]}
            rows={list.map((v) => [
              v.nr,
              v.name,
              v.flaeche,
              v.stand,
            ])}
          />
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">
            Dieser Bereich wird mit den persönlichen Daten Ihres Verfahrens
            verknüpft, sobald der Mitgliederlogin freigeschaltet ist.
          </p>
        )}
        {list.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {list.map((v) => (
              <Link
                key={v.nr}
                href={`/mitgliederbereich/verfahrensdaten?verfahren=${v.nr}`}
                className="inline-flex items-center gap-1.5 rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-vtg-orange hover:text-vtg-orange"
              >
                {v.name} öffnen ›
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
