// Site-weite Bilder, die nicht zu einer einzelnen Unterseite gehoeren (anders
// als die Bilder in site-content.ts, die je Unterseite gepflegt werden) —
// aktuell nur das Hero-Banner, das auf jeder Seite oben in PageHero.tsx
// erscheint. Gleiches Blob-JSON-Speichermuster wie site-content.ts/
// public-downloads.ts.
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

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
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) {
    await saveSiteImages(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
  const text = await new Response(result.stream).text();
  const stored = JSON.parse(text) as Partial<Record<SiteImageKey, SiteImageEntry>>;
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
  const entries = await loadSiteImages();
  return entries[key] ?? DEFAULT_ENTRIES[key];
}

export async function updateSiteImage(key: SiteImageKey, url: string, blobPathname: string, filename: string): Promise<void> {
  const entries = await loadSiteImages();
  entries[key] = { key, url, blobPathname, filename, updatedAt: new Date().toISOString() };
  await saveSiteImages(entries);
}
