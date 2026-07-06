import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Login | VTG Rheinland-Pfalz" };

export default function LoginPage() {
  return (
    <>
      <PageHero title="Mitglieder-Login" subtitle="Der Login-Bereich für Mitglieder befindet sich im Aufbau." />
      <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Der digitale Mitgliederbereich mit Zugriff auf Umlagen, Zinsen und
          Verfahrensdaten wird derzeit vorbereitet und ist in Kürze an dieser
          Stelle verfügbar. Bitte wenden Sie sich in der Zwischenzeit an Ihre
          zuständige Geschäftsstelle.
        </p>
      </section>
    </>
  );
}
