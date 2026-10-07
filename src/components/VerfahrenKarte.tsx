"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, Tooltip, AttributionControl, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { dlrFarbe, type VerfahrenPolygon } from "@/lib/verfahren-polygone";

// react-leaflet/Polygon erwartet [lat, lng] je Punkt, unsere Quelldaten (GeoJSON-Konvention) liegen als [lon, lat] vor.
function zuLatLng(ring: number[][]): [number, number][] {
  return ring.map(([lon, lat]) => [lat, lon]);
}

// Rueckgabe: [polygon][ring][punkt] - ring[0] je Polygon ist die Aussenkontur.
function ringeVon(polygon: VerfahrenPolygon): [number, number][][][] {
  return polygon.coordinates.map((ringe) => ringe.map(zuLatLng));
}

function BoundsFitter({ positions }: { positions: [number, number][][] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(positions.flat());
    map.fitBounds(bounds, { padding: [16, 16] });
  }, [map, positions]);
  return null;
}

export default function VerfahrenKarte({
  polygon,
  aktuelleNr,
  alleVerfahren,
}: {
  polygon: VerfahrenPolygon;
  aktuelleNr: string;
  alleVerfahren: Record<string, VerfahrenPolygon>;
}) {
  const ringeProPolygon = useMemo(() => ringeVon(polygon), [polygon]);
  const alleAussenringe = useMemo(() => ringeProPolygon.map((ringe) => ringe[0]), [ringeProPolygon]);

  // Alle anderen Verfahren nach DLR eingefaerbt im Hintergrund zeigen - wie
  // auf der alten Seite (ein gemeinsames Google-My-Maps-Layer fuer alle
  // Mitglieder), hier aus denselben KML-Daten automatisch erzeugt statt
  // manuell gepflegt. Das eigene Verfahren bleibt davon ausgenommen, da es
  // weiter unten separat und staerker hervorgehoben gezeichnet wird.
  const andereVerfahren = useMemo(
    () => Object.entries(alleVerfahren).filter(([nr]) => nr !== aktuelleNr),
    [alleVerfahren, aktuelleNr],
  );
  const dlrsImBild = useMemo(() => {
    const namen = new Set(andereVerfahren.map(([, v]) => v.dlrName).filter(Boolean));
    return Array.from(namen).sort();
  }, [andereVerfahren]);

  return (
    // isolate/relative/z-0: haelt Leaflets interne z-index-Werte (Kacheln,
    // Zoom-Buttons, Attribution gehen bis z-index:1000) in einem eigenen
    // Stacking-Context gefangen, damit beim Scrollen nichts ueber den
    // sticky Header (z-50) rutscht.
    <div className="relative z-0 isolate mt-10 overflow-hidden rounded-lg border border-neutral-200">
      <MapContainer
        center={alleAussenringe[0]?.[0] ?? [50, 7]}
        zoom={13}
        scrollWheelZoom={false}
        attributionControl={false}
        preferCanvas
        style={{ height: 400, width: "100%" }}
      >
        {/* Esri "World Light Gray" statt Standard-OSM-Kacheln: heller/aufgeraeumter,
            naeher am gewohnten Kartenbild. Echt kostenlos ohne API-Key - anders als
            CartoDB, deren oeffentliche basemaps.cartocdn.com-Kacheln inzwischen
            einen Account/Key verlangen (siehe "API KEY REQUIRED"-Wasserzeichen). */}
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap-Mitwirkende, GIS-Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        {/* prefix={false} entfernt den Leaflet-Schriftzug samt Ukraine-Flaggen-Icon, OSM-Hinweis bleibt (Lizenzpflicht) */}
        <AttributionControl position="bottomright" prefix={false} />

        {andereVerfahren.map(([nr, v]) =>
          ringeVon(v).map((ringe, i) => (
            <Polygon
              key={`${nr}-${i}`}
              positions={ringe}
              pathOptions={{ color: dlrFarbe(v.dlrName), weight: 1, fillOpacity: 0.08 }}
            >
              <Tooltip sticky>
                {v.verfahrensname} ({nr})
                <br />
                {v.dlrName}
              </Tooltip>
            </Polygon>
          )),
        )}

        {ringeProPolygon.map((ringe, i) => (
          <Polygon key={i} positions={ringe} pathOptions={{ color: "#f7b219", weight: 3, fillOpacity: 0.3 }}>
            <Tooltip sticky>{polygon.verfahrensname}</Tooltip>
          </Polygon>
        ))}
        <BoundsFitter positions={alleAussenringe} />
      </MapContainer>

      {dlrsImBild.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5 font-medium text-neutral-900">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#f7b219" }} />
            {polygon.verfahrensname} (dieses Verfahren)
          </span>
          {dlrsImBild.map((dlr) => (
            <span key={dlr} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dlrFarbe(dlr) }} />
              {dlr}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
