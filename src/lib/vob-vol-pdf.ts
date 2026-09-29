// Erzeugt das oeffentliche VOB/VOL-PDF bei jedem Aufruf frisch aus den
// aktuellen getAllVobVolRows()-Daten (siehe /api/vob-vol/pdf/route.ts) — kein
// Caching, kein manueller PDF-Austausch mehr noetig. Ersetzt das bisherige
// statische public/downloads/Informationen_VOB_VOL.pdf.
//
// Nach dem Muster von finanzbericht-pdf.ts (A4_LANDSCAPE, ensureSpace/
// drawTableHeader-Wiederverwendung), aber erweitert um Zeilenumbruch pro
// Zelle: bei 18 Spalten auf einer A4-Querseite brauchen Freitext-Spalten
// (Teilnehmergemeinschaft, Art/Umfang der Leistung, Auftragnehmer) mehr als
// eine Zeile. wrapText() bricht dabei auch einzelne Woerter/Bindestrich-
// Ketten, die selbst breiter als die Spalte sind, hart um -- sonst liefe der
// Text in die Nachbarspalte und alles wirkt "verschoben"/ueberlappend.
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { VobVolRow } from "@/lib/vob-vol";

const PAGE_MARGIN = 40;
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];
const CELL_FONT_SIZE = 5;
const LINE_HEIGHT = 6;
const CELL_PADDING_X = 2;
const CELL_PADDING_Y = 3;
const GRID_COLOR = rgb(0.75, 0.75, 0.75);

// Logo+Schriftzug als eine flache Grafik (siehe Header.tsx/Footer.tsx),
// dieselbe Datei wie auf der oeffentlichen Website. fs.readFileSync statt
// next/image, da hier Rohbytes fuer pdf-lib's embedPng() gebraucht werden.
// public/ wird sonst nur statisch ausgeliefert -- siehe
// outputFileTracingIncludes in next.config.ts, sonst ENOENT auf Vercel.
const LOGO_PATH = path.join(process.cwd(), "public", "images", "logo", "vtg-schrift.png");

type Column = {
  key: keyof VobVolRow;
  header: string[];
  width: number;
};

const COLUMNS: Column[] = [
  { key: "prodNr", header: ["ProdNr"], width: 30 },
  { key: "jahr", header: ["Jahr"], width: 26 },
  { key: "teilnehmergemeinschaft", header: ["Teilnehmer-", "gemeinschaft"], width: 80 },
  { key: "aussenstelle", header: ["Außen-", "stelle"], width: 40 },
  { key: "artDerLeistung", header: ["Art der", "Leistung"], width: 55 },
  { key: "umfangDerLeistung", header: ["Umfang der", "Leistung"], width: 80 },
  { key: "kwVon", header: ["KW", "von"], width: 24 },
  { key: "kwBis", header: ["KW", "bis"], width: 24 },
  { key: "vobVol", header: ["VOB/", "VOL"], width: 28 },
  { key: "vergabeart", header: ["Vergabe-", "art"], width: 42 },
  { key: "kostenermittlung", header: ["Kosten-", "ermittl.", "[EUR]"], width: 48 },
  { key: "anzahlAufforderungen", header: ["Anz.", "Auffor-", "derungen"], width: 34 },
  { key: "anzahlAngebote", header: ["Anz.", "Ange-", "bote"], width: 30 },
  { key: "auftragsdatum", header: ["Auftrags-", "datum"], width: 40 },
  { key: "auftragnehmer", header: ["Auftrag-", "nehmer"], width: 80 },
  { key: "auftragssumme", header: ["Auftrags-", "summe", "[EUR]"], width: 48 },
  { key: "vorabinfo", header: ["Vorab-", "info"], width: 26 },
  { key: "infoZuschlag", header: ["Info", "Zuschlag"], width: 26 },
];

// Bricht zunaechst wortweise um (wie zuvor), zerlegt aber ein einzelnes Wort
// (bzw. eine Bindestrich-Kette ohne Leerzeichen), das schon fuer sich breiter
// als die Spalte ist, zusaetzlich zeichenweise -- verhindert horizontalen
// Ueberlauf in die naechste Spalte.
function wrapText(text: string, maxWidth: number, font: PDFFont, size: number): string[] {
  if (!text) return [""];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  function breakLongWord(word: string): string[] {
    const parts: string[] = [];
    let chunk = "";
    for (const ch of word) {
      const candidate = chunk + ch;
      if (chunk && font.widthOfTextAtSize(candidate, size) > maxWidth) {
        parts.push(chunk);
        chunk = ch;
      } else {
        chunk = candidate;
      }
    }
    if (chunk) parts.push(chunk);
    return parts;
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
      current = "";
    }
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
    } else {
      const brokenParts = breakLongWord(word);
      for (let i = 0; i < brokenParts.length - 1; i++) lines.push(brokenParts[i]);
      current = brokenParts[brokenParts.length - 1] ?? "";
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export async function generateVobVolPdf(rows: VobVolRow[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const logoImage = await doc.embedPng(readFileSync(LOGO_PATH));

  let page = doc.addPage(A4_LANDSCAPE);
  let width = page.getWidth();
  let height = page.getHeight();
  let y = height - PAGE_MARGIN;

  // Baseline-Versatz vom oberen Rand eines LINE_HEIGHT-Zeilenslots, der das
  // Schriftbild (Versal-/Oberlaengenhoehe + Unterlaenge) exakt darin
  // zentriert -- rein pauschales "y = top - CELL_PADDING_Y" liess die
  // Oberlaenge bei 5pt Schrift leicht ueber die obere Gitterlinie hinausragen
  // (wirkte wie Ueberlappung). Fontgroessen-abhaengig statt geraten, damit es
  // fuer beide Fonts/Groessen exakt passt.
  function baselineOffsetFor(useFont: PDFFont, size: number): number {
    const ascent = useFont.heightAtSize(size, { descender: false });
    const descent = useFont.heightAtSize(size, { descender: true }) - ascent;
    return (LINE_HEIGHT + ascent - descent) / 2;
  }
  const bodyBaselineOffset = baselineOffsetFor(font, CELL_FONT_SIZE);
  const headerBaselineOffset = baselineOffsetFor(boldFont, CELL_FONT_SIZE);

  function colX(index: number): number {
    let x = PAGE_MARGIN;
    for (let i = 0; i < index; i++) x += COLUMNS[i].width;
    return x;
  }

  // Duenne vertikale Trennlinien zwischen allen Spalten (inkl. aeusserem
  // Rand links/rechts) fuer den Bereich [bottom, top] -- ergibt zusammen mit
  // den horizontalen Zeilenlinien ein durchgehendes Tabellenraster wie im
  // Original-PDF, statt nur einzelner Zeilenlinien.
  function drawColumnGrid(top: number, bottom: number) {
    for (let i = 0; i <= COLUMNS.length; i++) {
      const x = colX(i);
      page.drawLine({ start: { x, y: top }, end: { x, y: bottom }, thickness: 0.4, color: GRID_COLOR });
    }
  }

  // Zeichnet linksbuendigen Zelltext, dessen Zeilenblock vertikal in der
  // (ggf. hoeheren, weil eine andere Zelle in derselben Zeile mehr Zeilen
  // braucht) Zellenhoehe zentriert ist -- verhindert, dass einzeilige Zellen
  // oben "kleben" und unten ein grosser Leerraum entsteht.
  function drawCellLines(
    lines: string[],
    x: number,
    rowTop: number,
    maxLines: number,
    useFont: PDFFont,
    baselineOffset: number,
    color: ReturnType<typeof rgb>,
  ) {
    const linesOffset = (maxLines - lines.length) / 2;
    lines.forEach((line, li) => {
      const slotTop = rowTop - CELL_PADDING_Y - (linesOffset + li) * LINE_HEIGHT;
      page.drawText(line, { x, y: slotTop - baselineOffset, size: CELL_FONT_SIZE, font: useFont, color });
    });
  }

  function drawTableHeader() {
    const headerLines = Math.max(...COLUMNS.map((c) => c.header.length));
    const rowHeight = headerLines * LINE_HEIGHT + 2 * CELL_PADDING_Y;
    const top = y;
    COLUMNS.forEach((col, i) => {
      const x = colX(i) + CELL_PADDING_X;
      drawCellLines(col.header, x, top, headerLines, boldFont, headerBaselineOffset, rgb(0.1, 0.1, 0.1));
    });
    y = top - rowHeight;
    page.drawLine({
      start: { x: PAGE_MARGIN, y: top },
      end: { x: width - PAGE_MARGIN, y: top },
      thickness: 0.75,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end: { x: width - PAGE_MARGIN, y },
      thickness: 0.75,
      color: rgb(0.3, 0.3, 0.3),
    });
    drawColumnGrid(top, y);
  }

  function ensureSpace(rowHeight: number) {
    if (y - rowHeight < PAGE_MARGIN) {
      page = doc.addPage(A4_LANDSCAPE);
      width = page.getWidth();
      height = page.getHeight();
      y = height - PAGE_MARGIN;
      drawTableHeader();
    }
  }

  function drawRow(row: VobVolRow) {
    const cellLines = COLUMNS.map((col) =>
      wrapText(String(row[col.key] ?? ""), col.width - 2 * CELL_PADDING_X, font, CELL_FONT_SIZE),
    );
    const maxLines = Math.max(...cellLines.map((lines) => lines.length));
    const rowHeight = maxLines * LINE_HEIGHT + 2 * CELL_PADDING_Y;

    ensureSpace(rowHeight);

    const top = y;
    COLUMNS.forEach((col, i) => {
      const x = colX(i) + CELL_PADDING_X;
      drawCellLines(cellLines[i], x, top, maxLines, font, bodyBaselineOffset, rgb(0.15, 0.15, 0.15));
    });
    y = top - rowHeight;
    page.drawLine({ start: { x: PAGE_MARGIN, y }, end: { x: width - PAGE_MARGIN, y }, thickness: 0.4, color: GRID_COLOR });
    drawColumnGrid(top, y);
  }

  // Briefkopf (nur auf Seite 1, wie im Original): Logo+Schriftzug links,
  // Dokumenttitel rechts daneben vertikal zentriert, Stand oben rechts.
  const logoWidth = 200;
  const logoHeight = logoWidth / (logoImage.width / logoImage.height);
  const logoTop = y;
  page.drawImage(logoImage, { x: PAGE_MARGIN, y: logoTop - logoHeight, width: logoWidth, height: logoHeight });

  page.drawText("VOB/VOL-Vergaben", {
    x: PAGE_MARGIN + logoWidth + 24,
    y: logoTop - logoHeight / 2 - 2,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  const stand = `Stand: ${new Date().toLocaleDateString("de-DE")}`;
  page.drawText(stand, {
    x: width - PAGE_MARGIN - font.widthOfTextAtSize(stand, 9),
    y: logoTop - 10,
    size: 9,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Rechtsgrundlagen-/Kontakt-Hinweistext aus dem Original-PDF (nur Seite 1,
  // direkt unter dem Briefkopf, vor der Tabelle) -- ging bei der ersten
  // Layout-Ueberarbeitung verloren und wird hier wieder ergaenzt.
  const introFontSize = 9;
  const introLineHeight = 12;
  const introMaxWidth = width - 2 * PAGE_MARGIN;
  const introParagraphs = [
    "Informationen über beabsichtigte beschränkte Ausschreibungen gemäß § 19 Abs. 5 VOB/A und Dokumentation vergebenener Aufträge gemäß § 20 Abs. 3 VOB/A sowie § 19 Abs. 2 VOL/L",
    "Die Kontaktinformationen zu der jeweiligen VTG-Außenstelle finden Sie bei www.vtg-rlp.de unter Kontakte",
  ];

  let introY = logoTop - logoHeight - 16;
  for (const paragraph of introParagraphs) {
    for (const line of wrapText(paragraph, introMaxWidth, font, introFontSize)) {
      page.drawText(line, { x: PAGE_MARGIN, y: introY, size: introFontSize, font, color: rgb(0.2, 0.2, 0.2) });
      introY -= introLineHeight;
    }
  }

  y = introY - 8;

  drawTableHeader();

  for (const row of rows) {
    drawRow(row);
  }

  return doc.save();
}
