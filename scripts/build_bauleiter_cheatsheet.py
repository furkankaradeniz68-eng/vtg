#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Erzeugt die kompakte Bauleiter-Dashboard-Kurzanleitung (VTG Rheinland-Pfalz) als PDF.
Nutzung: python3 scripts/build_bauleiter_cheatsheet.py
Ausgabe: ~/Desktop/VTG-RLP-Bauleiter-Anleitung.pdf
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable,
    ListItem, KeepTogether, HRFlowable, Image as RLImage,
)
from PIL import Image as PILImage

OUTPUT_PATH = os.path.expanduser("~/Desktop/VTG-RLP-Bauleiter-Anleitung.pdf")
IMG_DIR = os.path.expanduser("~/Desktop/vtg-screenshots")

YELLOW = colors.HexColor("#F5B800")
ORANGE = colors.HexColor("#E0631E")
DARK = colors.HexColor("#1F2328")
GREY = colors.HexColor("#595959")
LIGHTGREY = colors.HexColor("#EFEFEF")

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleVTG", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=20, textColor=DARK, spaceAfter=2,
)
subtitle_style = ParagraphStyle(
    "SubtitleVTG", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, textColor=GREY, spaceAfter=10,
)
intro_style = ParagraphStyle(
    "IntroVTG", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.3, textColor=DARK, leading=13, spaceAfter=4,
)
h2_style = ParagraphStyle(
    "H2VTG", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=12.5, textColor=DARK, spaceBefore=2, spaceAfter=3,
)
tab_path_style = ParagraphStyle(
    "TabPathVTG", parent=styles["Normal"], fontName="Courier",
    fontSize=8, textColor=ORANGE, spaceAfter=5,
)
body_style = ParagraphStyle(
    "BodyVTG", parent=styles["Normal"], fontName="Helvetica",
    fontSize=8.8, textColor=DARK, leading=12.4, alignment=TA_LEFT,
)
label_style = ParagraphStyle(
    "LabelVTG", parent=body_style, fontName="Helvetica-Bold", fontSize=8.8,
    textColor=DARK, spaceBefore=3, spaceAfter=1,
)
bullet_style = ParagraphStyle(
    "BulletVTG", parent=body_style, fontSize=8.6, leading=11.8,
)
where_style = ParagraphStyle(
    "WhereVTG", parent=body_style, fontSize=8.4, leading=11.6, textColor=GREY,
)
note_style = ParagraphStyle(
    "NoteVTG", parent=body_style, fontSize=8.3, leading=11.5, textColor=GREY,
    fontName="Helvetica-Oblique",
)
box_label_style = ParagraphStyle(
    "BoxLabelVTG", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=7.8, textColor=GREY, alignment=1,
)
field_style = ParagraphStyle(
    "FieldVTG", parent=styles["Normal"], fontName="Helvetica",
    fontSize=7.9, textColor=DARK, leading=11,
)


def screenshot_placeholder(path: str, height_cm: float = 1.9) -> Table:
    label = Paragraph(
        f"Screenshot-Platzhalter &mdash; wird ersetzt<br/><font face='Courier' size='7.5'>{path}</font>",
        box_label_style,
    )
    t = Table([[label]], colWidths=[5.6 * cm], rowHeights=[height_cm * cm])
    t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#BFBFBF")),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHTGREY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return t


def screenshot_box(filename: str, path: str, box_width_cm: float = 5.8,
                    max_height_cm: float = 6.3) -> Table:
    """Echter Screenshot (gerahmt) falls Datei in IMG_DIR vorhanden, sonst Platzhalter."""
    full_path = os.path.join(IMG_DIR, filename)
    if not os.path.isfile(full_path):
        return screenshot_placeholder(path)

    with PILImage.open(full_path) as im:
        w_px, h_px = im.size
    width = box_width_cm * cm
    height = width * h_px / w_px
    if height > max_height_cm * cm:
        height = max_height_cm * cm
        width = height * w_px / h_px

    img = RLImage(full_path, width=width, height=height)
    framed = Table([[img]], colWidths=[width])
    framed.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#BFBFBF")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 1),
        ("RIGHTPADDING", (0, 0), (-1, -1), 1),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return framed


def build():
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=A4,
        leftMargin=1.6 * cm, rightMargin=1.6 * cm,
        topMargin=1.0 * cm, bottomMargin=1.0 * cm,
        title="VTG Rheinland-Pfalz – Bauleiter-Dashboard Kurzanleitung",
    )

    story = []

    # --- Kopfbereich ---
    header_bar = Table([[""]], colWidths=[18.0 * cm], rowHeights=[0.25 * cm])
    header_bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), YELLOW)]))
    story.append(header_bar)
    story.append(Spacer(1, 8))
    story.append(Paragraph("Bauleiter-Dashboard &ndash; Kurzanleitung", title_style))
    story.append(Paragraph(
        "VTG Rheinland-Pfalz &middot; Zugriff: Anmeldung unter <font face='Courier'>/login</font> mit dem "
        "gemeinsamen Bauleiter-Zugang (ein Benutzername für alle Bauleiter). Nach dem Login geht es "
        "automatisch direkt zu <font face='Courier'>/bauleiter</font> &ndash; ein eigenständiges Dashboard, "
        "komplett getrennt vom normalen Menü und vom Admin-Dashboard.",
        subtitle_style,
    ))
    # --- Zugangsdaten ---
    cred_table = Table(
        [
            [Paragraph("<b>Benutzername</b>", label_style), Paragraph("<b>Kennwort</b>", label_style)],
            [Paragraph("Bauleiter", body_style), Paragraph("Vtg-Bauleiter26", body_style)],
        ],
        colWidths=[6 * cm, 6 * cm],
    )
    cred_table.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#BFBFBF")),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#DADADA")),
        ("BACKGROUND", (0, 0), (-1, 0), LIGHTGREY),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    cred_box = Table(
        [
            [Paragraph("Zugangsdaten für diesen Bereich", label_style)],
            [Spacer(1, 3)],
            [cred_table],
            [Spacer(1, 3)],
            [Paragraph(
                "Ein gemeinsamer Zugang für alle Bauleiter (keine individuellen Konten). Dieses Dokument "
                "enthält Klartext-Zugangsdaten &ndash; vertraulich behandeln und nicht unverschlüsselt "
                "weiterleiten.",
                note_style,
            )],
        ],
        colWidths=[17.7 * cm],
    )
    cred_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF6DF")),
        ("BOX", (0, 0), (-1, -1), 0.6, YELLOW),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(cred_box)
    story.append(Spacer(1, 4))

    story.append(Paragraph(
        "<b>Einzige Funktion dieses Zugangs:</b> die VOB/VOL-Vergabetabelle pflegen. Es gibt keine weiteren "
        "Bereiche, Tabs oder Einstellungen &ndash; diese eine Anleitung deckt das komplette Dashboard ab.",
        intro_style,
    ))
    story.append(Spacer(1, 4))

    # --- Abschnitt: VOB/VOL-Vergaben ---
    text_col = [
        Paragraph(
            "Tabelle aller VOB/VOL-Vergaben führen. Das öffentliche Info-PDF auf der Website wird bei "
            "jedem Download live aus genau diesen Daten neu erzeugt &ndash; es gibt keine separat "
            "gepflegte PDF-Datei mehr.",
            body_style,
        ),
        Spacer(1, 2),
        Paragraph("Was du änderst:", label_style),
        ListFlowable([
            ListItem(Paragraph(
                "<b>Neue Zeile</b> über den Button „Neue Zeile“ anlegen (siehe Felderliste unten)",
                bullet_style,
            ), leftIndent=10),
            ListItem(Paragraph(
                "Bestehende Zeile über „Bearbeiten“ ändern oder über „Zeile entfernen“ löschen",
                bullet_style,
            ), leftIndent=10),
            ListItem(Paragraph(
                "Der Jahr-Filter oben in der Übersicht ist nur eine Anzeigehilfe &ndash; er ändert keine "
                "Daten, sondern blendet nur Zeilen anderer Jahre aus",
                bullet_style,
            ), leftIndent=10),
        ], bulletType="bullet", leftIndent=8, spaceAfter=3, bulletFontSize=6, bulletOffsetY=1),
        Paragraph("Wo es sichtbar wird:", label_style),
        Paragraph(
            "Öffentliche Seite <font face='Courier'>/vob-vol</font> &middot; Download „Informationen "
            "VOB/VOL“ (<font face='Courier'>/api/vob-vol/pdf</font>) &ndash; kein Login nötig, jeder "
            "Seitenaufruf erzeugt das PDF frisch.",
            where_style,
        ),
        Spacer(1, 2),
        Paragraph(
            "Hinweis: Alle Felder sind bewusst Freitext &ndash; auch scheinbar numerische Spalten wie "
            "„Auftragssumme“ dürfen Werte wie „Stundenlohn“ oder „läuft noch“ enthalten, genau wie im "
            "ursprünglichen Dokument. Es gibt keine Plausibilitätsprüfung der Eingaben.",
            note_style,
        ),
    ]
    row = Table(
        [[text_col, screenshot_box("bauleiter-1-uebersicht.png", "/bauleiter", box_width_cm=5.0)]],
        colWidths=[11.3 * cm, 5.8 * cm],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(Paragraph("1&nbsp;&nbsp;VOB/VOL-Vergaben", h2_style))
    story.append(Paragraph("/bauleiter", tab_path_style))
    story.append(row)
    story.append(Spacer(1, 5))
    story.append(HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#DADADA")))
    story.append(Spacer(1, 5))

    # --- Abschnitt: Felder im Formular ---
    story.append(Paragraph("2&nbsp;&nbsp;Felder im Formular „Neue Zeile“ / „Bearbeiten“", h2_style))
    story.append(Paragraph("/bauleiter/neu &middot; /bauleiter/[id]/bearbeiten", tab_path_style))

    fields = [
        "ProdNr", "Jahr", "Teilnehmergemeinschaft", "VTG Außenstelle",
        "Art der Leistung", "Umfang der Leistung", "KW von", "KW bis",
        "VOB/VOL", "Vergabeart", "Kostenermittlung [EUR]", "Anzahl Aufforderungen",
        "Anzahl Angebote", "Auftragsdatum", "Auftragnehmer", "Auftragssumme [EUR brutto]",
        "Vorabinfo §20(4)", "Info Zuschlag §20(3)/§30(1)",
    ]
    # 3 Spalten à 6 Felder fuer kompakte Darstellung
    rows_per_col = 6
    cols = [fields[i:i + rows_per_col] for i in range(0, len(fields), rows_per_col)]
    max_len = max(len(c) for c in cols)
    for c in cols:
        c.extend([""] * (max_len - len(c)))
    table_data = []
    for r in range(max_len):
        table_data.append([Paragraph(f"&bull;&nbsp;{cols[c][r]}" if cols[c][r] else "", field_style) for c in range(len(cols))])

    fields_table = Table(table_data, colWidths=[5.9 * cm] * len(cols))
    fields_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))

    text_col2 = [
        Paragraph(
            "Alle 18 Spalten der ursprünglichen Vergabeliste stehen als einzelne Felder zur Verfügung "
            "(identische Reihenfolge wie im alten PDF):",
            body_style,
        ),
        Spacer(1, 3),
        fields_table,
    ]
    row2 = Table(
        [[text_col2, screenshot_box("bauleiter-2-neue-zeile.png", "/bauleiter/neu", box_width_cm=5.0)]],
        colWidths=[11.3 * cm, 5.8 * cm],
    )
    row2.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(row2)
    story.append(Spacer(1, 5))
    story.append(HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#DADADA")))
    story.append(Spacer(1, 5))

    # --- Hinweisbox Zugang ---
    access_note = Table(
        [[Paragraph(
            "<b>Zum Zugang:</b> Es gibt nur einen gemeinsamen Benutzernamen für alle Bauleiter (kein "
            "Admin-Dashboard-Tab dafür, keine eigene Nutzerverwaltung). Eine Passwortänderung ist ein "
            "technischer Eingriff im Hintergrund und läuft nicht über eine Seite im Dashboard &ndash; "
            "bei Bedarf bitte an die Technik wenden.",
            body_style,
        )]],
        colWidths=[17.7 * cm],
    )
    access_note.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF6DF")),
        ("BOX", (0, 0), (-1, -1), 0.6, YELLOW),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(access_note)

    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Alle anderen Website-Inhalte (Texte, Personen, Downloads, Mitgliederbereich) werden im separaten "
        "Admin-Dashboard gepflegt &ndash; siehe dazu die Admin-Dashboard-Kurzanleitung.",
        note_style,
    ))

    doc.build(story)
    print(f"PDF erstellt: {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
