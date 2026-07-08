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
            columns={["Produkt-Nr.", "Flurbereinigungsverfahren"]}
            rows={list.map((v) => [
              <Link
                key={v.nr}
                href={`/mitgliederbereich/verfahrensdaten?id=${v.nr}`}
                className="text-vtg-orange hover:underline"
              >
                {v.nr}
              </Link>,
              v.name,
            ])}
          />
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">
            Dieser Bereich wird mit den persönlichen Daten Ihres Verfahrens
            verknüpft, sobald der Mitgliederlogin freigeschaltet ist.
          </p>
        )}
      </section>
    </>
  );
}
