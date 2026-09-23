// Editierbare Text-/Bildinhalte der "Ueber uns"-Unterseiten (Personen-Listen
// laufen weiterhin separat ueber personen.ts, die Satzungsparagraphen ueber
// satzung-inhalt.ts). Bewusst einfach gehalten: ein Freitext-Feld (mit
// Absaetzen) plus optionalem Bild pro Seite, analog zum Blob-Speicher-Muster
// aus personen.ts/public-downloads.ts. Vorher fest im Code stehende Listen
// und interne Verlinkungen sind jetzt Teil des Freitexts und nicht mehr
// separat verlinkt/aufgezaehlt -- das ist eine bewusste Vereinfachung, damit
// Admins die Texte ohne Code-Deploy pflegen koennen (Entscheidung vom
// 2026-09-23).
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const META_PATHNAME = "site-content-meta.json";

export type SiteContentSlug =
  | "ueberblick"
  | "praesident"
  | "vorstand"
  | "geschaeftsfuehrer"
  | "bauabwicklung"
  | "kassen-und-buchfuehrung"
  | "sonstige-aufgaben"
  | "finanzierung";

export const SITE_CONTENT_PAGES: { slug: SiteContentSlug; label: string; hasImage: boolean }[] = [
  { slug: "ueberblick", label: "Überblick", hasImage: false },
  { slug: "praesident", label: "Präsident", hasImage: false },
  { slug: "vorstand", label: "Vorstand", hasImage: false },
  { slug: "geschaeftsfuehrer", label: "Geschäftsführer", hasImage: false },
  { slug: "bauabwicklung", label: "Bauabwicklung", hasImage: true },
  { slug: "kassen-und-buchfuehrung", label: "Kassen- und Buchführung", hasImage: true },
  { slug: "sonstige-aufgaben", label: "Sonstige Aufgaben", hasImage: true },
  { slug: "finanzierung", label: "Finanzierung", hasImage: false },
];

export function siteContentLabel(slug: string): string {
  return SITE_CONTENT_PAGES.find((p) => p.slug === slug)?.label ?? slug;
}

export type SiteContentEntry = {
  slug: SiteContentSlug;
  body: string;
  image?: string;
  blobPathname?: string;
  updatedAt: string;
};

const SEED_DATE = new Date(0).toISOString();

const DEFAULT_ENTRIES: Record<SiteContentSlug, SiteContentEntry> = {
  ueberblick: {
    slug: "ueberblick",
    body: `Der Verband der Teilnehmergemeinschaften (VTG) ist ein Zusammenschluss der Teilnehmergemeinschaften von Bodenordnungsverfahren (Mitglieder) im Lande Rheinland-Pfalz. Rechtsgrundlage sind die §§ 26a-f des Flurbereinigungsgesetzes (FlurbG). Der VTG hat danach wie seine Mitglieder die Rechtsform der Körperschaft des öffentlichen Rechts. Er verwaltet sich im Rahmen der Gesetze und seiner Satzung selbst. Der VTG dient der gemeinsamen Durchführung von Aufgaben, die seinen Mitgliedern nach § 18 Flurbereinigungsgesetz obliegen. Er nimmt danach in den Flurbereinigungsverfahren des Landes Rheinland-Pfalz vor allem folgende Aufgaben für seine Mitglieder wahr:

- Bauoberleitung (Beratung, Planung, Ausschreibung, Abrechnung und Dokumentation)
- Bauausführung zur Herstellung und Unterhaltung der gemeinschaftlichen Anlagen
- Vorhalten von Bauhöfen für Eigenregiearbeiten im Tiefbaubereich
- Leistung und Vorfinanzierung aller Zahlungen über ein zentrales Verbundkonto
- Forderung der Hebungsbeiträge und Ausgleichszahlungen bei den Grundstückseigentümern
- Anforderungen von Zuschüssen bei den Zuwendungsgebern einschließlich Dokumentation und Verwendungsnachweis
- Mitgliedbezogene zentrale Buchhaltung mit Verwendungsnachweis
- Information und Weiterbildungsangebote
- Dialog mit Politik und Verbänden

Sitz und Geschäftsstelle des VTG ist in 67433 Neustadt/Weinstrasse, Exterstrasse 4. Bei den Dienstleistungszentren Ländlicher Raum (DLR) in Bernkastel-Kues, Kaiserslautern, Mayen, Neustadt, Simmern und Montabaur sind Aussenstellen des VTG eingerichtet. Die DLR in Bitburg und Trier werden von der Aussenstelle Prüm und das DLR in Bad Kreuznach von der Aussenstelle in Simmern aus mitbetreut.`,
    updatedAt: SEED_DATE,
  },
  praesident: {
    slug: "praesident",
    body: `Der ehrenamtliche Präsident und dessen Stellvertreter werden vom Vorstand aus seiner Mitte auf 5 Jahre gewählt. Wiederwahl ist möglich. Der Präsident

- vertritt den VTG gerichtlich und außergerichtlich
- leitet die Mitgliederversammlungen und die Vorstandssitzungen`,
    updatedAt: SEED_DATE,
  },
  vorstand: {
    slug: "vorstand",
    body: `Der ehrenamtliche Vorstand wird aus den Reihen der Teilnehmergemeinschaften auf 5 Jahre gewählt. Er besteht aus 9 Mitgliedern. Jedes Vorstandsmitglied hat einen persönlichen Stellvertreter. Der Vorstand stellt den Jahresabschluss und den Wirtschaftsplan auf und beschließt insbesondere über

- die Festsetzung der Beitragssätze
- die Aufnahme neuer Mitglieder
- die Bestellung und Entlassung des Geschäftsführers und seines Stellvertreters`,
    updatedAt: SEED_DATE,
  },
  geschaeftsfuehrer: {
    slug: "geschaeftsfuehrer",
    body: `Der hauptamtliche Geschäftsführer wird vom Vorstand mit Zustimmung der obersten Flurbereinigungsbehörde bestellt.

Der Geschäftsführer
- sorgt für den Vollzug der Beschlüsse der Verbandsorgane
- erledigt die laufenden Geschäfte in eigener Zuständigkeit
- ist bevollmächtigt zum Abschluss von Verträgen
- ist Dienstvorgesetzter der Beschäftigten des Verbands
- nimmt an den Sitzungen der anderen Verbandsorgane ohne Stimmrecht teil`,
    updatedAt: SEED_DATE,
  },
  bauabwicklung: {
    slug: "bauabwicklung",
    body: `- Bauliche Beratung und Betreuung der Mitglieder während des gesamten Flurbereinigungsverfahrens
- Bauausführung mit eigenem Personal, Maschinen und Geräten (Eigenregie)
- Bauoberleitung
- Erstellung von Ausschreibungsunterlagen
- Vorbereitung der Vergabe
- Prüfung der Rechnungen von Fremdfirmen
- Überwachung der Baufinanzierung
- Abrechnung

Der VTG führt für seine Mitglieder Bau-, Landespflege- und Vermessungsarbeiten selbst durch, sogenannte Eigenregiearbeiten.

Landesweit stehen für diese Eigenregiearbeiten etwa 100 Baufacharbeiter, Messgehilfen, Maschinenführer und Bauaufsichtspersonal zur Verfügung. Der Maschinen- und Gerätepark weist über 60 selbstfahrende Arbeitsmaschinen und 140 Baugeräte auf, die in 9 Außenstellen landesweit verteilt sind. Durch die langjährige Erfahrung der Arbeiter und Maschinenführer des VTG, die Spezialisierung auf Flurbereinigungsarbeiten und die Gewährleistung der gesetzlich ermöglichten Eigenleistung durch Mithilfe der Grundstückseigentümer sind die Eigenregiearbeiten des VTG sehr nachgefragt.

Vorteil für die Teilnehmergemeinschaft ist auch, dass bei Durchführung dieser Eigenregiearbeiten weder Umsatzsteuer anfällt noch Gewinne erzielt werden dürfen. Durch die Bündelung dieser Aufgaben in einem landesweit tätigen Betrieb wird ein hohes Maß an Wirtschaftlichkeit erreicht. Die Beitragssätze (Stundensätze) können dadurch zu Gunsten der Mitglieder sehr niedrig kalkuliert werden. Mehr Informationen zu den Beitragssätzen finden Sie im Mitgliederbereich.

Der VTG kann nicht alle im Verfahren anfallenden Arbeiten selbst ausführen. Entweder, weil in Spitzenzeiten die Kapazitäten nicht ausreichen, oder weil sein Maschinenpark hierfür nicht ausgelegt ist, wie z. B. bei der bituminösen Wegebefestigung. Es kann aber auch einfach sein, dass der Vorstand der Teilnehmergemeinschaft aus ganz spezifischen Gründen den Eigenregiebetrieb nicht einsetzen will. In diesen Fällen muss mit Fremdfirmen gearbeitet werden.

Der Vorstand der Teilnehmergemeinschaft entscheidet selbst, ob er den Ausbau und die Unterhaltung der gemeinschaftlichen Anlagen im Selbstbetrieb (Eigenregie) durch den VTG herstellen lassen will oder die erforderlichen Arbeiten an gewerbliche Unternehmen vergeben werden sollen.`,
    image: "/images/ueberblick/Ausbau.jpg",
    updatedAt: SEED_DATE,
  },
  "kassen-und-buchfuehrung": {
    slug: "kassen-und-buchfuehrung",
    body: `- Sicherstellung der Liquidität durch Einrichtung eines Verbundkontos mit Kontokorrent-Unterkonten, Beantragung und Abruf der öffentlichen Mittel, Hebung der Flurbereinigungsbeiträge bei den Teilnehmern mit Mahnwesen sowie Aufnahme von Darlehen und Weitergabe an Mitglieder
- Kaufmännische Buchführung
- Abwicklung des Zahlungsverkehrs
- Finanzierungsüberwachung
- Aufstellung von Verwendungsnachweisen für den Zuwendungsgeber

Die aktuellen Sollzinssätze bei erforderlicher Vorfinanzierung, weil z. B. öffentliche Mittel oder Flurbereinigungsbeiträge fehlen, finden Sie im Mitgliederbereich.`,
    image: "/images/ueberblick/Verwaltung.jpg",
    updatedAt: SEED_DATE,
  },
  "sonstige-aufgaben": {
    slug: "sonstige-aufgaben",
    body: `- Fortbildung der Mitglieder
- Beratung und Betreuung der Mitglieder (keine Rechtsberatung)
- Abschluss einer Haftpflichtversicherung bei Mitgliedschaft
- Förderung des Informationsaustauschs der Mitglieder
- Vertretung der Interessen der Mitglieder im politischen Raum
- Stellung und Abrechnung von Aushilfskräften
- Sicherstellung einfacher, einheitlicher und transparenter Verwaltungsabläufe
- Vertretung in Ausschüssen

- Übernahme von Vorarbeiten, insbesondere agrarstrukturelle Vorplanungen
- Durchführung von Folgemassnahmen beim freiwilligen Landtausch`,
    image: "/images/ueberblick/Fortbildung.jpg",
    updatedAt: SEED_DATE,
  },
  finanzierung: {
    slug: "finanzierung",
    body: `Die Finanzierung des VTG erfolgt satzungsgemäß über
- die jährliche Umlage (§ 16 Abs. 1) und
- die Beiträge aus dem Eigenregiebetrieb (§ 16 Abs. 2 und 3)

Mit der Umlage werden diejenigen Kosten finanziert, die für die Durchführung der Kassengeschäfte und des Bauwesens erforderlich sind und nicht über Beitragseinnahmen (Stundensätze) des Eigenregiebetriebes abgedeckt sind. Die Höhe der Umlage wird jährlich von der Mitgliederversammlung festgelegt.

Die Leistungen der Arbeiter und Maschinen aus dem Eigenregiebetrieb werden über Beiträge abgerechnet, und zwar nach tatsächlicher Inanspruchnahme. Es handelt sich dabei in der Regel um Stunden- oder Tagessätze, die vom Vorstand zu Jahresbeginn festgelegt werden. Bei den Stundensätzen für das Personal sind Reisekosten, Rüstzeiten und Aufwendungen für Dienstfahrzeuge in den Preisen enthalten. Es werden also nur die tatsächlichen Einsatzstunden berechnet.

Auf Umlage und Beiträge kann der Verband satzungsgemäß Vorschüsse erheben.`,
    updatedAt: SEED_DATE,
  },
};

async function loadSiteContent(): Promise<Record<SiteContentSlug, SiteContentEntry>> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) {
    await saveSiteContent(DEFAULT_ENTRIES);
    return DEFAULT_ENTRIES;
  }
  const text = await new Response(result.stream).text();
  const stored = JSON.parse(text) as Partial<Record<SiteContentSlug, SiteContentEntry>>;
  // Fehlende Seiten (z.B. neu hinzugefuegt) mit Default auffuellen, damit
  // getSiteContent() fuer alle SITE_CONTENT_PAGES immer einen Eintrag liefert.
  return { ...DEFAULT_ENTRIES, ...stored };
}

async function saveSiteContent(entries: Record<SiteContentSlug, SiteContentEntry>): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getAllSiteContent(): Promise<Record<SiteContentSlug, SiteContentEntry>> {
  return loadSiteContent();
}

export async function getSiteContent(slug: SiteContentSlug): Promise<SiteContentEntry> {
  const entries = await loadSiteContent();
  return entries[slug] ?? DEFAULT_ENTRIES[slug];
}

export type SiteContentChanges = {
  body: string;
  image?: string;
  blobPathname?: string;
  replaceImage: boolean;
};

export async function updateSiteContent(slug: SiteContentSlug, changes: SiteContentChanges): Promise<void> {
  const entries = await loadSiteContent();
  const entry: SiteContentEntry = entries[slug] ?? { slug, body: "", updatedAt: SEED_DATE };

  entry.body = changes.body;
  if (changes.replaceImage) {
    entry.image = changes.image;
    entry.blobPathname = changes.blobPathname;
  }
  entry.updatedAt = new Date().toISOString();

  entries[slug] = entry;
  await saveSiteContent(entries);
}

// Rendert Freitext mit einfachen "- "-Aufzaehlungen als <p>/<ul> statt als
// reinen whitespace-pre-line-Block, damit Listen wie im urspruenglichen
// Design optisch erhalten bleiben. Erwartet Absaetze getrennt durch eine
// Leerzeile; ein Absatz, dessen Zeilen alle mit "- " beginnen, wird als
// Liste behandelt.
export function parseContentBlocks(body: string): { type: "p" | "ul"; lines: string[] }[] {
  const absaetze = body.split(/\n{2,}/).map((a) => a.trim()).filter(Boolean);
  return absaetze.map((absatz) => {
    const zeilen = absatz.split("\n").map((z) => z.trim()).filter(Boolean);
    const istListe = zeilen.length > 0 && zeilen.every((z) => z.startsWith("- "));
    if (istListe) {
      return { type: "ul" as const, lines: zeilen.map((z) => z.slice(2)) };
    }
    return { type: "p" as const, lines: [absatz] };
  });
}
