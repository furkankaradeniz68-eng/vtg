import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SimpleTable from "@/components/SimpleTable";
import AbonnentSearchSelect from "@/components/AbonnentSearchSelect";
import PersonenSearchTable from "@/components/PersonenSearchTable";
import { listBcAbonnenten, getLastSync, formatDateTime } from "@/lib/bc-companies";
import { getAllDownloads, isDownloadActive } from "@/lib/downloads";
import { getPublicDownloadsByCategory, type PublicDownloadCategory } from "@/lib/public-downloads";
import { getAllPersonen, PERSON_PAGES } from "@/lib/personen";
import { getAllSiteContent, SITE_CONTENT_PAGES } from "@/lib/site-content";
import { getKontenplan } from "@/lib/kontenplan";
import { getEnergiekostenYears } from "@/lib/energiekostenzuschlag";
import { getUmlageRows } from "@/lib/umlage";
import { getStellenausschreibungen } from "@/lib/stellenausschreibung";
import { getSiteImage } from "@/lib/site-images";
import { getUserStats, getRecentEvents } from "@/lib/analytics";

export const metadata: Metadata = { title: "Admin-Dashboard | VTG Rheinland-Pfalz" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

function formatDateTimeShort(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  dlr: "DLR",
  abonnent: "Mandant",
  bauleiter: "Bauleiter",
};

type Tab =
  | "mitglieder"
  | "mitgliederbereich"
  | "website"
  | "personen"
  | "seiteninhalte"
  | "analytics";

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
    rawTab === "website"
      ? "website"
      : rawTab === "personen"
        ? "personen"
        : rawTab === "seiteninhalte"
          ? "seiteninhalte"
          : rawTab === "mitgliederbereich"
            ? "mitgliederbereich"
            : rawTab === "analytics"
              ? "analytics"
              : "mitglieder";
  const activeCategory =
    CATEGORIES.find((c) => c.key === rawCategory)?.key ?? CATEGORIES[0].key;

  const abonnenten = await listBcAbonnenten();
  const downloads = await getAllDownloads();
  const lastSync = await getLastSync();
  const publicEntries = tab === "website" ? await getPublicDownloadsByCategory(activeCategory) : [];
  const activeCategoryMeta = CATEGORIES.find((c) => c.key === activeCategory)!;
  const personen = tab === "personen" ? await getAllPersonen() : [];
  const personPageLabels = Object.fromEntries(PERSON_PAGES.map((p) => [p.slug, p.label]));
  const siteContent = tab === "seiteninhalte" ? await getAllSiteContent() : null;
  const stellenausschreibungen = tab === "seiteninhalte" ? await getStellenausschreibungen() : [];
  const heroImage = tab === "seiteninhalte" ? await getSiteImage("hero") : null;
  const kontenplan = tab === "mitgliederbereich" ? await getKontenplan() : null;
  const energiekostenYears = tab === "mitgliederbereich" ? await getEnergiekostenYears() : [];
  const umlageRows = tab === "mitgliederbereich" ? await getUmlageRows() : [];
  const zinsMeta = SITE_CONTENT_PAGES.find((p) => p.slug === "zins")!;
  const umlageTextMeta = SITE_CONTENT_PAGES.find((p) => p.slug === "umlage")!;
  const userStats = tab === "analytics" ? await getUserStats() : [];
  const recentEvents = tab === "analytics" ? await getRecentEvents(50) : [];

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="mb-6 text-sm text-neutral-600">
        Letzter erfolgreicher BC-Sync:{" "}
        {lastSync ? `${formatDateTime(lastSync.syncedAt)} Uhr (${lastSync.companies} Mitglieder)` : "noch nicht ausgeführt"}
      </p>

      <nav className="mb-10 flex flex-wrap gap-6 border-b border-neutral-300">
        <Link href={tabHref("mitglieder")} className={tabClass(tab === "mitglieder")}>
          Mitglieder-Downloads
        </Link>
        <Link href={tabHref("mitgliederbereich")} className={tabClass(tab === "mitgliederbereich")}>
          Mitgliederbereich
        </Link>
        <Link href={tabHref("website")} className={tabClass(tab === "website")}>
          Website-Downloads
        </Link>
        <Link href={tabHref("personen")} className={tabClass(tab === "personen")}>
          Personen
        </Link>
        <Link href={tabHref("seiteninhalte")} className={tabClass(tab === "seiteninhalte")}>
          Öffentliche Seiteninhalte
        </Link>
        <Link href={tabHref("analytics")} className={tabClass(tab === "analytics")}>
          Analytics
        </Link>
      </nav>

      {tab === "seiteninhalte" && siteContent && heroImage ? (
        <>
          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Texte &amp; Bilder</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Hier lassen sich die Texte (und, wo vorhanden, das Bild) der Unterseiten von „Über uns“ pflegen.
            Absätze werden durch eine Leerzeile getrennt; Zeilen, die mit „- “ beginnen, werden als Liste
            dargestellt.
          </p>
          <SimpleTable
            columns={["Seite", "Zuletzt aktualisiert", ""]}
            rows={SITE_CONTENT_PAGES.filter((p) => p.section !== "mitgliederbereich").map((p) => [
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

          <div className="mt-12 mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-neutral-900">Stellenausschreibungen</h2>
            <Link href="/admin/stellenausschreibung/neu" className={primaryButtonClass}>
              + Neue Stelle hinzufügen
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Titel, Beschreibungstext und optionales PDF je ausgeschriebener Stelle.
          </p>
          {stellenausschreibungen.length > 0 ? (
            <div className="mb-12 flex flex-col gap-3">
              {stellenausschreibungen.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{entry.title}</p>
                    <p className="text-xs text-neutral-500">
                      Zuletzt aktualisiert {formatDate(entry.updatedAt)}
                      {entry.pdfFilename ? ` · PDF: ${entry.pdfFilename}` : " · kein PDF hinterlegt"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/stellenausschreibung/${entry.id}/bearbeiten`}
                      className="text-sm text-vtg-orange hover:underline"
                    >
                      Bearbeiten
                    </Link>
                    <form action="/api/stellenausschreibung/delete" method="POST">
                      <input type="hidden" name="id" value={entry.id} />
                      <button type="submit" className="text-sm text-red-600 hover:underline">
                        Löschen
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-12 text-base leading-relaxed text-neutral-700">
              Es sind noch keine Stellenausschreibungen hinterlegt.
            </p>
          )}

          <h2 className="mt-12 mb-4 font-heading text-lg font-bold text-neutral-900">Hero-Bild</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Das Bild, das oben auf jeder Seite im Kopfbereich erscheint.
          </p>
          <form
            action="/api/site-images/update"
            method="POST"
            encType="multipart/form-data"
            className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end"
          >
            <input type="hidden" name="key" value="hero" />
            <Image
              src={heroImage.url}
              alt="Aktuelles Hero-Bild"
              width={160}
              height={90}
              className="h-20 w-36 rounded object-cover"
            />
            <div className="flex-1">
              <label htmlFor="image" className="mb-1 block text-sm font-medium text-neutral-800">
                Neues Bild hochladen
              </label>
              <input id="image" name="image" type="file" accept="image/*" required className={inputClass} />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Speichern
            </button>
          </form>
        </>
      ) : tab === "mitgliederbereich" && kontenplan ? (
        <>
          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Kontenplan-PDF</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Die im Mitgliederbereich verlinkte Kontenplan-Datei.
          </p>
          <form
            action="/api/kontenplan/update"
            method="POST"
            encType="multipart/form-data"
            className="mb-12 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <p className="mb-1 text-sm font-medium text-neutral-800">Aktuelle Datei</p>
              <p className="text-xs text-neutral-500">
                {kontenplan.filename} · zuletzt aktualisiert {formatDate(kontenplan.updatedAt)}
              </p>
            </div>
            <div className="flex-1">
              <label htmlFor="file" className="mb-1 block text-sm font-medium text-neutral-800">
                Datei ersetzen
              </label>
              <input id="file" name="file" type="file" accept="application/pdf" required className={inputClass} />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Speichern
            </button>
          </form>

          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Energiekostenzuschlag</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Jahresweise Tabellen mit Durchschnittspreis und Zuschlag-Prozentsatz je Monat.
          </p>
          <form
            action="/api/energiekostenzuschlag/add-year"
            method="POST"
            className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div>
              <label htmlFor="year" className="mb-1 block text-sm font-medium text-neutral-800">
                Neues Jahr
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min={2000}
                max={2100}
                defaultValue={new Date().getFullYear() + 1}
                required
                className={inputClass}
              />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Jahr hinzufügen
            </button>
          </form>
          {energiekostenYears.length > 0 ? (
            <SimpleTable
              columns={["Jahr", "Zuletzt aktualisiert", "", ""]}
              rows={energiekostenYears.map((y) => [
                y.year,
                formatDate(y.updatedAt),
                <Link
                  key={`edit-${y.year}`}
                  href={`/admin/energiekostenzuschlag/${y.year}/bearbeiten`}
                  className="text-sm text-vtg-orange hover:underline"
                >
                  Bearbeiten
                </Link>,
                <form key={`delete-${y.year}`} action="/api/energiekostenzuschlag/delete-year" method="POST">
                  <input type="hidden" name="year" value={y.year} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Löschen
                  </button>
                </form>,
              ])}
            />
          ) : (
            <p className="text-base leading-relaxed text-neutral-700">Es sind noch keine Jahre angelegt.</p>
          )}

          <h2 className="mt-12 mb-4 font-heading text-lg font-bold text-neutral-900">Zins</h2>
          <div className="mb-12 flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-sm text-neutral-600">Begleittext der Zins-Seite im Mitgliederbereich.</p>
            <Link href={`/admin/seiteninhalte/${zinsMeta.slug}/bearbeiten`} className="text-sm text-vtg-orange hover:underline">
              Text bearbeiten
            </Link>
          </div>

          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Umlage</h2>
          <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-sm text-neutral-600">Begleittext der Umlage-Seite im Mitgliederbereich.</p>
            <Link
              href={`/admin/seiteninhalte/${umlageTextMeta.slug}/bearbeiten`}
              className="text-sm text-vtg-orange hover:underline"
            >
              Text bearbeiten
            </Link>
          </div>

          <form
            action="/api/umlage/add"
            method="POST"
            className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div>
              <label htmlFor="umlage-year" className="mb-1 block text-sm font-medium text-neutral-800">
                Jahr
              </label>
              <input id="umlage-year" name="year" type="number" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="umlage-percent" className="mb-1 block text-sm font-medium text-neutral-800">
                Umlage
              </label>
              <input id="umlage-percent" name="percent" placeholder="13%" required className={inputClass} />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Zeile hinzufügen
            </button>
          </form>

          {umlageRows.length > 0 ? (
            <div className="flex flex-col gap-3">
              {umlageRows.map((row) => (
                <div key={row.id} className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
                  <form action="/api/umlage/update" method="POST" className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="id" value={row.id} />
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Jahr</label>
                      <input name="year" type="number" defaultValue={row.year} required className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">Umlage</label>
                      <input name="percent" defaultValue={row.percent} required className={inputClass} />
                    </div>
                    <button type="submit" className={primaryButtonClass}>
                      Speichern
                    </button>
                  </form>
                  <form action="/api/umlage/delete" method="POST">
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">
                      Löschen
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base leading-relaxed text-neutral-700">Es sind noch keine Umlage-Zeilen hinterlegt.</p>
          )}
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
              columns={["Benutzer", "Datei", "Hochgeladen", "Läuft ab", "Status", "Downloads", ""]}
              rows={downloads.map((d) => [
                d.username,
                d.filename,
                formatDate(d.uploadedAt),
                formatDate(d.expiresAt),
                isDownloadActive(d) ? "Aktiv" : "Abgelaufen",
                d.downloadCount > 0 ? `${d.downloadCount}× (zuletzt ${formatDate(d.lastDownloadedAt!)})` : "0",
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
      ) : tab === "analytics" ? (
        <>
          <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Nutzer-Übersicht</h2>
          <p className="mb-6 max-w-2xl text-sm text-neutral-600">
            Logins und Downloads je Benutzer seit Einführung des Analytics-Trackings. Erfasst werden Logins sowie
            Downloads aus dem Mitgliederbereich (zugewiesene Dateien, Finanzbericht-PDFs, Kontenplan). Statische
            Datei-Links ohne eigene API-Route (z. B. TG-Einzeldaten-ZIP) lassen sich technisch nicht zuordnen.
          </p>
          {userStats.length > 0 ? (
            <SimpleTable
              columns={["Benutzer", "Rolle", "Logins", "Letzter Login", "Downloads", "Letzter Download"]}
              rows={userStats.map((u) => [
                u.username,
                ROLE_LABELS[u.role] ?? u.role,
                u.loginCount,
                u.lastLoginAt ? formatDateTimeShort(u.lastLoginAt) : "–",
                u.downloadCount,
                u.lastDownloadAt ? formatDateTimeShort(u.lastDownloadAt) : "–",
              ])}
            />
          ) : (
            <p className="mb-12 text-base leading-relaxed text-neutral-700">
              Es liegen noch keine Analytics-Daten vor.
            </p>
          )}

          <h2 className="mt-12 mb-4 font-heading text-lg font-bold text-neutral-900">Letzte Aktivität</h2>
          {recentEvents.length > 0 ? (
            <SimpleTable
              columns={["Zeitpunkt", "Benutzer", "Rolle", "Aktion", "Details"]}
              rows={recentEvents.map((e) => [
                formatDateTimeShort(e.at),
                e.username,
                ROLE_LABELS[e.role] ?? e.role,
                e.type === "login" ? "Login" : "Download",
                e.label ?? "–",
              ])}
            />
          ) : (
            <p className="text-base leading-relaxed text-neutral-700">Es liegen noch keine Ereignisse vor.</p>
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
