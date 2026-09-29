// Erzeugt das oeffentliche VOB/VOL-PDF bei jedem Aufruf frisch aus den
// aktuellen getAllVobVolRows()-Daten (siehe /api/vob-vol/pdf/route.ts) — kein
// Caching, kein manueller PDF-Austausch mehr noetig. Ersetzt das bisherige
// statische public/downloads/Informationen_VOB_VOL.pdf.
//
// Nach dem Muster von finanzbericht-pdf.ts (A4_LANDSCAPE, ensureSpace/
// drawTableHeader-Wiederverwendung), aber erweitert um Zeilenumbruch pro
// Zelle: bei 18 Spalten auf einer A4-Querseite brauchen Freitext-Spalten
// (Teilnehmergemeinschaft, Art/Umfang der Leistung, Auftragnehmer) mehr als
// eine Zeile.
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { VobVolRow } from "@/lib/vob-vol";

const PAGE_MARGIN = 40;
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];
const CELL_FONT_SIZE = 7;
const LINE_HEIGHT = 8;
const CELL_PADDING_X = 3;
const CELL_PADDING_Y = 4;

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

function wrapText(text: string, maxWidth: number, font: PDFFont, size: number): string[] {
  if (!text) return [""];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const candidate = `${current} ${word}`;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

export async function generateVobVolPdf(rows: VobVolRow[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage(A4_LANDSCAPE);
  let width = page.getWidth();
  let height = page.getHeight();
  let y = height - PAGE_MARGIN;

  function colX(index: number): number {
    let x = PAGE_MARGIN;
    for (let i = 0; i < index; i++) x += COLUMNS[i].width;
    return x;
  }

  function drawTableHeader() {
    const headerLines = Math.max(...COLUMNS.map((c) => c.header.length));
    const rowHeight = headerLines * LINE_HEIGHT + CELL_PADDING_Y;
    const top = y;
    COLUMNS.forEach((col, i) => {
      const x = colX(i) + CELL_PADDING_X;
      col.header.forEach((line, li) => {
        page.drawText(line, {
          x,
          y: top - CELL_PADDING_Y - li * LINE_HEIGHT,
          size: CELL_FONT_SIZE,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
      });
    });
    y = top - rowHeight;
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end: { x: width - PAGE_MARGIN, y },
      thickness: 0.75,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 4;
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
    const rowHeight = maxLines * LINE_HEIGHT + CELL_PADDING_Y;

    ensureSpace(rowHeight);

    const top = y;
    COLUMNS.forEach((col, i) => {
      const x = colX(i) + CELL_PADDING_X;
      cellLines[i].forEach((line, li) => {
        page.drawText(line, {
          x,
          y: top - CELL_PADDING_Y - li * LINE_HEIGHT,
          size: CELL_FONT_SIZE,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
      });
    });
    y = top - rowHeight;
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end: { x: width - PAGE_MARGIN, y },
      thickness: 0.4,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  page.drawText("VOB/VOL-Vergaben", { x: PAGE_MARGIN, y, size: 14, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
  const stand = `Stand: ${new Date().toLocaleDateString("de-DE")}`;
  page.drawText(stand, {
    x: width - PAGE_MARGIN - font.widthOfTextAtSize(stand, 9),
    y,
    size: 9,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 20;

  drawTableHeader();

  for (const row of rows) {
    drawRow(row);
  }

  return doc.save();
}
