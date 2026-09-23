import type { Metadata } from "next";
import Link from "next/link";
import SimpleTable from "@/components/SimpleTable";
import AbonnentSearchSelect from "@/components/AbonnentSearchSelect";
import PersonenSearchTable from "@/components/PersonenSearchTable";
import { listBcAbonnenten } from "@/lib/bc-companies";
import { getAllDownloads, isDownloadActive } from "@/lib/downloads";
import { getPublicDownloadsByCategory, type PublicDownloadCategory } from "@/lib/public-downloads";
import { getAllPersonen, PERSON_PAGES } from "@/lib/personen";
import { getAllSiteContent, SITE_CONTENT_PAGES } from "@/lib/site-content";
import { SATZUNG_TITEL } from "@/lib/satzung-inhalt";

export const metadata: Metadata = { title: "Admin-Dashboard | VTG Rheinland-Pfalz" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

type Tab = "mitglieder" | "website" | "personen" | "ueberuns";

const CATEGORIES: { key: PublicDownloadCategory; label: string; publicHref: string }[] = [
  { key: "satzung-vordrucke", label: "Satzung und Vordrucke", publicHref: "/download-satzung-vordrucke" },
  { key: "fachtagungen", label: "Fachtagungen", publicHref: "/fachtagungen" },
  { key: "sonstiges", label: "Sonstiges", publicHref: "/sonstiges" },
];

function tabHref(tab: Tab): string {
  return `/admin?tab=${tab}`;
}

function tabClass(active: boolean): string {
  return active
    ? "border-b-2 border-vtg-orange px-1 pb-2 text-sm font-medium text-neutral-900"
    : "border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-neutral-500 hover:text-neutral-800";
}

function categoryHref(category: PublicDownloadCategory): string {
  return `/admin?tab=website&category=${category}`;
}

function categoryClass(active: boolean): string {
  return active
    ? "rounded bg-vtg-yellow px-3 py-1.5 text-sm font-medium text-neutral-900"
    : "rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-vtg-orange hover:text-vtg-orange";
}

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>;
}) {
  const { tab: rawTab, category: rawCategory } = await searchParams;
  const tab: Tab =
    rawTab === "website" ? "website" : rawTab === "personen" ? "personen" : rawTab === "ueberuns" ? "ueberuns" : "mitglieder";
  const activeCategory =
    CATEGORIES.find((c) => c.key === rawCategory)?.key ?? CATEGORIES[0].key;

  const abonnenten = await listBcAbonnenten();
  const downloads = await getAllDownloads();
  const publicEntries = tab === "website" ? await getPublicDownloadsByCategory(activeCategory) : [];
  const activeCategoryMeta = CATEGORIES.find((c) => c.key === activeCategory)!;
  const personen = tab === "personen" ? await getAllPersonen() : [];
  const personPageLabels = Object.fromEntries(PERSON_PAGES.map((p) => [p.slug, p.label]));
  const siteContent = tab === "ueberuns" ? await getAllSiteContent() : null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="mb-10 flex gap-6 border-b border-neutral-300">
        <Link href={tabHref("mitglieder")} className={tabClass(tab === "mitglieder")}>
          Mitglieder-Downloads
        </Link>
        <Link href={tabHref("website")} className={tabClass(tab === "website")}>
          Website-Downloads
        </Link>
        <Link href={tabHref("personen")} className={tabClass(tab === "personen")}>
          Personen
        </Link>
        <Link href={tabHref("ueberuns")} className={tabClass(tab === "ueberuns")}>
          Über uns
        </Link>
      </nav>

      {tab === "ueberuns" && siteContent ? (
        <>
          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Texte &amp; Bilder</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Hier lassen sich die Texte (und, wo vorhanden, das Bild) der Unterseiten von „Über uns“ pflegen.
            Absätze werden durch eine Leerzeile getrennt; Zeilen, die mit „- “ beginnen, werden als Liste
            dargestellt.
          </p>
          <SimpleTable
            columns={["Seite", "Zuletzt aktualisiert", ""]}
            rows={SITE_CONTENT_PAGES.map((p) => [
              p.label,
              formatDate(siteContent[p.slug].updatedAt),
              <Link
                key={p.slug}
                href={`/admin/seiteninhalte/${p.slug}/bearbeiten`}
                className="text-sm text-vtg-orange hover:underline"
              >
                Bearbeiten
              </Link>,
            ])}
          />

          <h2 className="mt-12 mb-4 font-heading text-lg font-bold text-neutral-900">Satzung</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Die Paragraphen-Überschriften und ihre Reihenfolge sind fest im Code hinterlegt (eine Änderung wäre
            eine Satzungsänderung). Bearbeitbar ist nur der Wortlaut je Paragraph.
          </p>
          <SimpleTable
            columns={["Paragraph", ""]}
            rows={SATZUNG_TITEL.map((title, i) => [
              title,
              <Link
                key={title}
                href={`/admin/satzung/${i}/bearbeiten`}
                className="text-sm text-vtg-orange hover:underline"
              >
                Bearbeiten
              </Link>,
            ])}
          />
        </>
      ) : tab === "personen" ? (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-neutral-900">Personen verwalten</h2>
            <Link href="/admin/personen/neu" className={primaryButtonClass}>
              + Neue Person hinzufügen
            </Link>
          </div>
          <PersonenSearchTable people={personen} pageLabels={personPageLabels} />
        </>
      ) : tab === "mitglieder" ? (
        <>
          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Neue Datei zuweisen</h2>
          <form
            action="/api/downloads/upload"
            method="POST"
            encType="multipart/form-data"
            className="mb-12 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-neutral-800">
                Benutzer
              </label>
              <AbonnentSearchSelect abonnenten={abonnenten} name="username" />
            </div>
            <div>
              <label htmlFor="file" className="mb-1 block text-sm font-medium text-neutral-800">
                Datei
              </label>
              <input id="file" name="file" type="file" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="expiryDays" className="mb-1 block text-sm font-medium text-neutral-800">
                Gültig für (Tage)
              </label>
              <input
                id="expiryDays"
                name="expiryDays"
                type="number"
                min={1}
                defaultValue={30}
                required
                className={inputClass}
              />
            </div>
            <button type="submit" className={`mt-2 ${primaryButtonClass}`}>
              Hochladen
            </button>
          </form>

          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Zugewiesene Downloads</h2>
          {downloads.length > 0 ? (
            <SimpleTable
              columns={["Benutzer", "Datei", "Hochgeladen", "Läuft ab", "Status", ""]}
              rows={downloads.map((d) => [
                d.username,
                d.filename,
                formatDate(d.uploadedAt),
                formatDate(d.expiresAt),
                isDownloadActive(d) ? "Aktiv" : "Abgelaufen",
                <form key={d.id} action="/api/downloads/delete" method="POST">
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Löschen
                  </button>
                </form>,
              ])}
            />
          ) : (
            <p className="text-base leading-relaxed text-neutral-700">Es sind noch keine Downloads zugewiesen.</p>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link key={c.key} href={categoryHref(c.key)} className={categoryClass(c.key === activeCategory)}>
                  {c.label}
                </Link>
              ))}
            </div>
            <a
              href={activeCategoryMeta.publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-vtg-orange hover:underline"
            >
              Seite ansehen ↗
            </a>
          </div>

          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Neuen Download hinzufügen</h2>
          <form
            action="/api/public-downloads/add"
            method="POST"
            encType="multipart/form-data"
            className="mb-10 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
          >
            <input type="hidden" name="category" value={activeCategory} />
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800">Titel</label>
              <input name="title" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800">Beschreibung (optional)</label>
              <input name="description" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800">Datei</label>
              <input type="file" name="file" required className={inputClass} />
            </div>
            <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
              Hinzufügen
            </button>
          </form>

          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">
            Bestehende Downloads — {activeCategoryMeta.label}
          </h2>
          {publicEntries.length > 0 ? (
            <div className="flex flex-col gap-4">
              {publicEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <form
                    action="/api/public-downloads/update"
                    method="POST"
                    encType="multipart/form-data"
                    className="flex flex-col gap-3"
                  >
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="category" value={activeCategory} />
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Titel</label>
                      <input name="title" defaultValue={entry.title} required className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Beschreibung (optional)</label>
                      <input name="description" defaultValue={entry.description ?? ""} className={inputClass} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-vtg-orange hover:underline">
                        Aktuelle Datei ansehen
                      </a>
                      <span>Aktualisiert am {formatDate(entry.updatedAt)}</span>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Datei ersetzen (optional)</label>
                      <input type="file" name="file" className={inputClass} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button type="submit" className={primaryButtonClass}>
                        Speichern
                      </button>
                    </div>
                  </form>
                  <form action="/api/public-downloads/delete" method="POST" className="mt-2">
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="category" value={activeCategory} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">
                      Löschen
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base leading-relaxed text-neutral-700">
              In dieser Kategorie sind noch keine Downloads hinterlegt.
            </p>
          )}
        </>
      )}
    </section>
  );
}
