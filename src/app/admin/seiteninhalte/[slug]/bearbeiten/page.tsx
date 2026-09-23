import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteContent, siteContentLabel, SITE_CONTENT_PAGES, type SiteContentSlug } from "@/lib/site-content";

export const metadata: Metadata = { title: "Seiteninhalt bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

const SLUGS = SITE_CONTENT_PAGES.map((p) => p.slug);

export default async function SeiteninhaltBearbeitenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as SiteContentSlug)) notFound();

  const pageMeta = SITE_CONTENT_PAGES.find((p) => p.slug === slug)!;
  const content = await getSiteContent(slug as SiteContentSlug);

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=ueberuns" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">
        {siteContentLabel(slug)} bearbeiten
      </h1>

      {pageMeta.hasImage && content.image && (
        <Image
          src={content.image}
          alt=""
          width={300}
          height={200}
          className="mb-4 h-auto w-40 rounded"
        />
      )}

      <form
        action="/api/site-content/update"
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="slug" value={slug} />
        <div>
          <label htmlFor="body" className={labelClass}>Text</label>
          <textarea
            id="body"
            name="body"
            required
            defaultValue={content.body}
            rows={18}
            className={`${inputClass} font-mono`}
          />
          <p className="mt-1 text-xs text-neutral-500">
            Absätze durch eine Leerzeile trennen. Zeilen, die mit „- “ beginnen, werden als Liste dargestellt
            (dazu müssen alle Zeilen eines Absatzes mit „- “ beginnen).
          </p>
        </div>
        {pageMeta.hasImage && (
          <div>
            <label htmlFor="image" className={labelClass}>Bild ersetzen (optional)</label>
            <input id="image" name="image" type="file" accept="image/*" className={inputClass} />
            {content.image && (
              <label className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" name="removeImage" />
                Aktuelles Bild entfernen
              </label>
            )}
          </div>
        )}
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>
    </section>
  );
}
