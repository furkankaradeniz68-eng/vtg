import PageHero from "@/components/PageHero";

export default function MitgliederPlatzhalter({ title }: { title: string }) {
  return (
    <>
      <PageHero title={title} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-base leading-relaxed text-neutral-700">
          Dieser Bereich wird mit den persönlichen Daten Ihres Verfahrens
          verknüpft, sobald der Mitgliederlogin freigeschaltet ist.
        </p>
      </section>
    </>
  );
}
