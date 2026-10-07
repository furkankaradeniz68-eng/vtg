// Erzeugt Finanzbericht-PDFs (Ausfuehrungskosten A1/A2, Einnahmen) bei
// Bedarf/On-Demand direkt aus findeFinanzDownloadKategorie() — denselben
// Zahlen, die die HTML-Berichtsseite fuer dasselbe Verfahren/Kategorie
// anzeigt. Dadurch ist die PDF immer so aktuell wie der letzte naechtliche
// BC-Sync, ohne eigene Vorberechnung/Cron-Job dafuer.
//
// Anders als die alte (bis 2026-10-07 gueltige) Version wird hier IMMER
// Laufzeit und Haushaltsjahr nebeneinander auf einer Seite gezeigt — genau
// wie im Original (vtg-rlp.de/?page_id=775/794/804) — und alle Gruppen sind
// vollstaendig aufgeklappt (kein Akkordeon in der PDF, siehe Vorgabe: "Auf
// der Webseite bleibt es aufklappbar nur auf der PDF muss alles natuerlich
// aufgeklappt sein").
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FinanzDownloadKategorie, FinanzDownloadZeile, FinanzDownloadSpalten } from "@/lib/bc-budget-lines";
import type { Verfahren } from "@/lib/bc-companies";

const PAGE_MARGIN = 36;
const A4_PORTRAIT: [number, number] = [595.28, 841.89];
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

function formatEuro(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatEuroOrBlank(n: number | null): string {
  return n === null ? "" : formatEuro(n);
}

function formatProzentOrBlank(n: number | null): string {
  if (n === null) return "";
  return n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export async function generateFinanzberichtPdf(params: {
  verfahren: Verfahren;
  kategorie: FinanzDownloadKategorie;
  orientation: "portrait" | "landscape";
}): Promise<Uint8Array> {
  const { verfahren, kategorie, orientation } = params;
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageSize = orientation === "landscape" ? A4_LANDSCAPE : A4_PORTRAIT;
  let page = doc.addPage(pageSize);
  let width = page.getWidth();
  let height = page.getHeight();
  let y = height - PAGE_MARGIN;

  const titel = `${kategorie.titel}${kategorie.suffix ? `/${kategorie.suffix}` : ""}`;

  // Je Ansicht-Block die sichtbaren Unterspalten — bei A2/Einnahmen nur der
  // rohe Betrag (kein Plan/Diff im Original), bei A1 der volle Soll-Ist-Satz.
  // Beschriftungen 1:1 aus dem Original (Ausführungskosten-A1.pdf): die
  // Laufzeit-Seite hat "Gesamt Ausgaben"/"FinPl EUR", die Haushaltsjahr-Seite
  // nur "Ausgaben"/"Jahresprog" (ohne Punkt).
  const vollSpalten = kategorie.vollSpalten;
  type SpaltenKey = keyof FinanzDownloadSpalten;
  const subCols: { key: SpaltenKey; laufzeitLabel: string; haushaltsjahrLabel: string }[] = vollSpalten
    ? [
        { key: "ausgaben", laufzeitLabel: "Gesamt Ausgaben", haushaltsjahrLabel: "Ausgaben" },
        { key: "nichtZuFaehig", laufzeitLabel: "nicht zu.fä.", haushaltsjahrLabel: "nicht zu.fä." },
        { key: "plan", laufzeitLabel: "FinPl EUR", haushaltsjahrLabel: "Jahresprog" },
        { key: "diffEur", laufzeitLabel: "Diff EUR", haushaltsjahrLabel: "Diff EUR" },
        { key: "diffProz", laufzeitLabel: "Diff %", haushaltsjahrLabel: "Diff %" },
      ]
    : [{ key: "ausgaben", laufzeitLabel: "Betrag", haushaltsjahrLabel: "Betrag" }];

  const kontoSpalteBreite = vollSpalten ? 150 : 220;
  const nutzbareBreite = width - 2 * PAGE_MARGIN - kontoSpalteBreite;
  const spaltenAnzahl = subCols.length * 2;
  const spaltenBreite = nutzbareBreite / spaltenAnzahl;
  const kontoX = PAGE_MARGIN;
  const laufzeitStartX = PAGE_MARGIN + kontoSpalteBreite;
  const haushaltsjahrStartX = laufzeitStartX + subCols.length * spaltenBreite;

  function subX(blockStartX: number, index: number): number {
    return blockStartX + index * spaltenBreite + spaltenBreite - 4;
  }

  function drawText(text: string, x: number, yPos: number, opts: { size?: number; bold?: boolean; align?: "left" | "right" } = {}) {
    const size = opts.size ?? 7.5;
    const usedFont = opts.bold ? boldFont : font;
    const drawX = opts.align === "right" ? x - usedFont.widthOfTextAtSize(text, size) : x;
    page.drawText(text, { x: drawX, y: yPos, size, font: usedFont, color: rgb(0.1, 0.1, 0.1) });
  }

  function drawTableHeader() {
    drawText("Soll - Ist Vergleich", kontoX, y, { bold: true, size: 9 });
    drawText("Laufzeit", laufzeitStartX, y, { bold: true, size: 9 });
    drawText("Haushaltsjahr", haushaltsjahrStartX, y, { bold: true, size: 9 });
    y -= 13;
    drawText("Bezeichnung", kontoX, y, { bold: true });
    for (let i = 0; i < subCols.length; i++) {
      drawText(subCols[i].laufzeitLabel, subX(laufzeitStartX, i), y, { bold: true, align: "right" });
      drawText(subCols[i].haushaltsjahrLabel, subX(haushaltsjahrStartX, i), y, { bold: true, align: "right" });
    }
    y -= 6;
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end: { x: width - PAGE_MARGIN, y },
      thickness: 0.5,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 13;
  }

  function ensureSpace(rowHeight: number) {
    if (y - rowHeight < PAGE_MARGIN) {
      page = doc.addPage(pageSize);
      width = page.getWidth();
      height = page.getHeight();
      y = height - PAGE_MARGIN;
      drawTableHeader();
    }
  }

  function drawRow(zeile: FinanzDownloadZeile, opts: { bold?: boolean; fill?: boolean; indent?: boolean } = {}) {
    ensureSpace(15);
    if (opts.fill) {
      page.drawRectangle({
        x: PAGE_MARGIN - 3,
        y: y - 3,
        width: width - 2 * PAGE_MARGIN + 6,
        height: 13,
        color: rgb(0.88, 0.88, 0.88),
      });
    }
    drawText(opts.indent ? `  ${zeile.konto}` : zeile.konto, kontoX, y, { bold: opts.bold });
    for (let i = 0; i < subCols.length; i++) {
      const key = subCols[i].key;
      const lWert = zeile.laufzeit[key];
      const hjWert = zeile.haushaltsjahr[key];
      const text = key === "diffProz" ? formatProzentOrBlank(lWert) : formatEuroOrBlank(lWert);
      const hjText = key === "diffProz" ? formatProzentOrBlank(hjWert) : formatEuroOrBlank(hjWert);
      drawText(text, subX(laufzeitStartX, i), y, { bold: opts.bold, align: "right" });
      drawText(hjText, subX(haushaltsjahrStartX, i), y, { bold: opts.bold, align: "right" });
    }
    y -= 13;
  }

  drawText(titel, PAGE_MARGIN, y, { size: 15, bold: true });
  y -= 20;
  drawText(`${verfahren.nr} ${verfahren.name}`, PAGE_MARGIN, y, { size: 10, bold: true });
  drawText(`HJ: ${verfahren.hj}`, width - PAGE_MARGIN - 140, y, { size: 8 });
  y -= 12;
  drawText(`Stand: ${verfahren.stand}`, width - PAGE_MARGIN - 140, y, { size: 8 });
  y -= 18;

  drawTableHeader();

  for (const zeile of kategorie.zeilen) {
    if (zeile.typ === "gruppe") {
      drawRow(zeile, { bold: true, fill: true });
    } else if (zeile.typ === "gesamt" || zeile.typ === "sonder") {
      y -= 3;
      ensureSpace(16);
      page.drawLine({
        start: { x: PAGE_MARGIN, y: y + 10 },
        end: { x: width - PAGE_MARGIN, y: y + 10 },
        thickness: 0.5,
        color: rgb(0.6, 0.6, 0.6),
      });
      drawRow(zeile, { bold: true, fill: true });
    } else {
      drawRow(zeile, { indent: true });
    }
  }

  return doc.save();
}
