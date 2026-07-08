import Link from "next/link";
import PageHero from "@/components/PageHero";
import FinanzberichtTabelle from "@/components/FinanzberichtTabelle";
import { findVerfahren } from "@/lib/verfahren-beispieldaten";
import { finanzKategorien, type FinanzKategorieSlug } from "@/lib/finanzbericht-beispieldaten";

export default function FinanzberichtSeite({
  kategorieSlug,
  ansicht,
  verfahrenId,
  laufzeitHref,
  haushaltsjahrHref,
}: {
  kategorieSlug: FinanzKategorieSlug;
  ansicht: "laufzeit" | "haushaltsjahr";
  verfahrenId?: string;
  laufzeitHref: string;
  haushaltsjahrHref: string;
}) {
  const kategorie = finanzKategorien[kategorieSlug];
  const verfahren = verfahrenId ? findVerfahren(verfahrenId) : undefined;
  const ansichtLabel = ansicht === "laufzeit" ? "Laufzeit" : "Haushaltsjahr";
  const planLabel = ansicht === "laufzeit" ? "FinPL" : "Jahresprogramm";
  const heroTitel = kategorie.suffix ? `${kategorie.titel}/${kategorie.suffix}` : kategorie.titel;

  return (
    <>
      <PageHero title={`${heroTitel} (${ansichtLabel})`} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href={`/mitgliederbereich/finanzuebersicht${verfahrenId ? `?id=${verfahrenId}` : ""}`}
          className="mb-6 inline-flex items-center gap-1.5 rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-vtg-orange hover:text-vtg-orange"
        >
          ‹ Zurück zur Finanzübersicht
        </Link>

        <h2 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
          {kategorie.titel} ({ansichtLabel})
        </h2>

        {verfahren ? (
          <>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm text-neutral-700">
              <p>
                <strong className="text-neutral-900">{verfahren.nr}</strong> {verfahren.name}
              </p>
              <p>HJ: {verfahren.hj}</p>
              <p>Stand: {verfahren.stand}</p>
            </div>
            <p className="mb-6 text-sm text-neutral-700">
              {ansicht === "haushaltsjahr" ? (
                <>
                  <strong className="text-neutral-900">[Haushaltsjahr]</strong>{" "}
                  /{" "}
                  <Link href={laufzeitHref} className="text-vtg-orange hover:underline">
                    Laufzeit
                  </Link>
                </>
              ) : (
                <>
                  <Link href={haushaltsjahrHref} className="text-vtg-orange hover:underline">
                    Haushaltsjahr
                  </Link>{" "}
                  / <strong className="text-neutral-900">[Laufzeit]</strong>
                </>
              )}
            </p>
            <FinanzberichtTabelle planLabel={planLabel} zeilen={kategorie.zeilen} />
          </>
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">
            Dieser Bericht wird mit den Echtzeit-Finanzdaten Ihres Verfahrens verknüpft,
            sobald die Anbindung an die BC-Schnittstelle steht.
          </p>
        )}
      </section>
    </>
  );
}
