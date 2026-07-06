import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Stellenausschreibung | VTG Rheinland-Pfalz",
};

export default function StellenausschreibungPage() {
  return (
    <>
      <PageHero title="Stellenausschreibung" subtitle="Karriere machen beim VTG." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Hier finden Sie offene Stellen beim Verband der
          Teilnehmergemeinschaften Rheinland-Pfalz, Körperschaft des
          öffentlichen Rechts. Aktuell sind keine offenen Stellen
          ausgeschrieben. Bei Interesse an einer Initiativbewerbung wenden Sie
          sich gerne an die{" "}
          <a href="/geschaeftsstelle" className="text-vtg-orange hover:underline">
            Geschäftsstelle
          </a>
          .
        </p>
      </section>
    </>
  );
}
