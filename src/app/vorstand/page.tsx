import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Vorstand | VTG Rheinland-Pfalz" };

const vorstand = [
  {
    dienstsitz: "—",
    name: "Michael Haack",
    rolle: "Präsident",
    adresse: "Zweibrückerstr. 70, 66894 Martinshöhe",
    telefon: "(06372) 61238",
  },
  {
    dienstsitz: "—",
    name: "Werner Görgen",
    rolle: "stellvertretender Präsident",
    adresse: "Weinbergstr. 1a, 54517 Platten",
    telefon: "(06535) 807",
  },
  {
    dienstsitz: "DLR Westerwald-Osteifel, Dienstsitz Montabaur",
    name: "Eckhard Hölzemann",
    adresse: "Bergstr. 9, 57641 Oberlahr",
    telefon: "(02685) 70150",
    vertreter: "Uwe Holstein",
    vertreterAdresse: "Hof Meiseneck, 56357 Bogel",
    vertreterTelefon: "(0160) 2627748",
  },
  {
    dienstsitz: "Dienstsitz Mayen",
    name: "Hubert Pauly",
    adresse: "Bachstr. 22, 53507 Dernau",
    telefon: "(0174) 4028616",
    vertreter: "Bernhard Heep",
    vertreterAdresse: "Gartenstr. 3, 56825 Gevenich",
    vertreterTelefon: "(0171) 2297213",
  },
  {
    dienstsitz: "DLR Eifel, Dienstsitz Prüm",
    name: "Thomas Neises",
    adresse: "Meilbrücker Str. 14, 54636 Idenheim",
    telefon: "(06506) 910077",
    vertreter: "Norbert Schenten",
    vertreterAdresse: "Kapellenstr. 9, 54689 Jucken",
    vertreterTelefon: "(06550) 960036",
  },
  {
    dienstsitz: "DLR Mosel, Dienstsitz Bernkastel-Kues",
    name: "Werner Görgen",
    adresse: "Weinbergstr. 1a, 54517 Platten",
    telefon: "(06535) 807",
    vertreter: "Karl-Josef Heinz",
    vertreterAdresse: "Panoramastr. 54, 54470 Graach",
    vertreterTelefon: "(06531) 7154",
  },
  {
    dienstsitz: "Dienstsitz Trier",
    name: "Otto Minn",
    adresse: "Hauptstr. 1, 54441 Ockfen",
    telefon: "(0171) 2672769",
    vertreter: "Klaus Bodem",
    vertreterAdresse: "Schulstr. 13, 54451 Irsch",
    vertreterTelefon: "(06581) 5703",
  },
  {
    dienstsitz: "DLR Rheinhessen-Nahe-Hunsrück, Dienstsitz Simmern",
    name: "Hans Herbert Laux",
    adresse: "Rother Pfad 7, 56290 Uhler",
    telefon: "(06762) 1893",
    vertreter: "Günter Schlemmer",
    vertreterAdresse: "Im Bungert 8, 56154 Boppard Weiler",
    vertreterTelefon: "(06742) 6618",
  },
  {
    dienstsitz: "Dienstsitz Bad Kreuznach",
    name: "Karl-Heinz Becker",
    adresse: "Herrgasse 9, 55232 Ensheim",
    telefon: "(06732) 7895",
    vertreter: "Hans Joachim Raddeck",
    vertreterAdresse: "Am Hummertal 100, 55283 Nierstein",
    vertreterTelefon: "(06133) 58115",
  },
  {
    dienstsitz: "DLR Westpfalz, Dienstsitz Kaiserslautern",
    name: "Michael Haack",
    adresse: "Zweibrückerstr. 70, 66894 Martinshöhe",
    telefon: "(06372) 61238",
    vertreter: "Ralf Klein",
    vertreterAdresse: "Liebsthaler Str. 12a, 66909 Quirnbach",
    vertreterTelefon: "(06383) 6673",
  },
  {
    dienstsitz: "DLR Rheinland-Pfalz, Dienstsitz Neustadt",
    name: "Jörg Kuhmann",
    adresse: "Kirchheimer Str. 6, 67273 Weisenheim a.B.",
    telefon: "(06353) 8450",
    vertreter: "Thorsten Langenwalter",
    vertreterAdresse: "Bahnhofstr. 45, 67256 Weisenheim a.S.",
    vertreterTelefon: "(06353) 7390",
  },
];

export default function VorstandPage() {
  return (
    <>
      <PageHero title="Vorstand" />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-xl font-bold text-neutral-900">VTG Rheinland-Pfalz</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700">
          <p>
            Der ehrenamtliche Vorstand wird aus den Reihen der
            Teilnehmergemeinschaften auf 5 Jahre gewählt. Er besteht aus 9
            Mitgliedern. Jedes Vorstandsmitglied hat einen persönlichen
            Stellvertreter. Der Vorstand stellt den Jahresabschluss und den
            Wirtschaftsplan auf und beschließt insbesondere über
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>die Festsetzung der Beitragssätze</li>
            <li>die Aufnahme neuer Mitglieder</li>
            <li>die Bestellung und Entlassung des Geschäftsführers und seines Stellvertreters</li>
          </ul>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 text-left">
                <th className="p-3 font-heading">DLR / Dienstsitz</th>
                <th className="p-3 font-heading">Vorstandsmitglied</th>
                <th className="p-3 font-heading">Vertreter</th>
              </tr>
            </thead>
            <tbody>
              {vorstand.map((v, i) => (
                <tr key={i} className="border-b border-neutral-200 align-top">
                  <td className="p-3 text-neutral-600">{v.dienstsitz}</td>
                  <td className="p-3">
                    <p className="font-semibold text-neutral-900">
                      {v.name}
                      {v.rolle ? `, ${v.rolle}` : ""}
                    </p>
                    <p className="text-neutral-600">{v.adresse}</p>
                    <p className="text-neutral-600">{v.telefon}</p>
                  </td>
                  <td className="p-3">
                    {v.vertreter && (
                      <>
                        <p className="font-semibold text-neutral-900">{v.vertreter}</p>
                        <p className="text-neutral-600">{v.vertreterAdresse}</p>
                        <p className="text-neutral-600">{v.vertreterTelefon}</p>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
