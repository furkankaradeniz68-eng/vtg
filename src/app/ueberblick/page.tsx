import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Überblick | VTG Rheinland-Pfalz" };

const aufgaben = [
  "Bauoberleitung (Beratung, Planung, Ausschreibung, Abrechnung und Dokumentation)",
  "Bauausführung zur Herstellung und Unterhaltung der gemeinschaftlichen Anlagen",
  "Vorhalten von Bauhöfen für Eigenregiearbeiten im Tiefbaubereich",
  "Leistung und Vorfinanzierung aller Zahlungen über ein zentrales Verbundkonto",
  "Forderung der Hebungsbeiträge und Ausgleichszahlungen bei den Grundstückseigentümern",
  "Anforderungen von Zuschüssen bei den Zuwendungsgebern einschließlich Dokumentation und Verwendungsnachweis",
  "Mitgliedbezogene zentrale Buchhaltung mit Verwendungsnachweis",
  "Information und Weiterbildungsangebote",
  "Dialog mit Politik und Verbänden",
];

export default function UeberblickPage() {
  return (
    <>
      <PageHero title="Überblick" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-neutral-900">
          Willkommen beim VTG Rheinland-Pfalz
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Verwaltung", image: "/images/ueberblick/Verwaltung.jpg" },
            { title: "Fortbildung", image: "/images/ueberblick/Fortbildung.jpg" },
            { title: "Ausbau", image: "/images/ueberblick/Ausbau.jpg" },
          ].map((item) => (
            <div key={item.title} className="relative h-40 w-full overflow-hidden rounded-lg">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
          ))}
        </div>

        <p className="mt-10 text-base leading-relaxed text-neutral-700">
          Der Verband der Teilnehmergemeinschaften (VTG) ist ein Zusammenschluss
          der Teilnehmergemeinschaften von Bodenordnungsverfahren (Mitglieder)
          im Lande Rheinland-Pfalz. Rechtsgrundlage sind die{" "}
          <a
            href="https://www.gesetze-im-internet.de/flurbg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vtg-orange hover:underline"
          >
            §§ 26a-f des Flurbereinigungsgesetzes (FlurbG)
          </a>
          . Der VTG hat danach wie seine Mitglieder die Rechtsform der
          Körperschaft des öffentlichen Rechts. Er verwaltet sich im Rahmen der
          Gesetze und seiner{" "}
          <Link href="/satzung" className="text-vtg-orange hover:underline">
            Satzung
          </Link>{" "}
          selbst. Der VTG dient der gemeinsamen Durchführung von Aufgaben, die
          seinen Mitgliedern nach{" "}
          <a
            href="https://www.gesetze-im-internet.de/flurbg/__18.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vtg-orange hover:underline"
          >
            § 18 Flurbereinigungsgesetz
          </a>{" "}
          obliegen. Er nimmt danach in den Flurbereinigungsverfahren des
          Landes Rheinland-Pfalz vor allem folgende Aufgaben für seine
          Mitglieder wahr:
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-700">
          {aufgaben.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          Sitz und{" "}
          <Link href="/geschaeftsstelle" className="text-vtg-orange hover:underline">
            Geschäftsstelle
          </Link>{" "}
          des VTG ist in 67433 Neustadt/Weinstrasse, Exterstrasse 4. Bei den
          Dienstleistungszentren Ländlicher Raum (DLR) in{" "}
          <Link href="/bernkastel-kues" className="text-vtg-orange hover:underline">
            Bernkastel-Kues
          </Link>
          ,{" "}
          <Link href="/kaiserslautern" className="text-vtg-orange hover:underline">
            Kaiserslautern
          </Link>
          ,{" "}
          <Link href="/mayen-montabaur" className="text-vtg-orange hover:underline">
            Mayen
          </Link>
          ,{" "}
          <Link href="/neustadt" className="text-vtg-orange hover:underline">
            Neustadt
          </Link>
          ,{" "}
          <Link href="/simmern-bad-kreuznach" className="text-vtg-orange hover:underline">
            Simmern
          </Link>{" "}
          und{" "}
          <Link href="/mayen-montabaur" className="text-vtg-orange hover:underline">
            Montabaur
          </Link>{" "}
          sind Aussenstellen des VTG eingerichtet. Die DLR in Bitburg und
          Trier werden von der Aussenstelle{" "}
          <Link href="/pruem-bitburg-trier" className="text-vtg-orange hover:underline">
            Prüm
          </Link>{" "}
          und das DLR in Bad Kreuznach von der Aussenstelle in{" "}
          <Link href="/simmern-bad-kreuznach" className="text-vtg-orange hover:underline">
            Simmern
          </Link>{" "}
          aus mitbetreut.
        </p>
      </section>
    </>
  );
}
