import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Bauabwicklung | VTG Rheinland-Pfalz" };

const schwerpunkte = [
  "Bauliche Beratung und Betreuung der Mitglieder während des gesamten Flurbereinigungsverfahrens",
  "Bauausführung mit eigenem Personal, Maschinen und Geräten (Eigenregie)",
  "Bauoberleitung",
  "Erstellung von Ausschreibungsunterlagen",
  "Vorbereitung der Vergabe",
  "Prüfung der Rechnungen von Fremdfirmen",
  "Überwachung der Baufinanzierung",
  "Abrechnung",
];

export default function BauabwicklungPage() {
  return (
    <>
      <PageHero title="Bauabwicklung" />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-base leading-relaxed text-neutral-700">
            <h3 className="font-heading text-xl font-bold text-neutral-900 sm:text-2xl">
              Zu diesem Aufgabenschwerpunkt gehören vor allem:
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              {schwerpunkte.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Image
              src="/images/ueberblick/Ausbau.jpg"
              alt=""
              width={898}
              height={600}
              className="h-auto w-full max-w-[898px] rounded-lg"
            />
          </div>
        </div>
        <div className="mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Der VTG führt für seine Mitglieder Bau-, Landespflege- und
            Vermessungsarbeiten selbst durch, sogenannte Eigenregiearbeiten.
          </p>
          <p>
            Landesweit stehen für diese Eigenregiearbeiten etwa 100
            Baufacharbeiter, Messgehilfen, Maschinenführer und
            Bauaufsichtspersonal zur Verfügung. Der Maschinen- und Gerätepark
            weist über 60 selbstfahrende Arbeitsmaschinen und 140 Baugeräte auf,
            die in 9 Außenstellen landesweit verteilt sind. Durch die
            langjährige Erfahrung der Arbeiter und Maschinenführer des VTG, die
            Spezialisierung auf Flurbereinigungsarbeiten und die Gewährleistung
            der gesetzlich ermöglichten Eigenleistung durch Mithilfe der
            Grundstückseigentümer sind die Eigenregiearbeiten des VTG sehr
            nachgefragt.
          </p>
          <p>
            Vorteil für die Teilnehmergemeinschaft ist auch, dass bei
            Durchführung dieser Eigenregiearbeiten weder Umsatzsteuer anfällt
            noch Gewinne erzielt werden dürfen. Durch die Bündelung dieser
            Aufgaben in einem landesweit tätigen Betrieb wird ein hohes Maß an
            Wirtschaftlichkeit erreicht. Die Beitragssätze (Stundensätze) können
            dadurch zu Gunsten der Mitglieder sehr niedrig kalkuliert werden.
            Mehr Informationen zu den Beitragssätzen finden Sie im
            Mitgliederbereich.
          </p>
          <p>
            Der VTG kann nicht alle im Verfahren anfallenden Arbeiten selbst
            ausführen. Entweder, weil in Spitzenzeiten die Kapazitäten nicht
            ausreichen, oder weil sein Maschinenpark hierfür nicht ausgelegt
            ist, wie z. B. bei der bituminösen Wegebefestigung. Es kann aber
            auch einfach sein, dass der Vorstand der Teilnehmergemeinschaft aus
            ganz spezifischen Gründen den Eigenregiebetrieb nicht einsetzen
            will. In diesen Fällen muss mit Fremdfirmen gearbeitet werden.
          </p>
          <p>
            Der Vorstand der Teilnehmergemeinschaft entscheidet selbst, ob er
            den Ausbau und die Unterhaltung der gemeinschaftlichen Anlagen im
            Selbstbetrieb (Eigenregie) durch den VTG herstellen lassen will oder
            die erforderlichen Arbeiten an gewerbliche Unternehmen vergeben
            werden sollen.
          </p>
        </div>
      </section>
    </>
  );
}
