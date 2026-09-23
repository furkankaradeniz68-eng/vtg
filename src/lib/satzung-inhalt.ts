// Editierbarer Flusstext der 22 Satzungsparagraphen. Titel und Reihenfolge
// der Paragraphen sind fest im Code (Aenderung der Paragraphenstruktur ist
// eine Satzungsaenderung, keine reine Textkorrektur) -- nur der Wortlaut je
// Paragraph ist ueber /admin editierbar. Blob-Speicher-Muster wie
// site-content.ts/personen.ts. Es gibt zusaetzlich weiterhin den
// PDF-Download (VTG_Satzung.pdf) als verbindliche Quelle.
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";

const META_PATHNAME = "satzung-inhalt-meta.json";

export const SATZUNG_TITEL: string[] = [
  "§ 1 Name, Gebiet und Sitz",
  "§ 2 Aufgaben des Verbands",
  "§ 3 Mitgliedschaft",
  "§ 4 Verbandsorgane",
  "§ 5 Mitgliederversammlung",
  "§ 6 Aufgaben der Mitgliederversammlung",
  "§ 7 Beschlussfassung der Mitgliederversammlung",
  "§ 8 Zusammensetzung und Wahl des Vorstandes und des Präsidenten",
  "§ 9 Aufgaben des Vorstands",
  "§ 10 Beschlussfassung des Vorstands",
  "§ 11 Aufgaben des Präsidenten",
  "§ 12 Sitzungen der Verbandsorgane",
  "§ 13 Geschäftsstelle",
  "§ 14 Geschäftsführer",
  "§ 15 Wirtschaftsjahr, Wirtschaftsplan",
  "§ 16 Verbandsumlage und -beiträge und sonstige Einnahmen",
  "§ 17 Hebung der Verbandsumlage und -beiträge, Rechtsbehelfe",
  "§ 18 Rechnungslegung",
  "§ 19 Betretungsrecht",
  "§ 20 Aufsicht",
  "§ 21 Übergangsregelung",
  "§ 22 Inkrafttreten",
];

const DEFAULT_BODY: Record<string, string> = {
  "§ 1 Name, Gebiet und Sitz": `Die in der Anlage aufgeführten Teilnehmergemeinschaften nach § 16 des Flurbereinigungsgesetzes (FlurbG) in der Fassung der Bekanntmachung vom 16. März 1976 (BGBl. I S. 546), zuletzt geändert durch Gesetz zur Änderung des Flurbereinigungsgesetzes vom 23. August 1994 (BGBl. I S. 2187), schließen sich zu einem Verband der Teilnehmergemeinschaften gemäß §§ 26a ff. FlurbG zusammen. Der Verband führt den Namen „Verband der Teilnehmergemeinschaften Rheinland-Pfalz" (VTG).

Der Verband kann im Rahmen seiner satzungsgemäßen Aufgaben (§ 2 Satzung) im Land Rheinland-Pfalz tätig werden.

Der Verband ist eine Körperschaft des öffentlichen Rechts. Er verwaltet sich im Rahmen der Gesetze und dieser Satzung selbst und dient dem gemeinschaftlichen Interesse seiner Mitglieder.

Sitz des Verbandes ist Neustadt/Weinstraße.`,
  "§ 2 Aufgaben des Verbands": `Der Verband dient der gemeinsamen Durchführung von Aufgaben, die seinen Mitgliedern nach § 18 FlurbG obliegen, ferner den nachstehenden sonstigen Aufgaben nach dem Flurbereinigungsgesetz.

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

Der Verband fördert den Erfahrungsaustausch und die Fortbildung seiner Mitglieder im Sinne dieser Satzung.`,
  "§ 3 Mitgliedschaft": `Mitglieder des Verbands sind die den Verband nach § 26a FlurbG bildenden Teilnehmergemeinschaften. Die Mitgliedschaft entsteht mit Zustimmung durch die Flurbereinigungsbehörde (§ 26a Abs. 5 FlurbG).

Jedes Mitglied kann zum Ende eines Kalenderjahres aus dem Verband austreten. Der Austritt muss mindestens sechs Monate vorher schriftlich dem Präsidenten gegenüber erklärt werden.

Mitglieder können nur mit der Mehrheit aller Mitglieder und Zustimmung der Aufsichtsbehörde ausgeschlossen werden. Der Ausschluss ist nur zulässig, wenn das Mitglied der Satzung oder Beschlüssen der Verbandsorgane zuwidergehandelt hat oder seine dem Verband übertragenen Aufgaben erfüllt sind.

Die Mitglieder haben ihre Verpflichtungen bis zum Zeitpunkt des Wirksamwerdens ihres Austritts oder ihres Ausschlusses in vollem Umfang zu erfüllen. Der Vorstand kann beschließen, dass sie zur völligen Abwicklung auch solcher Verpflichtungen weiter beizutragen haben, die vor Zugang ihrer Austrittserklärung oder vor der Entscheidung der Mitgliederversammlung über ihren Ausschluss begründet worden sind.

Die Mitgliedschaft erlischt mit der Beendigung des Bodenordnungsverfahrens. Sie bleibt über diesen Zeitpunkt hinaus bestehen, wenn und solange die Flurbereinigungsbehörde die Aufsicht über die betreffende Teilnehmergemeinschaft hat; insoweit gilt Absatz 2.`,
  "§ 4 Verbandsorgane": `Organe des Verbands sind die Mitgliederversammlung, der Vorstand und der Präsident.

Vorstand und Präsident werden für eine Amtsperiode von fünf Jahren gewählt. Wiederwahl ist zulässig. Nachwahlen bei laufender Wahlperiode gelten nur für den Rest der Wahlperiode.`,
  "§ 5 Mitgliederversammlung": `Die Mitgliederversammlung besteht aus den Mitgliedern (§ 3 Satzung). Die Mitglieder werden durch ihre Vorstandsvorsitzenden oder deren Stellvertreter, bei Verhinderung beider durch einen vom jeweiligen Vorstandsvorsitzenden zu bestimmenden Bevollmächtigten vertreten.

Ist ein Vorstand und sein Vorsitzender nicht nur für eine, sondern für mehrere Teilnehmergemeinschaften gewählt, steht ihm für jede von ihm vertretene Teilnehmergemeinschaft jeweils ein Stimmrecht zu.

Die Mitgliederversammlung ist jährlich mindestens einmal einzuberufen. Sie muss einberufen werden, wenn dies die Aufsichtsbehörde verlangt oder mindestens ein Drittel der Mitglieder dies schriftlich beantragt.

Der Präsident hat der Mitgliederversammlung Rechenschaft über die Tätigkeit des Verbandes zu erstatten und dazu Auskünfte zu erteilen.`,
  "§ 6 Aufgaben der Mitgliederversammlung": `Die Mitgliederversammlung wählt den Vorstand.

Sie beschließt über
• die Aufstellung und Änderung der Hauptsatzung und weiterer Satzungen,
• die Feststellung des Wirtschaftsplanes (§ 15 Satzung),
• den Jahresabschluss und die Entlastung des Vorstands (§ 18 Satzung),
• die Umlage (§ 16 Abs. 1 Satzung),
• die Entschädigung für Zeitversäumnisse und Aufwand von Vorstandsmitgliedern,
• den Ausschluss von Verbandsmitgliedern (§ 3 Satzung),
• die Auflösung des Verbands nach Zustimmung durch die Aufsichtsbehörde und
• sonstige Angelegenheiten, die der Vorstand der Mitgliederversammlung vorlegt.`,
  "§ 7 Beschlussfassung der Mitgliederversammlung": `Die Mitgliederversammlung wird vom Präsidenten schriftlich unter Bekanntgabe der Tagesordnung einberufen. Die Ladungsfrist beträgt vier Wochen. In dringenden Fällen kann die Frist auf zwei Wochen verkürzt werden.

Die Mitgliederversammlung ist ohne Rücksicht auf die Anzahl der Erschienenen beschlussfähig, wenn alle Mitglieder ordnungsgemäß geladen sind und in der Einladung darauf hingewiesen wurde.

Die Mitgliederversammlung beschließt, sofern in dieser Satzung nichts anderweitiges geregelt ist, in offener Abstimmung mit der Mehrheit der abgegebenen Stimmen. Auf mündlichen Antrag mindestens eines Stimmberechtigten kann die Versammlung in offener Abstimmung darüber beschließen, ob die Abstimmung geheim durchgeführt wird.

Jeder Stimmberechtigte hat für jede von ihm vertretene Teilnehmergemeinschaft je eine Stimme.

Anträge auf Änderung der Hauptsatzung sind in vollem Wortlaut mit der Ladung zur Mitgliederversammlung bekanntzugeben. Für die Änderung der Hauptsatzung ist die Mehrheit von zwei Dritteln der abgegebenen Stimmen erforderlich.

Für alle anderen Anträge ist die einfache Mehrheit der abgegebenen Stimmen erforderlich. Bei Stimmengleichheit gilt ein Antrag als abgelehnt.

Über Anträge von Mitgliedern, des Vorstands oder des Geschäftsführers zur Änderung der Tagesordnung beschließt die Mitgliederversammlung. Änderungsanträge sind grundsätzlich vor der Mitgliederversammlung den Mitgliedern zuzustellen oder mit Zweidrittelmehrheit der in der Mitgliederversammlung anwesenden Stimmberechtigten zu beschließen. Die Anträge sollen nur dann berücksichtigt werden, wenn sie mindestens eine Woche – in den Fällen des Absatzes 1 Satz 3 drei Tage – vor der Versammlung schriftlich beim Präsidenten oder beim Geschäftsführer eingegangen sind.`,
  "§ 8 Zusammensetzung und Wahl des Vorstandes und des Präsidenten": `Die Zahl der Vorstandsmitglieder wird von der obersten Flurbereinigungsbehörde gemäß § 26b Abs. 1 FlurbG bestimmt. Das Nähere regelt eine Wahlordnung.

Jeder Dienstbezirk einer Flurbereinigungsbehörde muss im Vorstand vertreten sein.

Wählbar sind Vorstandsmitglieder der Teilnehmergemeinschaften aus den Dienstbezirken der Flurbereinigungsbehörden in Rheinland-Pfalz.

Beschäftigte der Flurbereinigungsverwaltung und des Verbandes der Teilnehmergemeinschaften können nicht in den Vorstand gewählt werden.

Die Mitgliederversammlung kann mit der Mehrheit der erschienenen Mitglieder Vorstandsmitglieder dadurch abberufen, dass sie an deren Stelle neue Vorstandsmitglieder wählt. Der Antrag auf Abberufung eines Vorstandsmitglieds muss von mindestens einem Drittel aller Mitglieder oder dem Vorstand oder der Aufsichtsbehörde gestellt sein.

Der Vorstand wählt aus seiner Mitte den Präsidenten und dessen Stellvertreter.

Wird der Vorstand durch Ausscheiden von Vorstandsmitgliedern beschlussunfähig, führt der Präsident, bei dessen Ausscheiden der Stellvertreter des Präsidenten, bei dessen Ausscheiden das älteste Vorstandsmitglied die Geschäfte des Vorstands. Eine Nachwahl ist unverzüglich, spätestens innerhalb von zwei Monaten, durchzuführen.

Die Vorstandsmitglieder und die Stellvertreter wirken ehrenamtlich. Der Verband gewährt ihnen eine Entschädigung für Zeitversäumnis und Aufwand.

Die Absätze 2 bis 5 gelten sinngemäß für die Stellvertreter.`,
  "§ 9 Aufgaben des Vorstands": `Der Vorstand bestimmt über alle Angelegenheiten des Verbands, soweit nicht nach § 6 der Satzung die Mitgliederversammlung oder nach § 11 der Präsident oder nach § 14 der Geschäftsführer zuständig sind. Zu den Aufgaben des Vorstands gehören insbesondere
• die Aufnahme von Mitgliedern,
• die Aufstellung des Wirtschaftsplans (§ 15 Satzung),
• die Genehmigung der Geschäftsordnung,
• die Vergabe von Arbeiten nach § 2 Abs. 8 der Satzung ab einer vom Vorstand generell zu bestimmenden Höhe,
• die Festsetzung der Beiträge nach § 16 Absatz 2 und 3 der Satzung,
• die Aufstellung des Jahresabschlusses,
• die Bestellung und Abberufung des Geschäftsführers und seines Stellvertreters mit Zustimmung der obersten Flurbereinigungsbehörde.

Der Vorstand hat über sonstige Angelegenheiten zu beschließen, die ihm der Präsident oder der Geschäftsführer vorlegt.`,
  "§ 10 Beschlussfassung des Vorstands": `Der Präsident beruft den Vorstand zu Sitzungen unter Mitteilung der Tagesordnung schriftlich ein. Die Ladungsfrist beträgt zwei Wochen, in dringenden Fällen kann diese Frist verkürzt werden.

Der Vorstand ist beschlussfähig, wenn alle Vorstandsmitglieder ordnungsgemäß geladen sind und mindestens die Hälfte anwesend ist. Ohne Rücksicht auf Form und Frist der Ladung ist er beschlussfähig, wenn alle Vorstandsmitglieder zustimmen.

Ohne Rücksicht auf die Anzahl der Erschienenen ist er beschlussfähig, wenn er zum zweiten Mal wegen desselben Gegenstandes rechtzeitig geladen wurde und hierbei mitgeteilt worden ist, dass ohne Rücksicht auf die Anzahl der Erschienenen beschlossen werden wird.

Auf schriftlichem Wege erzielte Beschlüsse sind gültig, wenn sie einstimmig von allen Vorstandsmitgliedern gefasst sind.

Der Vorstand entscheidet mit Stimmenmehrheit der anwesenden Vorstandsmitglieder. Bei Stimmengleichheit gilt ein Antrag als abgelehnt.`,
  "§ 11 Aufgaben des Präsidenten": `Der Präsident vertritt den Verband gerichtlich und außergerichtlich.

Er leitet die Mitgliederversammlung und die Vorstandssitzungen.`,
  "§ 12 Sitzungen der Verbandsorgane": `Von den Mitgliederversammlungen und Vorstandssitzungen ist die Aufsichtsbehörde unter Mitteilung der Tagesordnung rechtzeitig zu unterrichten.

Über die Beschlüsse der Mitgliederversammlung und des Vorstands fertigt der Geschäftsführer eine Niederschrift. Die Niederschrift muss insbesondere Ort und Tag der Sitzung, die Namen der anwesenden Mitglieder und Stellvertreter, die Namen der anwesenden Vorstandsmitglieder, die Namen der nach Absatz 3 zugezogenen Personen und der Vertreter der Aufsichtsbehörde sowie die Anträge und Beschlüsse mit dem jeweiligen Abstimmungsergebnis enthalten. Die Niederschrift ist vom Geschäftsführer zu unterzeichnen und vom Präsidenten gegenzuzeichnen.

Personen, die den Verbandsorganen nicht angehören, können durch Beschluss des Vorstandes zugezogen werden. Sie haben kein Stimmrecht.`,
  "§ 13 Geschäftsstelle": `Der Verband unterhält eine Geschäftsstelle.

Für den Dienstbetrieb des Verbandes gibt dieser sich eine Geschäftsordnung.`,
  "§ 14 Geschäftsführer": `Der hauptamtliche Geschäftsführer wird vom Vorstand mit Zustimmung der obersten Flurbereinigungsbehörde bestellt und abberufen. Er sollte über Erfahrungen in der Flurbereinigungsverwaltung verfügen.

Er ist für den Vollzug der Beschlüsse der Verbandsorgane verantwortlich. Er erledigt in diesem Rahmen die laufenden Geschäfte.

Der Geschäftsführer ist bevollmächtigt zum Abschluss von Verträgen, soweit in dieser Satzung nichts abweichendes geregelt ist.

Er ist Dienstvorgesetzter der Beschäftigten des Verbands.

Er nimmt an den Sitzungen der Verbandsorgane ohne Stimmrecht teil.`,
  "§ 15 Wirtschaftsjahr, Wirtschaftsplan": `Wirtschaftsjahr ist das Kalenderjahr.

Für jedes Wirtschaftsjahr entwirft der Geschäftsführer den Wirtschaftsplan.

Im Rahmen des Wirtschaftsplanes obliegen dem Geschäftsführer die Einstellung, Eingruppierung und Entlassung der Dienstkräfte; für die Einstellung von Ingenieuren oder Beschäftigten mit vergleichbarer Qualifikation ist die Zustimmung des Vorstandes, bei dem übrigen Personal das Einverständnis des Präsidenten erforderlich.`,
  "§ 16 Verbandsumlage und -beiträge und sonstige Einnahmen": `Der personelle und sächliche Aufwand für die Geschäftsstelle sowie für die der Geschäftsstelle zugeordneten Bediensteten in den Flurbereinigungsbezirken ist von den Mitgliedern durch eine jährliche Umlage aufzubringen; dazu gehören die Kosten für Gebäude bzw. Räume, EDV-Ausstattung und -Unterhaltung, Büromaterial, Einrichtungen und Verbindlichkeiten. Die Gemeinkosten sind dabei verursachungsgerecht auf den Baubetrieb und die sonstigen Aufgaben des VTG zu verteilen.

Die anteilige Höhe der Umlage richtet sich in der Regel nach dem Verhältnis der jährlichen Ausführungskosten des einzelnen Mitglieds zu den Gesamtausführungskosten aller Mitglieder im jeweiligen Jahr. Über die Höhe der Umlage und Ausnahmen beschließt die Mitgliederversammlung.

Für die gestellten Arbeitskräfte, Maschinen und Geräte sind zeitabhängige Beiträge (Stundensätze) zu erbringen. Die Höhe dieser Beiträge wird vom Vorstand festgesetzt.

Besondere Leistungen des Verbands können unter Berücksichtigung der tatsächlichen Aufwendungen gesondert abgerechnet werden. Diese Erstattung gilt insbesondere für Nichtmitglieder. Die Höhe wird vom Vorstand festgesetzt.

Auf die Umlage und die Beiträge nach § 16 der Satzung können Vorschüsse erhoben werden.

Für Schulden des Verbands haften die Mitglieder anteilig nach der Höhe der während ihrer Mitgliedschaft im Verband bis zum Zeitpunkt der Feststellung oder Anerkennung der Schuld angefallenen anteiligen Ausführungskosten ihrer Bodenordnungsverfahren.`,
  "§ 17 Hebung der Verbandsumlage und -beiträge, Rechtsbehelfe": `Der Verband erhebt die Umlage und die Beiträge nach § 16 der Satzung durch Bescheid.

Gegen den Bescheid kann innerhalb eines Monats nach dessen Bekanntgabe Widerspruch schriftlich oder zur Niederschrift bei der Geschäftsstelle des Verbandes oder der Aufsichtsbehörde eingelegt werden.

Der Widerspruch hat bezüglich der Zahlungsverpflichtung keine aufschiebende Wirkung.

Über den Widerspruch entscheidet die Aufsichtsbehörde (§ 141 FlurbG). Wird dem Widerspruch nicht abgeholfen, kann gegen die Entscheidung der Aufsichtsbehörde (Widerspruchsbescheid) innerhalb eines Monats nach Zustellung beim Flurbereinigungsgericht Klage erhoben werden.`,
  "§ 18 Rechnungslegung": `Der Vorstand hat für den Schluss eines jeden Wirtschaftsjahres entsprechend den handelsrechtlichen Vorschriften einen aus der Bilanz, der Gewinn- und Verlustrechnung und dem Lagebericht bestehenden Jahresabschluss aufzustellen und der Prüfstelle zuzuleiten.

Der Vorstand hat der Mitgliederversammlung den Jahresabschluss nach abgeschlossener Prüfung zur Beschlussfassung vorzulegen.

Die Prüfung des Jahresabschlusses wird von einer von der Aufsichtsbehörde zu bestimmenden Prüfstelle durchgeführt.`,
  "§ 19 Betretungsrecht": `Der Verband ist Beauftragter der Flurbereinigungsbehörde im Sinne von § 35 FlurbG und ist als solcher berechtigt, zur Vorbereitung und zur Durchführung der Bodenordnungsverfahren Grundstücke zu betreten und die nach seinem Ermessen erforderlichen Arbeiten auf ihnen vorzunehmen.`,
  "§ 20 Aufsicht": `Der Verband untersteht der Aufsicht der obersten Flurbereinigungsbehörde.

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

Die Aufsichtsbehörde kann sich auch durch Beauftragte über die Angelegenheiten des Verbandes unterrichten. Sie kann mündliche oder schriftliche Berichte verlangen, Akten und andere Unterlagen anfordern sowie an Ort und Stelle Prüfungen und Besichtigungen vornehmen.`,
  "§ 21 Übergangsregelung": `entfällt`,
  "§ 22 Inkrafttreten": `Der Verband entsteht, sofern mindestens 20 Teilnehmergemeinschaften den Zusammenschluss erklärt und diese Hauptsatzung beschlossen haben (§ 26a Abs. 2 FlurbG), am Tag der öffentlichen Bekanntmachung dieser Hauptsatzung im Staatsanzeiger Rheinland-Pfalz (§ 26a Abs. 1 FlurbG).

Jede Satzungsänderung tritt am ersten Tag des auf die Genehmigung durch die Aufsichtsbehörde folgenden Kalendermonats in Kraft.`,
};

async function loadSatzung(): Promise<Record<string, string>> {
  const result = await get(META_PATHNAME, { access: "private", useCache: false, token: BLOB_TOKEN }).catch(
    () => null,
  );
  if (!result || result.statusCode !== 200) {
    await saveSatzung(DEFAULT_BODY);
    return DEFAULT_BODY;
  }
  const text = await new Response(result.stream).text();
  const stored = JSON.parse(text) as Record<string, string>;
  return { ...DEFAULT_BODY, ...stored };
}

async function saveSatzung(entries: Record<string, string>): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(entries), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function getSatzungParagraphen(): Promise<{ title: string; body: string }[]> {
  const entries = await loadSatzung();
  return SATZUNG_TITEL.map((title) => ({ title, body: entries[title] ?? DEFAULT_BODY[title] ?? "" }));
}

export async function getSatzungParagraph(index: number): Promise<{ title: string; body: string } | undefined> {
  const title = SATZUNG_TITEL[index];
  if (!title) return undefined;
  const entries = await loadSatzung();
  return { title, body: entries[title] ?? DEFAULT_BODY[title] ?? "" };
}

export async function updateSatzungParagraph(index: number, body: string): Promise<void> {
  const title = SATZUNG_TITEL[index];
  if (!title) return;
  const entries = await loadSatzung();
  entries[title] = body;
  await saveSatzung(entries);
}
