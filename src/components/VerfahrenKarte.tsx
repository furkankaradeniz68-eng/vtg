"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, AttributionControl, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import type { VerfahrenPolygon } from "@/lib/verfahren-polygone";

// react-leaflet/Polygon erwartet [lat, lng] je Punkt, unsere Quelldaten (GeoJSON-Konvention) liegen als [lon, lat] vor.
function zuLatLng(ring: number[][]): [number, number][] {
  return ring.map(([lon, lat]) => [lat, lon]);
}

function BoundsFitter({ positions }: { positions: [number, number][][] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(positions.flat());
    map.fitBounds(bounds, { padding: [16, 16] });
  }, [map, positions]);
  return null;
}

export default function VerfahrenKarte({ polygon }: { polygon: VerfahrenPolygon }) {
  const ringeProPolygon = useMemo(
    () => polygon.coordinates.map((ringe) => ringe.map(zuLatLng)),
    [polygon],
  );
  const alleAussenringe = useMemo(() => ringeProPolygon.map((ringe) => ringe[0]), [ringeProPolygon]);

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
        <AttributionControl
          position="bottomright"
          prefix={false}
        />
        {ringeProPolygon.map((ringe, i) => (
          <Polygon key={i} positions={ringe} pathOptions={{ color: "#f7b219", weight: 2, fillOpacity: 0.15 }} />
        ))}
        <BoundsFitter positions={alleAussenringe} />
      </MapContainer>
    </div>
  );
}
