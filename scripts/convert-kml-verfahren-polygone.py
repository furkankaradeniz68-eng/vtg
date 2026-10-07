# Wandelt die TZ_*.kml-Exporte (Baustellen-Umringe je Verfahren, von der
# Landesvermessung/GIS-Stelle) in zwei JSON-Dateien um, beide keyed nach
# produktnummer (= verfahren.nr):
#
#   src/data/verfahren-polygone.json
#     Volle Praezision, fuer die Hervorhebung des EIGENEN Verfahrens auf
#     dessen Verfahrensdaten-Seite.
#   src/data/verfahren-polygone-uebersicht.json
#     Geometrie per Douglas-Peucker vereinfacht (Toleranz 0.0003 Grad,
#     ~30m) - fuer die Gesamtkarte, auf der ALLE ~290 Verfahren gleichzeitig
#     gezeichnet werden (Kontext/DLR-Einfaerbung). Ohne Vereinfachung waere
#     diese Datei mit >190.000 Punkten zu gross, um sie bei jedem Seitenaufruf
#     an den Client zu schicken.
#
# Jedes ExtendedData/SchemaData-Feld "the_geom_1..4" enthaelt zusaetzlich den
# rohen EWKB-Hex-Datenbankexport der Geometrie (SRID 31466) - wird hier
# bewusst ignoriert, da dieselbe Geometrie bereits als normales KML
# <Polygon><coordinates> in WGS84 vorliegt.
#
# dlr_name kommt in der KML-Quelle mit uneinheitlicher Schreibweise vor
# (z.B. "DLR Rheinhessen-Nahe-Hunsrück" vs. "DLR Rheinhessen - Nahe -
# Hunsrück") - DLR_NORMALISIERUNG gleicht das an, damit nicht zwei Farben
# fuer dieselbe DLR entstehen. Bei einer neuen KML-Lieferung pruefen, ob
# weitere Varianten dazugekommen sind.
#
# Aufruf (einmalig bei einer neuen KML-Lieferung erneut ausfuehren):
#   python3 scripts/convert-kml-verfahren-polygone.py \
#     "/Volumes/SSK Drive /VTG/KML/TZ_<neuestes-datum>.kml" \
#     src/data/verfahren-polygone.json \
#     src/data/verfahren-polygone-uebersicht.json
import xml.etree.ElementTree as ET
import json, sys

NS = {"k": "http://www.opengis.net/kml/2.2"}

DLR_NORMALISIERUNG = {
    "DLR Rheinhessen-Nahe-Hunsrück": "DLR Rheinhessen - Nahe - Hunsrück",
}


def parse_coords(text):
    pts = []
    for tok in text.strip().split():
        parts = tok.split(",")
        lon, lat = float(parts[0]), float(parts[1])
        pts.append([round(lon, 6), round(lat, 6)])
    return pts


def parse_polygon(poly_el):
    rings = []
    outer = poly_el.find("k:outerBoundaryIs/k:LinearRing/k:coordinates", NS)
    if outer is not None and outer.text:
        rings.append(parse_coords(outer.text))
    for inner in poly_el.findall("k:innerBoundaryIs/k:LinearRing/k:coordinates", NS):
        if inner.text:
            rings.append(parse_coords(inner.text))
    return rings


def perp_dist(pt, a, b):
    (x, y), (ax, ay), (bx, by) = pt, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return ((x - ax) ** 2 + (y - ay) ** 2) ** 0.5
    t = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)
    t = max(0, min(1, t))
    px, py = ax + t * dx, ay + t * dy
    return ((x - px) ** 2 + (y - py) ** 2) ** 0.5


def rdp(points, epsilon):
    if len(points) < 3:
        return points
    dmax, idx = 0, 0
    for i in range(1, len(points) - 1):
        d = perp_dist(points[i], points[0], points[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > epsilon:
        left = rdp(points[: idx + 1], epsilon)
        right = rdp(points[idx:], epsilon)
        return left[:-1] + right
    return [points[0], points[-1]]


def simplify_ring(ring, epsilon):
    if len(ring) <= 4:
        return ring
    simplified = rdp(ring, epsilon)
    if len(simplified) < 4:
        return ring
    return simplified


def main(path, out_full, out_uebersicht):
    tree = ET.parse(path)
    root = tree.getroot()
    full = {}
    uebersicht = {}
    for pm in root.iter("{http://www.opengis.net/kml/2.2}Placemark"):
        ext = pm.find("k:ExtendedData/k:SchemaData", NS)
        if ext is None:
            continue
        fields = {}
        for sd in ext.findall("k:SimpleData", NS):
            fields[sd.get("name")] = sd.text
        prodnr = fields.get("produktnummer")
        if not prodnr:
            continue
        name = fields.get("verfahrensname", "")
        dlr = fields.get("dlr_name", "") or ""
        dlr = DLR_NORMALISIERUNG.get(dlr, dlr)

        polygons = []
        for poly in pm.findall(".//k:Polygon", NS):
            rings = parse_polygon(poly)
            if rings:
                polygons.append(rings)

        if prodnr not in full:
            full[prodnr] = {"verfahrensname": name, "dlrName": dlr, "type": "MultiPolygon", "coordinates": []}
        full[prodnr]["coordinates"].extend(polygons)

        if prodnr not in uebersicht:
            uebersicht[prodnr] = {"verfahrensname": name, "dlrName": dlr, "type": "MultiPolygon", "coordinates": []}
        vereinfacht = [[simplify_ring(ring, 0.0003) for ring in poly] for poly in polygons]
        uebersicht[prodnr]["coordinates"].extend(vereinfacht)

    with open(out_full, "w", encoding="utf-8") as f:
        json.dump(full, f, ensure_ascii=False, separators=(",", ":"))
    with open(out_uebersicht, "w", encoding="utf-8") as f:
        json.dump(uebersicht, f, ensure_ascii=False, separators=(",", ":"))

    def punkte(d):
        return sum(len(ring) for e in d.values() for poly in e["coordinates"] for ring in poly)

    print(f"produktnummern={len(full)} punkte_voll={punkte(full)} punkte_uebersicht={punkte(uebersicht)}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
