import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Links | VTG Rheinland-Pfalz" };

type LinkItem = {
  label: string;
  href: string;
  description: string;
};

type Category = {
  title: string;
  items: LinkItem[];
};

const categories: Category[] = [
  {
    title: "Gesetze und Verwaltungsvorschriften",
    items: [
      {
        label: "Flurbereinigungsgesetz",
        href: "https://www.gesetze-im-internet.de/flurbg/",
        description: "Recht hat, wer Recht bekommt.",
      },
      {
        label: "Landesausführungsgesetz zum Flurbereinigungsgesetz",
        href: "http://landesrecht.rlp.de/jportal/portal/t/oua/page/bsrlpprod.psml/action/portlets.jw.MainAction?p1=0&eventSubmit_doNavigate=searchInSubtreeTOC&showdoccase=1&doc.hl=0&doc.id=jlr-FlurbGAGRPrahmen&doc.part=R&toc.poskey=",
        description: "Rheinland-Pfalz ist halt einzigartig.",
      },
      {
        label: "Förderrichtlinie",
        href: "https://www.vtg-rlp.de/files/VV_F%C3%B6rderung_der_l%C3%A4ndlichen_Bodenordnung_25.06.2021.pdf",
        description:
          "Verwaltungsvorschrift über die Förderung der ländlichen Bodenordnung",
      },
    ],
  },
  {
    title: "Behörden und Institutionen (Rheinland-Pfalz)",
    items: [
      {
        label: "www.landentwicklung.rlp.de",
        href: "https://www.landentwicklung.rlp.de/",
        description:
          "Homepage der Landeskulturverwaltung Rheinland-Pfalz mit Infos zu allen Bodenordnungsverfahren.",
      },
      {
        label: "www.dlr.rlp.de",
        href: "https://www.dlr.rlp.de/",
        description:
          "Homepage der DLR Rheinland-Pfalz. Viel Nützliches rund um den Ländlichen Raum und die Landwirtschaft.",
      },
      {
        label: "www.rlp.de",
        href: "https://www.rlp.de/",
        description: "Homepage des Landes Rheinland-Pfalz.",
      },
      {
        label: "www.mwvlw.rlp.de",
        href: "https://www.mwvlw.rlp.de/",
        description:
          "Homepage des Ministeriums für Umwelt, Landwirtschaft, Ernährung, Weinbau und Forsten Rheinland-Pfalz.",
      },
      {
        label: "www.eler-eulle.rlp.de",
        href: "https://www.eler-eulle.rlp.de/",
        description: "Entwicklungsplan Ländlicher Raum für Rheinland-Pfalz (PAUL).",
      },
      {
        label: "www.lwk-rlp.de",
        href: "https://www.lwk-rlp.de/",
        description: "Homepage der Landwirtschaftskammer Rheinland-Pfalz.",
      },
      {
        label: "www.bwv-net.de",
        href: "https://www.bwv-net.de/",
        description: "Homepage des Bauern- und Winzerverbandes Rheinland-Nassau e.V.",
      },
      {
        label: "www.bwv-rlp.de",
        href: "https://www.bwv-rlp.de/",
        description: "Homepage des Bauernverbands Rheinland-Pfalz-Süd",
      },
    ],
  },
  {
    title: "Behörden und Institutionen (Europa / BRD)",
    items: [
      {
        label: "www.btg-bund.de",
        href: "https://www.btg-bund.de/",
        description: "Bundesverband der Teilnehmergemeinschaften.",
      },
      {
        label: "www.landentwicklung.de",
        href: "https://www.landentwicklung.de/",
        description:
          "Homepage der Bund-Länder-Arbeitsgemeinschaft Landentwicklung; Portal zum Zugang zu den Homepages der Flurneuordnungsverwaltungen aller Bundesländer.",
      },
      {
        label: "www.dlkg.org",
        href: "https://www.dlkg.org/schriftenreihe.php",
        description: "Deutsche Landeskulturgesellschaft.",
      },
      {
        label: "www.europa.eu",
        href: "https://european-union.europa.eu/index_de",
        description: "Europäische Union.",
      },
      {
        label: "www.bundestag.de",
        href: "https://www.bundestag.de/",
        description: "Deutscher Bundestag; hier finden Sie auch Bundes-Gesetzestexte.",
      },
      {
        label: "www.bmleh.de",
        href: "https://www.bmleh.de/DE/Home/home_node.html",
        description: "Bundesministerium für Landwirtschaft, Ernährung und Heimat.",
      },
      {
        label: "www.bauernverband.de",
        href: "https://www.bauernverband.de/",
        description:
          "Homepage des Deutschen Bauernverbandes. Von hier aus geht's auch zu allen Landesbauernverbänden.",
      },
      {
        label: "www.maschinenringe.de",
        href: "http://www.maschinenringe.de/",
        description: "Bundesverband der Maschinenringe (mit allen Landesverbänden).",
      },
      {
        label: "www.netzwerk-laendliche-raeume.de",
        href: "https://www.netzwerk-laendliche-raeume.de/",
        description: "Deutsche Vernetzungsstelle Ländlicher Raum (DVS)",
      },
    ],
  },
  {
    title: "Nützliches rund um die Flurbereinigung",
    items: [
      {
        label: "www.geoportal.rlp.de",
        href: "https://www.geoportal.rlp.de/map?LAYER[visible]=1&LAYER[querylayer]=1&LAYER[zoom]=1&LAYER[id]=54546",
        description: "Geoportal Rheinland-Pfalz – DLR Bodenordnungsverfahren.",
      },
      {
        label: "www.geo4.service24.rlp.de",
        href: "https://maps.rlp.de/",
        description: "Geobasisviewer des LVermGeo.",
      },
      {
        label: "www.map1.naturschutz.rlp.de",
        href: "https://geodaten.naturschutz.rlp.de/kartendienste_naturschutz/",
        description: "Landschaftsinformationssystem der Naturschutzverwaltung.",
      },
      {
        label: "www.wetter.rlp.de",
        href: "https://www.wetter.rlp.de/Internet/global/inetcntr.nsf/dlr_web_full.xsp?src=L941ES4AB8&p1=1PJCNH7DKW&p2=IB26DJ6C96&p3=9IQ84WEY3L&p4=XJPZBV4849",
        description: "Agrarmeteorologie Rheinland-Pfalz",
      },
    ],
  },
  {
    title: "Videos Flurbereinigung",
    items: [
      {
        label: "Flurbereinigung in Rheinland-Pfalz (YouTube)",
        href: "https://www.youtube.com/watch?v=40max86hrCQ",
        description: "",
      },
      {
        label: "Calmont (YouTube)",
        href: "https://www.youtube.com/watch?v=jg550UH1Thc",
        description: "",
      },
      {
        label: "Kaub (YouTube)",
        href: "https://www.youtube.com/watch?v=p447KxCiN7o",
        description: "",
      },
      {
        label: "Limes (YouTube)",
        href: "https://www.youtube.com/watch?v=2yiNgk2VK_k",
        description: "",
      },
      {
        label: "Ürzig Bildflug Planung (YouTube)",
        href: "https://www.youtube.com/watch?v=tKcDqhMV9Tg",
        description: "",
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <>
      <PageHero title="Links" subtitle="Nützliche Verweise rund um die Flurbereinigung." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-10">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="font-heading text-xl font-bold text-neutral-900">
              {cat.title}
            </h2>
            <ul className="mt-4 space-y-4">
              {cat.items.map((item) => (
                <li key={item.href} className="border-b border-neutral-100 pb-3">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-vtg-orange hover:underline"
                  >
                    {item.label}
                  </a>
                  {item.description && (
                    <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
