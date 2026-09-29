import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getStellenausschreibungen } from "@/lib/stellenausschreibung";

export const metadata: Metadata = {
  title: "Stellenausschreibung | VTG Rheinland-Pfalz",
};

export default async function StellenausschreibungPage() {
  const entries = await getStellenausschreibungen();

  return (
    <>
      <PageHero title="Stellenausschreibung" subtitle="Karriere machen beim VTG." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {entries.length > 0 ? (
          <div className="space-y-10">
            {entries.map((entry) => (
              <div key={entry.id}>
                <h2 className="font-heading text-xl font-bold text-neutral-900">{entry.title}</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-neutral-700">
                  {entry.description}
                </p>
                {entry.pdfFilename && (
                  <a
                    href={`/api/stellenausschreibung/${entry.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
                  >
                    Stellenausschreibung als PDF öffnen
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base leading-relaxed text-neutral-700">
            Aktuell sind keine offenen Stellen ausgeschrieben. Bei Interesse an einer Initiativbewerbung wenden
            Sie sich gerne an die Geschäftsstelle.
          </p>
        )}
      </section>
    </>
  );
}
