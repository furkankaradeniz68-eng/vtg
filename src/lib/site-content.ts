// Editierbare Text-/Bildinhalte der oeffentlichen Seiteninhalte
// (Personen-Listen laufen weiterhin separat ueber personen.ts). Bewusst
// einfach gehalten: ein Freitext-Feld (mit Absaetzen) plus optionalem Bild
// pro Seite, analog zum Blob-Speicher-Muster aus personen.ts/
// public-downloads.ts. Vorher fest im Code stehende Listen und interne
// Verlinkungen sind jetzt Teil des Freitexts und nicht mehr separat
// verlinkt/aufgezaehlt -- das ist eine bewusste Vereinfachung, damit Admins
// die Texte ohne Code-Deploy pflegen koennen (Entscheidung vom 2026-09-23).
// Die 22 Satzungsparagraphen (frueher eigenes satzung-inhalt.ts-Modul mit
// Paragraph-weiser Bearbeitung) sind seit 2026-09-29 als ein einziger
// Freitext unter dem Slug "satzung" hier mit eingebunden, damit sie als
// ganze Textdatei bearbeitet und in derselben "Seiten"-Uebersicht gelistet
// werden koennen. Ueberschriften ("§ N Titel") stehen als eigene Absaetze im
// Text und werden erst beim Rendern (satzung/page.tsx) per Regex erkannt.
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
  | "finanzierung"
  | "satzung"
  | "zins"
  | "umlage";

export const SITE_CONTENT_PAGES: {
  slug: SiteContentSlug;
  label: string;
  hasImage: boolean;
  // Seiten mit section: "mitgliederbereich" werden nicht in der allgemeinen
  // "Öffentliche Seiteninhalte"-Übersicht gelistet, sondern nur im
  // "Mitgliederbereich"-Tab, um Redundanz in der Admin-Navigation zu
  // vermeiden (Entscheidung vom 2026-09-29).
  section?: "mitgliederbereich";
}[] = [
  { slug: "ueberblick", label: "Überblick", hasImage: false },
  { slug: "praesident", label: "Präsident", hasImage: false },
  { slug: "vorstand", label: "Vorstand", hasImage: false },
  { slug: "geschaeftsfuehrer", label: "Geschäftsführer", hasImage: false },
  { slug: "bauabwicklung", label: "Bauabwicklung", hasImage: true },
  { slug: "kassen-und-buchfuehrung", label: "Kassen- und Buchführung", hasImage: true },
  { slug: "sonstige-aufgaben", label: "Sonstige Aufgaben", hasImage: true },
  { slug: "finanzierung", label: "Finanzierung", hasImage: false },
  { slug: "satzung", label: "Satzung", hasImage: false },
  { slug: "zins", label: "Zins (Mitgliederbereich)", hasImage: false, section: "mitgliederbereich" },
  { slug: "umlage", label: "Umlage-Text (Mitgliederbereich)", hasImage: false, section: "mitgliederbereich" },
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
  satzung: {
    slug: "satzung",
    body: `§ 1 Name, Gebiet und Sitz

Die in der Anlage aufgeführten Teilnehmergemeinschaften nach § 16 des Flurbereinigungsgesetzes (FlurbG) in der Fassung der Bekanntmachung vom 16. März 1976 (BGBl. I S. 546), zuletzt geändert durch Gesetz zur Änderung des Flurbereinigungsgesetzes vom 23. August 1994 (BGBl. I S. 2187), schließen sich zu einem Verband der Teilnehmergemeinschaften gemäß §§ 26a ff. FlurbG zusammen. Der Verband führt den Namen „Verband der Teilnehmergemeinschaften Rheinland-Pfalz" (VTG).

Der Verband kann im Rahmen seiner satzungsgemäßen Aufgaben (§ 2 Satzung) im Land Rheinland-Pfalz tätig werden.

Der Verband ist eine Körperschaft des öffentlichen Rechts. Er verwaltet sich im Rahmen der Gesetze und dieser Satzung selbst und dient dem gemeinschaftlichen Interesse seiner Mitglieder.

Sitz des Verbandes ist Neustadt/Weinstraße.

§ 2 Aufgaben des Verbands

Der Verband dient der gemeinsamen Durchführung von Aufgaben, die seinen Mitgliedern nach § 18 FlurbG obliegen, ferner den nachstehenden sonstigen Aufgaben nach dem Flurbereinigungsgesetz.

Der Verband übernimmt für seine Mitglieder auf der Grundlage ihrer Beschlüsse
• die Kassen- und Buchführung mit voller Verantwortung (§ 26b Abs. 2 Satz 2 FlurbG),
• die Vorbereitung und Durchführung der hoheitlichen Erhebung von Geldforderungen von Beteiligten an Verfahren nach dem Flurbereinigungsgesetz (§ 26b Abs. 2 in Verbindung mit § 19 FlurbG),
• die Einrichtung und Verwaltung eines finanziellen Grundstocks und eines Verbundkontos,
• alle Arbeiten im Zusammenhang mit der Herstellung und Unterhaltung der gemeinschaftlichen Anlagen (§ 18 FlurbG) mit Ausnahme der Verkehrssicherungspflicht,
• gegebenenfalls die Vertretung in Beiräten und Ausschüssen nach Gesetzen des Landes Rheinland-Pfalz.

Der Verband unterstützt seine Mitglieder bei der Finanzierung ihrer Aufgaben und bei der Verwaltung öffentlicher Mittel. Er kann Eigenmittel bewirtschaften und verwalten. Er kann für sich und – auf Antrag – für seine Mitglieder mit Zustimmung der Aufsichtsbehörde Bankdarlehen aufnehmen.

Für die Herstellung und Unterhaltung der gemeinschaftlichen und öffentlichen Anlagen, die Bodenverbesserungsarbeiten sowie für vermessungstechnische und andere verfahrensbezogene Aufgaben kann der Verband Arbeitskräfte, Maschinen, Geräte und Material stellen.

Der Verband kann durch die jeweilige Flurbereinigungsbehörde bereits vor der Anordnung eines Bodenordnungsverfahrens beauftragt werden (§ 26c Abs. 1 FlurbG),
• Vorarbeiten, insbesondere agrarstrukturelle Vorplanungen zu übernehmen,
• für Zwecke der Flurbereinigung Grundstücke zu erwerben oder zu pachten.

Der Verband kann mit Zustimmung der jeweiligen Flurbereinigungsbehörde die Folgemaßnahmen beim freiwilligen Landtausch und beim freiwilligen Nutzungstausch durchführen, soweit die Tauschpartner solche Maßnahmen vereinbaren.

Der Verband kann, soweit es der Durchführung von Bodenordnungsverfahren nach dem Flurbereinigungsgesetz dient bzw. die sachlichen Voraussetzungen dafür vorliegen, gegen Erstattung der Kosten auch für Nichtmitglieder tätig werden, z. B. für Gemeinden und Unternehmensträger in Verfahren nach § 87 ff. FlurbG.

Der Verband kann sich zur Erfüllung seiner Aufgaben Dritter bedienen.

Der Verband fördert den Erfahrungsaustausch und die Fortbildung seiner Mitglieder im Sinne dieser Satzung.

§ 3 Mitgliedschaft

Mitglieder des Verbands sind die den Verband nach § 26a FlurbG bildenden Teilnehmergemeinschaften. Die Mitgliedschaft entsteht mit Zustimmung durch die Flurbereinigungsbehörde (§ 26a Abs. 5 FlurbG).

Jedes Mitglied kann zum Ende eines Kalenderjahres aus dem Verband austreten. Der Austritt muss mindestens sechs Monate vorher schriftlich dem Präsidenten gegenüber erklärt werden.

Mitglieder können nur mit der Mehrheit aller Mitglieder und Zustimmung der Aufsichtsbehörde ausgeschlossen werden. Der Ausschluss ist nur zulässig, wenn das Mitglied der Satzung oder Beschlüssen der Verbandsorgane zuwidergehandelt hat oder seine dem Verband übertragenen Aufgaben erfüllt sind.

Die Mitglieder haben ihre Verpflichtungen bis zum Zeitpunkt des Wirksamwerdens ihres Austritts oder ihres Ausschlusses in vollem Umfang zu erfüllen. Der Vorstand kann beschließen, dass sie zur völligen Abwicklung auch solcher Verpflichtungen weiter beizutragen haben, die vor Zugang ihrer Austrittserklärung oder vor der Entscheidung der Mitgliederversammlung über ihren Ausschluss begründet worden sind.

Die Mitgliedschaft erlischt mit der Beendigung des Bodenordnungsverfahrens. Sie bleibt über diesen Zeitpunkt hinaus bestehen, wenn und solange die Flurbereinigungsbehörde die Aufsicht über die betreffende Teilnehmergemeinschaft hat; insoweit gilt Absatz 2.

§ 4 Verbandsorgane

Organe des Verbands sind die Mitgliederversammlung, der Vorstand und der Präsident.

Vorstand und Präsident werden für eine Amtsperiode von fünf Jahren gewählt. Wiederwahl ist zulässig. Nachwahlen bei laufender Wahlperiode gelten nur für den Rest der Wahlperiode.

§ 5 Mitgliederversammlung

Die Mitgliederversammlung besteht aus den Mitgliedern (§ 3 Satzung). Die Mitglieder werden durch ihre Vorstandsvorsitzenden oder deren Stellvertreter, bei Verhinderung beider durch einen vom jeweiligen Vorstandsvorsitzenden zu bestimmenden Bevollmächtigten vertreten.

Ist ein Vorstand und sein Vorsitzender nicht nur für eine, sondern für mehrere Teilnehmergemeinschaften gewählt, steht ihm für jede von ihm vertretene Teilnehmergemeinschaft jeweils ein Stimmrecht zu.

Die Mitgliederversammlung ist jährlich mindestens einmal einzuberufen. Sie muss einberufen werden, wenn dies die Aufsichtsbehörde verlangt oder mindestens ein Drittel der Mitglieder dies schriftlich beantragt.

Der Präsident hat der Mitgliederversammlung Rechenschaft über die Tätigkeit des Verbandes zu erstatten und dazu Auskünfte zu erteilen.

§ 6 Aufgaben der Mitgliederversammlung

Die Mitgliederversammlung wählt den Vorstand.

Sie beschließt über
• die Aufstellung und Änderung der Hauptsatzung und weiterer Satzungen,
• die Feststellung des Wirtschaftsplanes (§ 15 Satzung),
• den Jahresabschluss und die Entlastung des Vorstands (§ 18 Satzung),
• die Umlage (§ 16 Abs. 1 Satzung),
• die Entschädigung für Zeitversäumnisse und Aufwand von Vorstandsmitgliedern,
• den Ausschluss von Verbandsmitgliedern (§ 3 Satzung),
• die Auflösung des Verbands nach Zustimmung durch die Aufsichtsbehörde und
• sonstige Angelegenheiten, die der Vorstand der Mitgliederversammlung vorlegt.

§ 7 Beschlussfassung der Mitgliederversammlung

Die Mitgliederversammlung wird vom Präsidenten schriftlich unter Bekanntgabe der Tagesordnung einberufen. Die Ladungsfrist beträgt vier Wochen. In dringenden Fällen kann die Frist auf zwei Wochen verkürzt werden.

Die Mitgliederversammlung ist ohne Rücksicht auf die Anzahl der Erschienenen beschlussfähig, wenn alle Mitglieder ordnungsgemäß geladen sind und in der Einladung darauf hingewiesen wurde.

Die Mitgliederversammlung beschließt, sofern in dieser Satzung nichts anderweitiges geregelt ist, in offener Abstimmung mit der Mehrheit der abgegebenen Stimmen. Auf mündlichen Antrag mindestens eines Stimmberechtigten kann die Versammlung in offener Abstimmung darüber beschließen, ob die Abstimmung geheim durchgeführt wird.

Jeder Stimmberechtigte hat für jede von ihm vertretene Teilnehmergemeinschaft je eine Stimme.

Anträge auf Änderung der Hauptsatzung sind in vollem Wortlaut mit der Ladung zur Mitgliederversammlung bekanntzugeben. Für die Änderung der Hauptsatzung ist die Mehrheit von zwei Dritteln der abgegebenen Stimmen erforderlich.

Für alle anderen Anträge ist die einfache Mehrheit der abgegebenen Stimmen erforderlich. Bei Stimmengleichheit gilt ein Antrag als abgelehnt.

Über Anträge von Mitgliedern, des Vorstands oder des Geschäftsführers zur Änderung der Tagesordnung beschließt die Mitgliederversammlung. Änderungsanträge sind grundsätzlich vor der Mitgliederversammlung den Mitgliedern zuzustellen oder mit Zweidrittelmehrheit der in der Mitgliederversammlung anwesenden Stimmberechtigten zu beschließen. Die Anträge sollen nur dann berücksichtigt werden, wenn sie mindestens eine Woche – in den Fällen des Absatzes 1 Satz 3 drei Tage – vor der Versammlung schriftlich beim Präsidenten oder beim Geschäftsführer eingegangen sind.

§ 8 Zusammensetzung und Wahl des Vorstandes und des Präsidenten

Die Zahl der Vorstandsmitglieder wird von der obersten Flurbereinigungsbehörde gemäß § 26b Abs. 1 FlurbG bestimmt. Das Nähere regelt eine Wahlordnung.

Jeder Dienstbezirk einer Flurbereinigungsbehörde muss im Vorstand vertreten sein.

Wählbar sind Vorstandsmitglieder der Teilnehmergemeinschaften aus den Dienstbezirken der Flurbereinigungsbehörden in Rheinland-Pfalz.

Beschäftigte der Flurbereinigungsverwaltung und des Verbandes der Teilnehmergemeinschaften können nicht in den Vorstand gewählt werden.

Die Mitgliederversammlung kann mit der Mehrheit der erschienenen Mitglieder Vorstandsmitglieder dadurch abberufen, dass sie an deren Stelle neue Vorstandsmitglieder wählt. Der Antrag auf Abberufung eines Vorstandsmitglieds muss von mindestens einem Drittel aller Mitglieder oder dem Vorstand oder der Aufsichtsbehörde gestellt sein.

Der Vorstand wählt aus seiner Mitte den Präsidenten und dessen Stellvertreter.

Wird der Vorstand durch Ausscheiden von Vorstandsmitgliedern beschlussunfähig, führt der Präsident, bei dessen Ausscheiden der Stellvertreter des Präsidenten, bei dessen Ausscheiden das älteste Vorstandsmitglied die Geschäfte des Vorstands. Eine Nachwahl ist unverzüglich, spätestens innerhalb von zwei Monaten, durchzuführen.

Die Vorstandsmitglieder und die Stellvertreter wirken ehrenamtlich. Der Verband gewährt ihnen eine Entschädigung für Zeitversäumnis und Aufwand.

Die Absätze 2 bis 5 gelten sinngemäß für die Stellvertreter.

§ 9 Aufgaben des Vorstands

Der Vorstand bestimmt über alle Angelegenheiten des Verbands, soweit nicht nach § 6 der Satzung die Mitgliederversammlung oder nach § 11 der Präsident oder nach § 14 der Geschäftsführer zuständig sind. Zu den Aufgaben des Vorstands gehören insbesondere
• die Aufnahme von Mitgliedern,
• die Aufstellung des Wirtschaftsplans (§ 15 Satzung),
• die Genehmigung der Geschäftsordnung,
• die Vergabe von Arbeiten nach § 2 Abs. 8 der Satzung ab einer vom Vorstand generell zu bestimmenden Höhe,
• die Festsetzung der Beiträge nach § 16 Absatz 2 und 3 der Satzung,
• die Aufstellung des Jahresabschlusses,
• die Bestellung und Abberufung des Geschäftsführers und seines Stellvertreters mit Zustimmung der obersten Flurbereinigungsbehörde.

Der Vorstand hat über sonstige Angelegenheiten zu beschließen, die ihm der Präsident oder der Geschäftsführer vorlegt.

§ 10 Beschlussfassung des Vorstands

Der Präsident beruft den Vorstand zu Sitzungen unter Mitteilung der Tagesordnung schriftlich ein. Die Ladungsfrist beträgt zwei Wochen, in dringenden Fällen kann diese Frist verkürzt werden.

Der Vorstand ist beschlussfähig, wenn alle Vorstandsmitglieder ordnungsgemäß geladen sind und mindestens die Hälfte anwesend ist. Ohne Rücksicht auf Form und Frist der Ladung ist er beschlussfähig, wenn alle Vorstandsmitglieder zustimmen.

Ohne Rücksicht auf die Anzahl der Erschienenen ist er beschlussfähig, wenn er zum zweiten Mal wegen desselben Gegenstandes rechtzeitig geladen wurde und hierbei mitgeteilt worden ist, dass ohne Rücksicht auf die Anzahl der Erschienenen beschlossen werden wird.

Auf schriftlichem Wege erzielte Beschlüsse sind gültig, wenn sie einstimmig von allen Vorstandsmitgliedern gefasst sind.

Der Vorstand entscheidet mit Stimmenmehrheit der anwesenden Vorstandsmitglieder. Bei Stimmengleichheit gilt ein Antrag als abgelehnt.

§ 11 Aufgaben des Präsidenten

Der Präsident vertritt den Verband gerichtlich und außergerichtlich.

Er leitet die Mitgliederversammlung und die Vorstandssitzungen.

§ 12 Sitzungen der Verbandsorgane

Von den Mitgliederversammlungen und Vorstandssitzungen ist die Aufsichtsbehörde unter Mitteilung der Tagesordnung rechtzeitig zu unterrichten.

Über die Beschlüsse der Mitgliederversammlung und des Vorstands fertigt der Geschäftsführer eine Niederschrift. Die Niederschrift muss insbesondere Ort und Tag der Sitzung, die Namen der anwesenden Mitglieder und Stellvertreter, die Namen der anwesenden Vorstandsmitglieder, die Namen der nach Absatz 3 zugezogenen Personen und der Vertreter der Aufsichtsbehörde sowie die Anträge und Beschlüsse mit dem jeweiligen Abstimmungsergebnis enthalten. Die Niederschrift ist vom Geschäftsführer zu unterzeichnen und vom Präsidenten gegenzuzeichnen.

Personen, die den Verbandsorganen nicht angehören, können durch Beschluss des Vorstandes zugezogen werden. Sie haben kein Stimmrecht.

§ 13 Geschäftsstelle

Der Verband unterhält eine Geschäftsstelle.

Für den Dienstbetrieb des Verbandes gibt dieser sich eine Geschäftsordnung.

§ 14 Geschäftsführer

Der hauptamtliche Geschäftsführer wird vom Vorstand mit Zustimmung der obersten Flurbereinigungsbehörde bestellt und abberufen. Er sollte über Erfahrungen in der Flurbereinigungsverwaltung verfügen.

Er ist für den Vollzug der Beschlüsse der Verbandsorgane verantwortlich. Er erledigt in diesem Rahmen die laufenden Geschäfte.

Der Geschäftsführer ist bevollmächtigt zum Abschluss von Verträgen, soweit in dieser Satzung nichts abweichendes geregelt ist.

Er ist Dienstvorgesetzter der Beschäftigten des Verbands.

Er nimmt an den Sitzungen der Verbandsorgane ohne Stimmrecht teil.

§ 15 Wirtschaftsjahr, Wirtschaftsplan

Wirtschaftsjahr ist das Kalenderjahr.

Für jedes Wirtschaftsjahr entwirft der Geschäftsführer den Wirtschaftsplan.

Im Rahmen des Wirtschaftsplanes obliegen dem Geschäftsführer die Einstellung, Eingruppierung und Entlassung der Dienstkräfte; für die Einstellung von Ingenieuren oder Beschäftigten mit vergleichbarer Qualifikation ist die Zustimmung des Vorstandes, bei dem übrigen Personal das Einverständnis des Präsidenten erforderlich.

§ 16 Verbandsumlage und -beiträge und sonstige Einnahmen

Der personelle und sächliche Aufwand für die Geschäftsstelle sowie für die der Geschäftsstelle zugeordneten Bediensteten in den Flurbereinigungsbezirken ist von den Mitgliedern durch eine jährliche Umlage aufzubringen; dazu gehören die Kosten für Gebäude bzw. Räume, EDV-Ausstattung und -Unterhaltung, Büromaterial, Einrichtungen und Verbindlichkeiten. Die Gemeinkosten sind dabei verursachungsgerecht auf den Baubetrieb und die sonstigen Aufgaben des VTG zu verteilen.

Die anteilige Höhe der Umlage richtet sich in der Regel nach dem Verhältnis der jährlichen Ausführungskosten des einzelnen Mitglieds zu den Gesamtausführungskosten aller Mitglieder im jeweiligen Jahr. Über die Höhe der Umlage und Ausnahmen beschließt die Mitgliederversammlung.

Für die gestellten Arbeitskräfte, Maschinen und Geräte sind zeitabhängige Beiträge (Stundensätze) zu erbringen. Die Höhe dieser Beiträge wird vom Vorstand festgesetzt.

Besondere Leistungen des Verbands können unter Berücksichtigung der tatsächlichen Aufwendungen gesondert abgerechnet werden. Diese Erstattung gilt insbesondere für Nichtmitglieder. Die Höhe wird vom Vorstand festgesetzt.

Auf die Umlage und die Beiträge nach § 16 der Satzung können Vorschüsse erhoben werden.

Für Schulden des Verbands haften die Mitglieder anteilig nach der Höhe der während ihrer Mitgliedschaft im Verband bis zum Zeitpunkt der Feststellung oder Anerkennung der Schuld angefallenen anteiligen Ausführungskosten ihrer Bodenordnungsverfahren.

§ 17 Hebung der Verbandsumlage und -beiträge, Rechtsbehelfe

Der Verband erhebt die Umlage und die Beiträge nach § 16 der Satzung durch Bescheid.

Gegen den Bescheid kann innerhalb eines Monats nach dessen Bekanntgabe Widerspruch schriftlich oder zur Niederschrift bei der Geschäftsstelle des Verbandes oder der Aufsichtsbehörde eingelegt werden.

Der Widerspruch hat bezüglich der Zahlungsverpflichtung keine aufschiebende Wirkung.

Über den Widerspruch entscheidet die Aufsichtsbehörde (§ 141 FlurbG). Wird dem Widerspruch nicht abgeholfen, kann gegen die Entscheidung der Aufsichtsbehörde (Widerspruchsbescheid) innerhalb eines Monats nach Zustellung beim Flurbereinigungsgericht Klage erhoben werden.

§ 18 Rechnungslegung

Der Vorstand hat für den Schluss eines jeden Wirtschaftsjahres entsprechend den handelsrechtlichen Vorschriften einen aus der Bilanz, der Gewinn- und Verlustrechnung und dem Lagebericht bestehenden Jahresabschluss aufzustellen und der Prüfstelle zuzuleiten.

Der Vorstand hat der Mitgliederversammlung den Jahresabschluss nach abgeschlossener Prüfung zur Beschlussfassung vorzulegen.

Die Prüfung des Jahresabschlusses wird von einer von der Aufsichtsbehörde zu bestimmenden Prüfstelle durchgeführt.

§ 19 Betretungsrecht

Der Verband ist Beauftragter der Flurbereinigungsbehörde im Sinne von § 35 FlurbG und ist als solcher berechtigt, zur Vorbereitung und zur Durchführung der Bodenordnungsverfahren Grundstücke zu betreten und die nach seinem Ermessen erforderlichen Arbeiten auf ihnen vorzunehmen.

§ 20 Aufsicht

Der Verband untersteht der Aufsicht der obersten Flurbereinigungsbehörde.

Unbeschadet der Hauptsatzung bedürfen der Zustimmung bzw. Genehmigung der Aufsichtsbehörde im Übrigen
• der Wirtschaftsplan (§ 15 Satzung) und der Jahresabschluss (§ 18 Satzung),
• die Festsetzung der Verbandsbeiträge (§ 16 Satzung),
• der Abschluss von Verträgen, soweit diese einen von der obersten Flurbereinigungsbehörde vorgegebenen Ermächtigungsrahmen überschreiten (§ 26d i.V.m. § 17 Abs. 2 FlurbG),
• die Aufnahme von Bankdarlehen (§ 2 Abs. 3 Satzung),
• die Bestellung von Sicherheiten und die Übernahme von Bürgschaften,
• Ausschluss von Mitgliedern (§ 3 Satzung),
• die unentgeltliche Veräußerung von Vermögensgegenständen,
• die Geschäftsordnung des Verbandes (§ 13 Satzung),
• die Auflösung des Verbandes (§ 6 Abs. 2 Buchst. g der Satzung).

Die Aufsichtsbehörde kann für bestimmte Geschäfte Ausnahmen zulassen.

Die Aufsichtsbehörde kann sich auch durch Beauftragte über die Angelegenheiten des Verbandes unterrichten. Sie kann mündliche oder schriftliche Berichte verlangen, Akten und andere Unterlagen anfordern sowie an Ort und Stelle Prüfungen und Besichtigungen vornehmen.

§ 21 Übergangsregelung

entfällt

§ 22 Inkrafttreten

Der Verband entsteht, sofern mindestens 20 Teilnehmergemeinschaften den Zusammenschluss erklärt und diese Hauptsatzung beschlossen haben (§ 26a Abs. 2 FlurbG), am Tag der öffentlichen Bekanntmachung dieser Hauptsatzung im Staatsanzeiger Rheinland-Pfalz (§ 26a Abs. 1 FlurbG).

Jede Satzungsänderung tritt am ersten Tag des auf die Genehmigung durch die Aufsichtsbehörde folgenden Kalendermonats in Kraft.`,
    updatedAt: SEED_DATE,
  },
  zins: {
    slug: "zins",
    body: `Die Gelder aus Zuwendungen und Eigenleistungen aller Mitglieder werden über ein Verbundkonto bewirtschaftet. Dadurch ist sichergestellt, dass die Mitglieder des VTG jederzeit liquide sind und Sollzinszahlungen für Vorfinanzierungen minimiert werden.

Die in der Buchführung des VTG für jedes Mitglied eingerichtete Unterkonto dieses Verbundkontos gewährleistet eine mitgliederscharfe Abrechnung aller Ausgaben und Einnahmen.

Dieses Unterkonto ist als Kontokorrentkonto eingerichtet. Guthaben und Überziehungen dieser TG-Unterkonten wurden bis 2019 verzinst.

Seit dem Jahr 2020 gibt es weder Guthaben- noch Sollzinsen. Etwaig erforderliche Vorfinanzierungen von Zuwendungen oder Eigenleistungen erfolgen somit zinslos.`,
    updatedAt: SEED_DATE,
  },
  umlage: {
    slug: "umlage",
    body: `Der personelle und sächliche Aufwand für die Geschäftsstelle sowie für die der Geschäftsstelle zugeordneten Bediensteten in den Kulturamtsbezirken ist von den Mitgliedern durch eine jährliche Umlage aufzubringen; dazu gehören die Kosten für Gebäude bzw. Räume, EDV-Ausstattung usw. Mit der Umlage werden somit diejenigen Kosten finanziert, die für die Durchführung der Kassengeschäfte und des Bauwesens erforderlich sind und nicht über Beitragseinnahmen (Stundensätze) des Eigenregiebetriebes abgedeckt sind.

In der Umlage enthalten ist auch die Haftpflichtversicherung für die Teilnehmergemeinschaften. Der Versicherungsschutz beginnt automatisch mit der Mitgliedschaft im VTG.

Die anteilige Höhe der Umlage richtet sich in der Regel nach dem Verhältnis der jährlichen Ausführungskosten des einzelnen Mitglieds zu den Gesamtausführungskosten aller Mitglieder im jeweiligen Jahr.

Sie wird dreimal pro Jahr, in der Regel zum 1. April, 1. August und 1. Dezember, erhoben.

Über die Höhe der Umlage und Ausnahmen beschließt die Mitgliederversammlung.`,
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
