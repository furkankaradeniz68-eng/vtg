import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] items-center overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Landentwicklung in Rheinland-Pfalz"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/55" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Verband der Teilnehmergemeinschaften
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-100">
            Gemeinsam für geordnete Bodenentwicklung in Rheinland-Pfalz.
          </p>
          <Link
            href="/ueberblick"
            className="mt-8 inline-block rounded bg-vtg-orange px-8 py-3 font-heading text-sm font-bold uppercase tracking-wide text-neutral-900 transition hover:bg-vtg-yellow"
          >
            Überblick
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-neutral-900 sm:text-3xl">
          Wer wir sind
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-700">
          Der Verband der Teilnehmergemeinschaften Rheinland-Pfalz (VTG) ist
          der Dachverband der Teilnehmergemeinschaften von
          Bodenordnungsverfahren in Rheinland-Pfalz. Als Körperschaft des
          öffentlichen Rechts mit Selbstverwaltung, errichtet auf Grundlage
          der §§ 26a–f des Flurbereinigungsgesetzes, übernimmt der VTG für
          seine Mitglieder die Bauabwicklung, die zentrale Kassen- und
          Buchführung sowie die Vorfinanzierung gemeinschaftlicher Anlagen.
        </p>
        <Link
          href="/ueberblick"
          className="mt-8 inline-block rounded border-2 border-neutral-900 px-8 py-3 font-heading text-sm font-bold uppercase tracking-wide text-neutral-900 transition hover:border-vtg-orange hover:bg-vtg-orange"
        >
          Zum Überblick
        </Link>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6">
          {[
            {
              title: "Verwaltung",
              image: "/images/ueberblick/Verwaltung.jpg",
              href: "/kassen-und-buchfuehrung",
            },
            {
              title: "Fortbildung",
              image: "/images/ueberblick/Fortbildung.jpg",
              href: "/sonstige-aufgaben",
            },
            {
              title: "Ausbau",
              image: "/images/ueberblick/Ausbau.jpg",
              href: "/bauabwicklung",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-neutral-900">
                  {card.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
