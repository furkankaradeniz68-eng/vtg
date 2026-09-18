// Metadaten fuer die oeffentlichen Download-Listen (Satzung & Vordrucke,
// Fachtagungen, Sonstiges). Frueher waren diese Listen im Quellcode hart
// codiert; jetzt liegen sie in privatem Vercel-Blob-Speicher, damit Admins
// sie ohne Code-Deploy pflegen koennen. Die referenzierten Dateien selbst
// sind entweder bestehende statische Dateien unter /public/downloads (legacy,
// kein blobPathname) oder von Admins hochgeladene, oeffentlich lesbare Blobs
// unter public-downloads/{category}/{id}-{dateiname}.
import { put, del, get } from "@vercel/blob";

const META_PATHNAME = "public-downloads-meta.json";

export type PublicDownloadCategory = "satzung-vordrucke" | "fachtagungen" | "sonstiges";

export type PublicDownloadEntry = {
  id: string;
  category: PublicDownloadCategory;
  title: string;
  description?: string;
  url: string;
  blobPathname?: string;
  filename?: string;
  updatedAt: string;
};

const DEFAULT_ENTRIES: PublicDownloadEntry[] = [
  {
    id: "seed-satzung-1",
    category: "satzung-vordrucke",
    title: "VTG Satzung",
    description: "Die aktuelle Satzung des Verbands der Teilnehmergemeinschaften Rheinland-Pfalz.",
    url: "/downloads/VTG_Satzung.pdf",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-satzung-2",
    category: "satzung-vordrucke",
    title: "VTG Broschüre mit Satzung",
    description: "Informationsbroschüre des VTG inklusive Satzungstext.",
    url: "/downloads/VTG_Broschuere_mit_Satzung.pdf",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-satzung-3",
    category: "satzung-vordrucke",
    title: "Beitrittserklärung",
    description: "Vordruck zur Beitrittserklärung für Teilnehmergemeinschaften.",
    url: "/downloads/Beitrittserklaerung_2018_01.pdf",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-satzung-4",
    category: "satzung-vordrucke",
    title: "Flyer Beitragssätze",
    description: "Übersicht der aktuellen Beitragssätze.",
    url: "/downloads/Flyer_Beitragssätze_Aktuell.pdf",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2025",
    category: "fachtagungen",
    title: "Fachtagung 2025 Klimawandel Herausforderung für Landwirtschaft und Landentwicklung",
    url: "/downloads/fachtagungen/VTG_Satzung.pdf",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2024",
    category: "fachtagungen",
    title: "Fachtagung 2024 Ländliche Infrastruktur und Produktionsintegrierte Kompensationsmaßnahmen",
    url: "/downloads/fachtagungen/Mitgliederversammlung_2024.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2023",
    category: "fachtagungen",
    title: "Fachtagung 2023 Förderung der ländlichen Entwicklung in Rheinland-Pfalz",
    url: "/downloads/fachtagungen/Mitgliederversammlung_2023.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2022",
    category: "fachtagungen",
    title: "JUBILÄUMSVERANSTALTUNG 2022",
    url: "/downloads/fachtagungen/VTG_Jubilaeumsveranstaltung_mit_Mitgliederversammlung.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2019",
    category: "fachtagungen",
    title: "Fachtagung 2019 Einsatz von Digitaltechnik zur Entwicklung des ländlichen Raumes",
    url: "/downloads/fachtagungen/Fachtagung_2019_Einsatz_von_Digitaltechnik_zur_Entwicklung_des_ländlichen_Raumes.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2018",
    category: "fachtagungen",
    title: "Fachtagung 2018 Landentwicklung zur Reduzierung des Flächenverbrauchs",
    url: "/downloads/fachtagungen/Fachtagung_2018_Landentwicklung_zur_Reduzierung_des_Flaechenverbrauchs.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2017",
    category: "fachtagungen",
    title: "Fachtagung 2017 Landentwicklung und Infrastruktur",
    url: "/downloads/fachtagungen/Fachtagung_2017_Landentwicklung_und_Infrastruktur.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2016",
    category: "fachtagungen",
    title: "Fachtagung 2016 Visionen der Landentwicklung in Deutschland",
    url: "/downloads/fachtagungen/Fachtagung_2016_Visionen_der_Landentwicklung_in_Deutschland.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2015",
    category: "fachtagungen",
    title: "Fachtagung 2015 Weinbergsflurbereinigung",
    url: "/downloads/fachtagungen/Fachtagung_2015_Weinbergsflurbereinigung.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2014",
    category: "fachtagungen",
    title: "Fachtagung 2014 Zusammenwirken regionaler Energieentwicklung und Landentwicklung",
    url: "/downloads/fachtagungen/Fachtagung_2014_Zusammenwirken_regionaler_Energieentwicklung_und_Landentwicklung.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2013",
    category: "fachtagungen",
    title: "Fachtagung 2013 Dorfflurbereinigung - Chance für die Innenentwicklung der Dörfer",
    url: "/downloads/fachtagungen/Fachtagung_2013_Dorfflurbereinigung_-_Chance_für_die_Innenentwicklung_der_Dörfer.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-fachtagung-2012",
    category: "fachtagungen",
    title: "Fachtagung 2012 Bodenordnung und Wasserwirtschaft",
    url: "/downloads/fachtagungen/Fachtagung_2012_Bodenordnung_und_Wasserwirtschaft.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-sonstiges-1",
    category: "sonstiges",
    title: "Fortbildung für TG-Vorstände 14./15.11.2019 Neustadt",
    url: "/downloads/Fortbildung_TG_Vorstände_2019.zip",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-sonstiges-2",
    category: "sonstiges",
    title: '"Wege in die Zukunft" Neue Anforderungen an ländliche Infrastrukturen',
    url: "/downloads/Wege_in_die_Zukunft_Sonderheft_der_DLKG.pdf",
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "seed-sonstiges-3",
    category: "sonstiges",
    title: "BTG Flyer",
    url: "/downloads/BTG Flyer - Flurbereinigung schafft Zukunft.pdf",
    updatedAt: new Date(0).toISOString(),
  },
];

// Keine Modul-weite Zwischenspeicherung, siehe downloads.ts: diese Metadaten
// werden von der Anwendung selbst laufend veraendert.
async function loadPublicDownloads(): Promise<PublicDownloadEntry[]> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    await savePublicDownloads(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as PublicDownloadEntry[];
}

async function savePublicDownloads(entries: PublicDownloadEntry[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getPublicDownloadsByCategory(category: PublicDownloadCategory): Promise<PublicDownloadEntry[]> {
  const entries = await loadPublicDownloads();
  return entries.filter((e) => e.category === category);
}

export async function getAllPublicDownloads(): Promise<PublicDownloadEntry[]> {
  return loadPublicDownloads();
}

export async function getPublicDownloadById(id: string): Promise<PublicDownloadEntry | undefined> {
  const entries = await loadPublicDownloads();
  return entries.find((e) => e.id === id);
}

export async function addPublicDownload(entry: PublicDownloadEntry): Promise<void> {
  const entries = await loadPublicDownloads();
  entries.unshift(entry);
  await savePublicDownloads(entries);
}

export async function updatePublicDownload(
  id: string,
  changes: { title: string; description?: string; url?: string; blobPathname?: string; filename?: string },
): Promise<void> {
  const entries = await loadPublicDownloads();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;

  if (changes.url && entry.blobPathname) {
    await del(entry.blobPathname).catch(() => {});
  }

  entry.title = changes.title;
  entry.description = changes.description;
  if (changes.url) {
    entry.url = changes.url;
    entry.blobPathname = changes.blobPathname;
    entry.filename = changes.filename;
  }
  entry.updatedAt = new Date().toISOString();

  await savePublicDownloads(entries);
}

export async function removePublicDownload(id: string): Promise<void> {
  const entries = await loadPublicDownloads();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  if (entry.blobPathname) {
    await del(entry.blobPathname).catch(() => {});
  }
  await savePublicDownloads(entries.filter((e) => e.id !== id));
}
