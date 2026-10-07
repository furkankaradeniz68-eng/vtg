"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
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
    <div className="mt-10 overflow-hidden rounded-lg border border-neutral-200">
      <MapContainer
        center={alleAussenringe[0]?.[0] ?? [50, 7]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: 400, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ringeProPolygon.map((ringe, i) => (
          <Polygon key={i} positions={ringe} pathOptions={{ color: "#f7b219", weight: 2, fillOpacity: 0.15 }} />
        ))}
        <BoundsFitter positions={alleAussenringe} />
      </MapContainer>
    </div>
  );
}
