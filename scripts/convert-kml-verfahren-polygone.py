# Wandelt die TZ_*.kml-Exporte (Baustellen-Umringe je Verfahren, von der
# Landesvermessung/GIS-Stelle) in src/data/verfahren-polygone.json um, keyed
# nach produktnummer (= verfahren.nr). Jedes ExtendedData/SchemaData-Feld
# "the_geom_1..4" enthaelt zusaetzlich den rohen EWKB-Hex-Datenbankexport der
# Geometrie (SRID 31466) - wird hier bewusst ignoriert, da dieselbe Geometrie
# bereits als normales KML <Polygon><coordinates> in WGS84 vorliegt.
#
# Aufruf (einmalig bei einer neuen KML-Lieferung erneut ausfuehren):
#   python3 scripts/convert-kml-verfahren-polygone.py \
#     "/Volumes/SSK Drive /VTG/KML/TZ_<neuestes-datum>.kml" \
#     src/data/verfahren-polygone.json
import xml.etree.ElementTree as ET
import json, sys

NS = {"k": "http://www.opengis.net/kml/2.2"}

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

def main(path, out_path):
    tree = ET.parse(path)
    root = tree.getroot()
    result = {}
    placemark_count = 0
    polygon_count = 0
    for pm in root.iter("{http://www.opengis.net/kml/2.2}Placemark"):
        placemark_count += 1
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

        polygons = []
        # direct Polygon or inside MultiGeometry
        for poly in pm.findall(".//k:Polygon", NS):
            rings = parse_polygon(poly)
            if rings:
                polygons.append(rings)
                polygon_count += 1

        if prodnr not in result:
            result[prodnr] = {"verfahrensname": name, "type": "MultiPolygon", "coordinates": []}
        result[prodnr]["coordinates"].extend(polygons)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, separators=(",", ":"))

    print(f"placemarks={placemark_count} polygons={polygon_count} produktnummern={len(result)}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
