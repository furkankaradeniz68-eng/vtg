#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Erzeugt die kompakte Admin-Dashboard-Kurzanleitung (VTG Rheinland-Pfalz) als PDF.
Nutzung: python3 scripts/build_admin_cheatsheet.py
Ausgabe: ~/Desktop/VTG-RLP-Admin-Anleitung.pdf
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

OUTPUT_PATH = os.path.expanduser("~/Desktop/VTG-RLP-Admin-Anleitung.pdf")
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
    borderPadding=0,
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
    "BulletVTG", parent=body_style, fontSize=8.6, leading=11.8, leftIndent=0,
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


def screenshot_placeholder(tab_query: str) -> Table:
    """Grauer Platzhalter-Kasten fuer einen spaeter einzufuegenden Screenshot."""
    label = Paragraph(
        f"Screenshot-Platzhalter &mdash; wird ersetzt<br/><font face='Courier' size='7.5'>{tab_query}</font>",
        box_label_style,
    )
    t = Table([[label]], colWidths=[5.6 * cm], rowHeights=[1.9 * cm])
    t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#BFBFBF")),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHTGREY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return t


def screenshot_box(filename: str, tab_query: str, box_width_cm: float = 5.8,
                    max_height_cm: float = 6.3) -> Table:
    """Echter Screenshot (gerahmt) falls Datei in IMG_DIR vorhanden, sonst Platzhalter."""
    path = os.path.join(IMG_DIR, filename)
    if not os.path.isfile(path):
        return screenshot_placeholder(tab_query)

    with PILImage.open(path) as im:
        w_px, h_px = im.size
    width = box_width_cm * cm
    height = width * h_px / w_px
    if height > max_height_cm * cm:
        height = max_height_cm * cm
        width = height * w_px / h_px

    img = RLImage(path, width=width, height=height)
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


def section(num: str, title: str, tab_query: str, purpose: str, bullets: list[str],
            where_lines: list[str], note: str | None = None,
            screenshot_file: str | None = None) -> KeepTogether:
    flow = []
    flow.append(Paragraph(f"{num}&nbsp;&nbsp;{title}", h2_style))
    flow.append(Paragraph(tab_query, tab_path_style))

    bullet_items = [
        ListItem(Paragraph(b, bullet_style), leftIndent=10)
        for b in bullets
    ]
    text_col = [
        Paragraph(purpose, body_style),
        Spacer(1, 2),
        Paragraph("Was du änderst:", label_style),
        ListFlowable(
            bullet_items, bulletType="bullet", leftIndent=8, spaceAfter=3,
            bulletFontSize=6, bulletOffsetY=1,
        ),
        Paragraph("Wo es sichtbar wird:", label_style),
    ] + [Paragraph(w, where_style) for w in where_lines]
    if note:
        text_col.append(Spacer(1, 2))
        text_col.append(Paragraph(note, note_style))

    shot = screenshot_box(screenshot_file, tab_query) if screenshot_file else screenshot_placeholder(tab_query)
    row = Table(
        [[text_col, shot]],
        colWidths=[11.3 * cm, 5.8 * cm],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    flow.append(row)
    flow.append(Spacer(1, 7))
    flow.append(HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#DADADA")))
    flow.append(Spacer(1, 7))
    return KeepTogether(flow)


def build():
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=A4,
        leftMargin=1.6 * cm, rightMargin=1.6 * cm,
        topMargin=1.4 * cm, bottomMargin=1.4 * cm,
        title="VTG Rheinland-Pfalz – Admin-Dashboard Kurzanleitung",
    )

    story = []

    # --- Kopfbereich ---
    header_bar = Table([[""]], colWidths=[18.0 * cm], rowHeights=[0.25 * cm])
    header_bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), YELLOW)]))
    story.append(header_bar)
    story.append(Spacer(1, 8))
    story.append(Paragraph("Admin-Dashboard &ndash; Kurzanleitung", title_style))
    story.append(Paragraph(
        "VTG Rheinland-Pfalz &middot; Zugriff: Anmeldung unter <font face='Courier'>/login</font> mit "
        "Admin-Zugang, danach oben rechts auf &bdquo;Admin-Dashboard&ldquo; &rarr; "
        "<font face='Courier'>/admin</font>. Die 7 Bereiche sind als Reiter oben im Dashboard wählbar "
        "(URL-Parameter <font face='Courier'>?tab=...</font>).",
        subtitle_style,
    ))

    # --- Zugangsdaten ---
    cred_table = Table(
        [
            [Paragraph("<b>Benutzername</b>", label_style), Paragraph("<b>Kennwort</b>", label_style)],
            [Paragraph("ADD.RLP", body_style), Paragraph("54290.Trier", body_style)],
            [Paragraph("vtggs", body_style), Paragraph("Pw2019.hp", body_style)],
            [Paragraph("vtgnews", body_style), Paragraph("Pw2019.news", body_style)],
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
                "Hinweis: Zugriff auf <font face='Courier'>/admin</font> selbst erfordert die Admin-Rolle; "
                "laut Analytics-Übersicht im Dashboard ist „vtggs“ bestätigt als Admin-Rolle hinterlegt. Bei "
                "„ADD.RLP“ und „vtgnews“ ist nicht geprüft, ob sie ebenfalls Admin- oder (nur) "
                "DLR-Mitgliederbereich-Rechte haben &ndash; bei Unsicherheit bitte intern gegenprüfen. Dieses "
                "Dokument enthält Klartext-Zugangsdaten &ndash; vertraulich behandeln und nicht "
                "unverschlüsselt weiterleiten.",
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
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        "<b>So liest sich jeder Abschnitt:</b> Zweck in einem Satz &middot; was sich konkret bearbeiten lässt "
        "&middot; wo die Änderung auf der Webseite sichtbar wird. Für Felder, die automatisch aus Business "
        "Central (BC) befüllt werden, steht einfach &bdquo;per API-Key an BC gebunden&ldquo; &ndash; diese Werte "
        "werden <i>nicht</i> im Dashboard bearbeitet, sondern laufen über den nächtlichen BC-Sync.",
        intro_style,
    ))
    story.append(Spacer(1, 4))

    # --- 1. Mitglieder-Downloads ---
    story.append(section(
        "1", "Mitglieder-Downloads", "/admin?tab=mitglieder",
        "Einem einzelnen Mandanten eine Datei befristet zum Download bereitstellen.",
        [
            "Benutzer auswählen (Suchfeld, Liste kommt automatisch aus BC)",
            "Datei hochladen und Gültigkeitsdauer in Tagen festlegen",
            "Bestehende Zuweisungen in der Tabelle unten löschen",
        ],
        [
            "Der zuständige DLR sieht die Datei bei „Verfahrensauswahl“ im internen "
            "Mitgliederbereich (<font face='Courier'>/mitgliederbereich/verfahrensauswahl</font>) "
            "beim jeweiligen Mandanten.",
        ],
        note="Hinweis: Der Mandant selbst sieht diese Zuweisung nicht direkt in seinem eigenen Bereich "
             "— sie ist für den DLR gedacht, der sie bei Bedarf weiterreicht.",
        screenshot_file="admin-1-mitglieder.png",
    ))

    # --- 2. Mitgliederbereich ---
    story.append(section(
        "2", "Mitgliederbereich", "/admin?tab=mitgliederbereich",
        "Vier Inhalte, die im internen/mandantenseitigen Mitgliederbereich erscheinen.",
        [
            "<b>Kontenplan-PDF:</b> Datei ersetzen (ersetzt die allgemeine Kontenplan-Datei)",
            "<b>Energiekostenzuschlag:</b> Jahre anlegen, Monatstabelle bearbeiten, Jahr löschen",
            "<b>Zins:</b> nur Begleittext (Link führt in den Texteditor, Abschnitt „Seiteninhalte“)",
            "<b>Umlage:</b> Begleittext sowie Jahr/Prozentsatz-Zeilen hinzufügen, bearbeiten, löschen",
        ],
        [
            "Kontenplan: Download „Kontenplan TG“ im internen Header sowie "
            "<font face='Courier'>/api/kontenplan</font>.",
            "Energiekostenzuschlag: <font face='Courier'>/mitgliederbereich/energiekostenzuschlag</font>",
            "Zins: <font face='Courier'>/mitgliederbereich/zins</font> &middot; Umlage: "
            "<font face='Courier'>/mitgliederbereich/umlage</font>",
        ],
        note="Die individuelle „Kontenübersicht“ (eigene XLSX je Mandant) kommt automatisch per "
             "API-Key aus BC und wird hier nicht bearbeitet.",
        screenshot_file="admin-2-mitgliederbereich.png",
    ))

    # --- 3. Website-Downloads ---
    story.append(section(
        "3", "Website-Downloads", "/admin?tab=website",
        "Öffentliche Download-Dateien in drei Kategorien verwalten (kein Login nötig, um sie zu sehen).",
        [
            "Kategorie oben wählen: Satzung &amp; Vordrucke / Fachtagungen / Sonstiges",
            "Neuen Download hinzufügen: Titel, optionale Beschreibung, Datei",
            "Bestehende Einträge bearbeiten (Titel/Beschreibung/Datei ersetzen) oder löschen",
        ],
        [
            "<font face='Courier'>/download-satzung-vordrucke</font>, "
            "<font face='Courier'>/fachtagungen</font>, <font face='Courier'>/sonstiges</font> "
            "(öffentlich, über „Downloads“ im Hauptmenü).",
        ],
        screenshot_file="admin-3-website.png",
    ))

    # --- 4. Personen ---
    story.append(section(
        "4", "Personen", "/admin?tab=personen",
        "Ansprechpartner (Name, Rolle, Kontaktdaten, Foto) für Organe und Dienstsitze pflegen.",
        [
            "„+ Neue Person hinzufügen“ oder bestehenden Eintrag per Suche bearbeiten",
            "Jede Person einer der 10 Seiten zuordnen (Vorstand, Geschäftsstelle, Präsident, "
            "Geschäftsführer, 6 Dienstsitze)",
            "Eintrag löschen, wenn die Person nicht mehr zuständig ist",
        ],
        [
            "Entsprechende öffentliche Seite, z.&nbsp;B. <font face='Courier'>/vorstand</font>, "
            "<font face='Courier'>/praesident</font>, <font face='Courier'>/geschaeftsfuehrer</font>, "
            "<font face='Courier'>/geschaeftsstelle</font> oder die jeweilige Dienstsitz-Seite "
            "(z.&nbsp;B. <font face='Courier'>/neustadt</font>, <font face='Courier'>/kaiserslautern</font>) "
            "unter „Kontakt“.",
        ],
        screenshot_file="admin-4-personen.png",
    ))

    # --- 5. Öffentliche Seiteninhalte ---
    story.append(section(
        "5", "Öffentliche Seiteninhalte", "/admin?tab=seiteninhalte",
        "Freitexte, Stellenausschreibungen und das Hero-Bild der öffentlichen Website.",
        [
            "<b>Texte &amp; Bilder:</b> 9 Seiten bearbeiten (Überblick, Präsident, Vorstand, "
            "Geschäftsführer, Bauabwicklung, Kassen-/Buchführung, Sonstige Aufgaben, Finanzierung, "
            "Satzung). Leerzeile = neuer Absatz, Zeile mit „- “ = Listenpunkt. Teils mit Bild.",
            "<b>Stellenausschreibungen:</b> neue Stelle mit Titel, Text und optionalem PDF anlegen, "
            "bearbeiten oder löschen",
            "<b>Hero-Bild:</b> das große Bild im Kopfbereich &ndash; gilt website-weit für alle Seiten",
        ],
        [
            "Texte: jeweilige Unterseite unter „Über uns“, z.&nbsp;B. <font face='Courier'>/ueberblick</font>, "
            "<font face='Courier'>/bauabwicklung</font>, <font face='Courier'>/satzung</font>.",
            "Stellenausschreibungen: <font face='Courier'>/stellenausschreibung</font>",
            "Hero-Bild: Kopfbereich auf jeder öffentlichen Seite",
        ],
        screenshot_file="admin-5-seiteninhalte.png",
    ))

    # --- 6. Links-Seite ---
    story.append(section(
        "6", "Links-Seite", "/admin?tab=links",
        "Öffentliche Linksammlung (Texte mit hinterlegter URL) nach Kategorien pflegen.",
        [
            "Neuen Link hinzufügen: Kategorie (frei wählbar oder bestehende per Vorschlagsliste übernehmen), Bezeichnung, URL und optionale Beschreibung",
            "Bestehenden Link bearbeiten (alle Felder) oder löschen",
            "Links erscheinen gruppiert nach Kategorie in der Reihenfolge ihres ersten Auftretens",
        ],
        [
            "<font face='Courier'>/links</font> (öffentlich, über „Links“ im Hauptmenü).",
        ],
        screenshot_file="admin-6-links.png",
    ))

    # --- 7. Analytics ---
    story.append(section(
        "7", "Analytics", "/admin?tab=analytics",
        "Reiner Lesebereich &ndash; hier wird nichts bearbeitet, nur ausgewertet.",
        [
            "Übersicht: Logins und Downloads je Benutzer seit Einführung des Trackings",
            "Liste der letzten Ereignisse (wer hat was wann heruntergeladen/eingeloggt)",
        ],
        [
            "Nur im Dashboard selbst sichtbar, keine Auswirkung auf die öffentliche Website.",
        ],
        note="Rein statische Datei-Links ohne eigene API-Route (z. B. das TG-Einzeldaten-ZIP) "
             "lassen sich technisch nicht einzelnen Nutzern zuordnen und erscheinen hier nicht.",
        screenshot_file="admin-7-analytics.png",
    ))

    # --- Fussnote BC ---
    story.append(Spacer(1, 2))
    bc_note = Table(
        [[Paragraph(
            "<b>Zur Erinnerung:</b> Mitgliederliste/Verfahrensdaten, Finanzübersicht, Kontoauszüge und die "
            "TG-Einzeldaten-Exports kommen nicht aus dem Admin-Dashboard, sondern sind per API-Key an "
            "Business Central (BC) gebunden und synchronisieren sich automatisch jede Nacht. Dort ist "
            "keine manuelle Bearbeitung nötig oder möglich.",
            body_style,
        )]],
        colWidths=[17.7 * cm],
    )
    bc_note.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF6DF")),
        ("BOX", (0, 0), (-1, -1), 0.6, YELLOW),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(bc_note)

    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Bauleiter-Funktionen (VOB/VOL-Verwaltung) sind nicht Teil dieser Anleitung &ndash; dafür folgt "
        "ein separates Dokument.",
        note_style,
    ))

    doc.build(story)
    print(f"PDF erstellt: {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
