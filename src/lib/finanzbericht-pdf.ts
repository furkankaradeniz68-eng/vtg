// Erzeugt Finanzbericht-PDFs (Ausfuehrungskosten A1/A2, Einnahmen) bei
// Bedarf/On-Demand direkt aus den aktuellen findeFinanzKategorie()-Daten —
// denselben Zahlen, die die HTML-Berichtsseite fuer dasselbe Verfahren/
// Kategorie/Ansicht anzeigt. Dadurch ist die PDF immer so aktuell wie der
// letzte naechtliche BC-Sync, ohne eigene Vorberechnung/Cron-Job dafuer.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FinanzKategorie, FinanzAnsicht } from "@/lib/bc-budget-lines";
import type { Verfahren } from "@/lib/bc-companies";

const PAGE_MARGIN = 40;
const A4_PORTRAIT: [number, number] = [595.28, 841.89];
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

function formatEuro(n: number): string {
  return `${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

export async function generateFinanzberichtPdf(params: {
  verfahren: Verfahren;
  kategorie: FinanzKategorie;
  ansicht: FinanzAnsicht;
  planLabel: string;
  orientation: "portrait" | "landscape";
}): Promise<Uint8Array> {
  const { verfahren, kategorie, ansicht, planLabel, orientation } = params;
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageSize = orientation === "landscape" ? A4_LANDSCAPE : A4_PORTRAIT;
  let page = doc.addPage(pageSize);
  let width = page.getWidth();
  let height = page.getHeight();
  let y = height - PAGE_MARGIN;

  const ansichtLabel = ansicht === "laufzeit" ? "Laufzeit" : "Haushaltsjahr";
  const titel = `${kategorie.titel}${kategorie.suffix ? `/${kategorie.suffix}` : ""} (${ansichtLabel})`;

  function drawText(
    text: string,
    x: number,
    yPos: number,
    opts: { size?: number; bold?: boolean } = {},
  ) {
    page.drawText(text, {
      x,
      y: yPos,
      size: opts.size ?? 9,
      font: opts.bold ? boldFont : font,
      color: rgb(0.1, 0.1, 0.1),
    });
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

  const col1X = PAGE_MARGIN;
  const col2X = width - PAGE_MARGIN - 330;
  const col3X = width - PAGE_MARGIN - 220;
  const col4X = width - PAGE_MARGIN - 110;

  function drawTableHeader() {
    drawText("Konto", col1X, y, { bold: true });
    drawText("Ausgaben", col2X, y, { bold: true });
    drawText(planLabel, col3X, y, { bold: true });
    drawText("Differenz", col4X, y, { bold: true });
    y -= 6;
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end: { x: width - PAGE_MARGIN, y },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });
    y -= 14;
  }

  function drawRow(konto: string, ausgaben: number, plan: number, opts: { bold?: boolean; fill?: boolean } = {}) {
    ensureSpace(18);
    if (opts.fill) {
      page.drawRectangle({
        x: PAGE_MARGIN - 4,
        y: y - 4,
        width: width - 2 * PAGE_MARGIN + 8,
        height: 16,
        color: rgb(0.98, 0.82, 0.29),
      });
    }
    const differenz = plan - ausgaben;
    drawText(konto, col1X, y, { bold: opts.bold });
    drawText(formatEuro(ausgaben), col2X, y, { bold: opts.bold });
    drawText(formatEuro(plan), col3X, y, { bold: opts.bold });
    drawText(formatEuro(differenz), col4X, y, { bold: opts.bold });
    y -= 16;
  }

  drawText(titel, PAGE_MARGIN, y, { size: 16, bold: true });
  y -= 22;
  drawText(`${verfahren.nr} ${verfahren.name}`, PAGE_MARGIN, y, { size: 11, bold: true });
  drawText(`HJ: ${verfahren.hj}`, width - PAGE_MARGIN - 140, y, { size: 9 });
  y -= 14;
  drawText(`Stand: ${verfahren.stand}`, width - PAGE_MARGIN - 140, y, { size: 9 });
  y -= 24;

  drawTableHeader();

  for (const zeile of kategorie.zeilen) {
    if (zeile.typ === "gruppe") {
      drawRow(zeile.konto, zeile.ausgaben, zeile.plan, { bold: true, fill: true });
    } else if (zeile.typ === "gesamt") {
      y -= 4;
      ensureSpace(20);
      page.drawLine({
        start: { x: PAGE_MARGIN, y: y + 12 },
        end: { x: width - PAGE_MARGIN, y: y + 12 },
        thickness: 0.5,
        color: rgb(0.6, 0.6, 0.6),
      });
      drawRow(zeile.konto, zeile.ausgaben, zeile.plan, { bold: true, fill: true });
    } else {
      drawRow(`   ${zeile.konto}`, zeile.ausgaben, zeile.plan);
    }
  }

  return doc.save();
}
