import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Impressum | VTG Rheinland-Pfalz" };

export default function ImpressumPage() {
  return (
    <>
      <PageHero title="Impressum" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-8 text-base leading-relaxed text-neutral-700">
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-900">Verantwortlich</h2>
          <p className="mt-3">
            Michael Zürker, Geschäftsführer des Verbandes der
            Teilnehmergemeinschaften Rheinland-Pfalz, Roßlaufstraße 17, 67433
            Neustadt, E-Mail:{" "}
            <a href="mailto:info@vtg-rlp.de" className="text-vtg-orange hover:underline">
              info@vtg-rlp.de
            </a>
            , Telefon: 06321/49110
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-900">Urheberrecht</h2>
          <p className="mt-3">
            Die Gestaltung des Angebots sowie die inhaltlichen Beiträge sind
            urheberrechtlich geschützt. Dies gilt insbesondere für Texte,
            Bilder, Grafiken, Ton-, Video- oder Animationsdateien
            einschließlich deren Anordnung auf den Web-Seiten. Veränderungen
            dürfen hieran nicht vorgenommen werden. Zum Download angebotene
            Informationen (Broschüren, Formulare, Merkblätter etc.) können zum
            persönlichen Gebrauch gespeichert und ausgedruckt werden. Der
            Nachdruck und die Auswertung von Pressemitteilungen und Reden ist
            mit Quellenangabe gestattet. Im Übrigen darf die Veröffentlichung
            (auch im Internet), Verarbeitung oder gewerbliche Nutzung aller
            Inhalte (oder Teilen davon) nur nach vorheriger Genehmigung der
            Redaktion erfolgen.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-900">Haftungsausschluss</h2>
          <p className="mt-3">
            Die Informationen auf dieser Website wurden nach bestem Wissen und
            Gewissen sorgfältig zusammengestellt und geprüft. Es wird jedoch
            keine Gewähr, weder ausdrücklich noch stillschweigend, für die
            Vollständigkeit, Richtigkeit oder Aktualität sowie die
            jederzeitige Verfügbarkeit der bereitgestellten Informationen
            übernommen. Eine Haftung für Schäden, die aus der Nutzung oder
            Nichtnutzung der auf dieser Website angebotenen Informationen
            entstehen, ist ausgeschlossen. Ebenfalls wird für etwaige Schäden,
            die beim Aufrufen oder Herunterladen von Daten durch
            Computerviren oder bei der Installation oder Nutzung von Software
            verursacht werden, nur im Rahmen der gesetzlichen Bestimmungen
            gehaftet.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-900">
            Websites Dritter / Links
          </h2>
          <p className="mt-3">
            Diese Website enthält auch entsprechend gekennzeichnete Links
            oder Verweise auf Websites Dritter. Durch den Link wird lediglich
            der Zugang zur Nutzung dieser Inhalte vermittelt. Eine Zustimmung
            zu den Inhalten der verlinkten Seiten Dritter ist damit nicht
            verbunden. Es wird daher keine Verantwortung für die
            Verfügbarkeit oder den Inhalt solcher Websites übernommen und
            keine Haftung für Schäden oder Verletzungen, die aus der Nutzung –
            gleich welcher Art – solcher Inhalte entstehen. Hierfür haftet
            allein der Anbieter der jeweiligen Seite.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-900">Datenschutz</h2>
          <p className="mt-3">
            Alle Informationen zum Datenschutz haben wir auf einer{" "}
            <a href="/datenschutzerklaerung" className="text-vtg-orange hover:underline">
              gesonderten Seite
            </a>{" "}
            zusammengefasst.
          </p>
        </div>
        <p className="text-sm text-neutral-400">Quellenangabe: eRecht24</p>
      </section>
    </>
  );
}
