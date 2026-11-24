// Site-weite Bilder, die nicht zu einer einzelnen Unterseite gehoeren (anders
// als die Bilder in site-content.ts, die je Unterseite gepflegt werden) —
// aktuell nur das Hero-Banner, das auf jeder Seite oben in PageHero.tsx
// erscheint. Gleiches Blob-JSON-Speichermuster wie site-content.ts/
// public-downloads.ts.
import { put } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { ladeOderLegeAn, zurAnzeige } from "@/lib/blob-json";

const META_PATHNAME = "site-images-meta.json";

export type SiteImageKey = "hero";

export type SiteImageEntry = {
  key: SiteImageKey;
  url: string;
  blobPathname?: string;
  filename?: string;
  updatedAt: string;
};

const SEED_DATE = new Date(0).toISOString();

const DEFAULT_ENTRIES: Record<SiteImageKey, SiteImageEntry> = {
  hero: {
    key: "hero",
    url: "/images/hero.jpg",
    updatedAt: SEED_DATE,
  },
};

async function loadSiteImages(): Promise<Record<SiteImageKey, SiteImageEntry>> {
  const stored = await ladeOderLegeAn<Partial<Record<SiteImageKey, SiteImageEntry>>>(META_PATHNAME, DEFAULT_ENTRIES);
  return { ...DEFAULT_ENTRIES, ...stored };
}

async function saveSiteImages(entries: Record<SiteImageKey, SiteImageEntry>): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getSiteImage(key: SiteImageKey): Promise<SiteImageEntry> {
  const entries = await zurAnzeige(loadSiteImages, DEFAULT_ENTRIES);
  return entries[key] ?? DEFAULT_ENTRIES[key];
}

export async function updateSiteImage(key: SiteImageKey, url: string, blobPathname: string, filename: string): Promise<void> {
  const entries = await loadSiteImages();
  entries[key] = { key, url, blobPathname, filename, updatedAt: new Date().toISOString() };
  await saveSiteImages(entries);
}
