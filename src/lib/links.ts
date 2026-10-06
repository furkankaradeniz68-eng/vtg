// Links-Seite (/links): Texte + URL je Eintrag, gruppiert nach Kategorie.
// Fruher hart codiertes Array in app/links/page.tsx, jetzt admin-pflegbar
// nach dem gleichen Blob-JSON-Muster wie umlage.ts / public-downloads.ts.
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";

const META_PATHNAME = "links-meta.json";

export type LinkItem = {
  id: string;
  category: string;
  label: string;
  href: string;
  description: string;
  updatedAt: string;
};

export type LinkCategory = {
  title: string;
  items: LinkItem[];
};

const SEED_DATE = new Date(0).toISOString();

const DEFAULT_ITEMS: LinkItem[] = [
  {
    id: "seed-1",
    category: "Gesetze und Verwaltungsvorschriften",
    label: "Flurbereinigungsgesetz",
    href: "https://www.gesetze-im-internet.de/flurbg/",
    description: "Recht hat, wer Recht bekommt.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-2",
    category: "Gesetze und Verwaltungsvorschriften",
    label: "Landesausführungsgesetz zum Flurbereinigungsgesetz",
    href: "http://landesrecht.rlp.de/jportal/portal/t/oua/page/bsrlpprod.psml/action/portlets.jw.MainAction?p1=0&eventSubmit_doNavigate=searchInSubtreeTOC&showdoccase=1&doc.hl=0&doc.id=jlr-FlurbGAGRPrahmen&doc.part=R&toc.poskey=",
    description: "Rheinland-Pfalz ist halt einzigartig.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-3",
    category: "Gesetze und Verwaltungsvorschriften",
    label: "Förderrichtlinie",
    href: "https://www.vtg-rlp.de/files/VV_F%C3%B6rderung_der_l%C3%A4ndlichen_Bodenordnung_25.06.2021.pdf",
    description: "Verwaltungsvorschrift über die Förderung der ländlichen Bodenordnung",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-4",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.landentwicklung.rlp.de",
    href: "https://www.landentwicklung.rlp.de/",
    description: "Homepage der Landeskulturverwaltung Rheinland-Pfalz mit Infos zu allen Bodenordnungsverfahren.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-5",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.dlr.rlp.de",
    href: "https://www.dlr.rlp.de/Internet/global/inetcntr.nsf/dlr_web_full.xsp?src=KX857Y6F05&p1=452N431O1U&p3=QK595PD880&p4=78HV82A9P5",
    description: "Homepage der DLR Rheinland-Pfalz. Viel Nützliches rund um den Ländlichen Raum und die Landwirtschaft.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-6",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.rlp.de",
    href: "https://www.rlp.de/",
    description: "Homepage des Landes Rheinland-Pfalz.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-7",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.mlwuf.rlp.de",
    href: "https://mlwuf.rlp.de/",
    description: "Homepage des Ministeriums für Landwirtschaft, Weinbau, Umwelt und Forsten Rheinland-Pfalz.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-8",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.eler-eulle.rlp.de",
    href: "https://www.eler-eulle.rlp.de/",
    description: "Entwicklungsplan Ländlicher Raum für Rheinland-Pfalz (PAUL).",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-9",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.lwk-rlp.de",
    href: "https://www.lwk-rlp.de/",
    description: "Homepage der Landwirtschaftskammer Rheinland-Pfalz.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-10",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.bwv-net.de",
    href: "https://www.bwv-net.de/",
    description: "Homepage des Bauern- und Winzerverbandes Rheinland-Nassau e.V.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-11",
    category: "Behörden und Institutionen (Rheinland-Pfalz)",
    label: "www.bwv-rlp.de",
    href: "https://www.bwv-rlp.de/",
    description: "Homepage des Bauernverbands Rheinland-Pfalz-Süd",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-12",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.btg-bund.de",
    href: "https://www.btg-bund.de/",
    description: "Bundesverband der Teilnehmergemeinschaften.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-13",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.landentwicklung.de",
    href: "https://www.landentwicklung.de/",
    description:
      "Homepage der Bund-Länder-Arbeitsgemeinschaft Landentwicklung; Portal zum Zugang zu den Homepages der Flurneuordnungsverwaltungen aller Bundesländer.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-14",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.dlkg.org",
    href: "https://www.dlkg.org/schriftenreihe.php",
    description: "Deutsche Landeskulturgesellschaft.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-15",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.europa.eu",
    href: "https://european-union.europa.eu/index_de",
    description: "Europäische Union.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-16",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.bundestag.de",
    href: "https://www.bundestag.de/",
    description: "Deutscher Bundestag; hier finden Sie auch Bundes-Gesetzestexte.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-17",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.bmleh.de",
    href: "https://www.bmleh.de/DE/Home/home_node.html",
    description: "Bundesministerium für Landwirtschaft, Ernährung und Heimat.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-18",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.bauernverband.de",
    href: "https://www.bauernverband.de/",
    description: "Homepage des Deutschen Bauernverbandes. Von hier aus geht's auch zu allen Landesbauernverbänden.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-19",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.maschinenringe.de",
    href: "http://www.maschinenringe.de/",
    description: "Bundesverband der Maschinenringe (mit allen Landesverbänden).",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-20",
    category: "Behörden und Institutionen (Europa / BRD)",
    label: "www.netzwerk-laendliche-raeume.de",
    href: "https://www.netzwerk-laendliche-raeume.de/",
    description: "Deutsche Vernetzungsstelle Ländlicher Raum (DVS)",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-21",
    category: "Nützliches rund um die Flurbereinigung",
    label: "www.geoportal.rlp.de",
    href: "https://www.geoportal.rlp.de/map?LAYER[visible]=1&LAYER[querylayer]=1&LAYER[zoom]=1&LAYER[id]=54546",
    description: "Geoportal Rheinland-Pfalz – DLR Bodenordnungsverfahren.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-22",
    category: "Nützliches rund um die Flurbereinigung",
    label: "www.geo4.service24.rlp.de",
    href: "https://maps.rlp.de/",
    description: "Geobasisviewer des LVermGeo.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-23",
    category: "Nützliches rund um die Flurbereinigung",
    label: "www.map1.naturschutz.rlp.de",
    href: "https://geodaten.naturschutz.rlp.de/kartendienste_naturschutz/",
    description: "Landschaftsinformationssystem der Naturschutzverwaltung.",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-24",
    category: "Nützliches rund um die Flurbereinigung",
    label: "www.wetter.rlp.de",
    href: "https://www.wetter.rlp.de/Internet/global/inetcntr.nsf/dlr_web_full.xsp?src=L941ES4AB8&p1=1PJCNH7DKW&p2=IB26DJ6C96&p3=9IQ84WEY3L&p4=XJPZBV4849",
    description: "Agrarmeteorologie Rheinland-Pfalz",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-25",
    category: "Videos Flurbereinigung",
    label: "Flurbereinigung in Rheinland-Pfalz (YouTube)",
    href: "https://www.youtube.com/watch?v=40max86hrCQ",
    description: "",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-26",
    category: "Videos Flurbereinigung",
    label: "Calmont (YouTube)",
    href: "https://www.youtube.com/watch?v=jg550UH1Thc",
    description: "",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-27",
    category: "Videos Flurbereinigung",
    label: "Kaub (YouTube)",
    href: "https://www.youtube.com/watch?v=p447KxCiN7o",
    description: "",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-28",
    category: "Videos Flurbereinigung",
    label: "Limes (YouTube)",
    href: "https://www.youtube.com/watch?v=2yiNgk2VK_k",
    description: "",
    updatedAt: SEED_DATE,
  },
  {
    id: "seed-29",
    category: "Videos Flurbereinigung",
    label: "Ürzig Bildflug Planung (YouTube)",
    href: "https://www.youtube.com/watch?v=tKcDqhMV9Tg",
    description: "",
    updatedAt: SEED_DATE,
  },
];

// Keine Modul-weite Zwischenspeicherung, siehe public-downloads.ts: diese
// Metadaten werden von der Anwendung selbst laufend veraendert.
async function loadLinkItems(): Promise<LinkItem[]> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    await saveLinkItems(DEFAULT_ITEMS);
    return DEFAULT_ITEMS;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as LinkItem[];
}

async function saveLinkItems(items: LinkItem[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(items), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getAllLinkItems(): Promise<LinkItem[]> {
  return loadLinkItems();
}

// Gruppiert nach Kategorie, in der Reihenfolge des ersten Auftretens -
// neue Kategorien landen damit automatisch am Ende, bestehende behalten
// ihre bisherige Position.
export async function getLinksByCategory(): Promise<LinkCategory[]> {
  const items = await loadLinkItems();
  const order: string[] = [];
  const map = new Map<string, LinkItem[]>();
  for (const item of items) {
    if (!map.has(item.category)) {
      map.set(item.category, []);
      order.push(item.category);
    }
    map.get(item.category)!.push(item);
  }
  return order.map((title) => ({ title, items: map.get(title)! }));
}

export async function getLinkCategoryNames(): Promise<string[]> {
  const items = await loadLinkItems();
  return [...new Set(items.map((i) => i.category))];
}

export async function getLinkItem(id: string): Promise<LinkItem | undefined> {
  const items = await loadLinkItems();
  return items.find((i) => i.id === id);
}

export async function addLinkItem(
  category: string,
  label: string,
  href: string,
  description: string,
): Promise<void> {
  const items = await loadLinkItems();
  items.push({
    id: crypto.randomUUID(),
    category,
    label,
    href,
    description,
    updatedAt: new Date().toISOString(),
  });
  await saveLinkItems(items);
}

export async function updateLinkItem(
  id: string,
  category: string,
  label: string,
  href: string,
  description: string,
): Promise<void> {
  const items = await loadLinkItems();
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.category = category;
  item.label = label;
  item.href = href;
  item.description = description;
  item.updatedAt = new Date().toISOString();
  await saveLinkItems(items);
}

export async function removeLinkItem(id: string): Promise<void> {
  const items = await loadLinkItems();
  await saveLinkItems(items.filter((i) => i.id !== id));
}
