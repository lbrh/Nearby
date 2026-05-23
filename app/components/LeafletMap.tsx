"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { NearbyService } from "@/app/lib/types";
import L from "leaflet";

// Fix Leaflet's broken default icon path in bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Numbered coloured markers
function numberedIcon(index: number) {
  const colours = ["#0d9488", "#0891b2", "#7c3aed"];
  const bg = colours[index] ?? colours[0];
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${bg};transform:rotate(-45deg);
      border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="
      transform:rotate(45deg);color:white;font-size:11px;
      font-weight:700;font-family:monospace;line-height:1;
    ">${index + 1}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

interface Pin {
  service: NearbyService;
  index: number;
  lat: number;
  lng: number;
}

function FitBounds({ pins }: { pins: Pin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, pins]);
  return null;
}

export default function LeafletMap({ pins }: { pins: Pin[] }) {
  const centre: [number, number] =
    pins.length > 0
      ? [
          pins.reduce((s, p) => s + p.lat, 0) / pins.length,
          pins.reduce((s, p) => s + p.lng, 0) / pins.length,
        ]
      : [-37.814, 144.963];

  return (
    <>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapContainer
        center={centre}
        zoom={14}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <FitBounds pins={pins} />
        {pins.map((pin) => (
          <Marker key={pin.index} position={[pin.lat, pin.lng]} icon={numberedIcon(pin.index)}>
            <Popup>
              <div style={{ minWidth: 160, fontSize: 13 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{pin.service.name}</div>
                <div style={{ color: "#555" }}>{pin.service.address}</div>
                {pin.service.hours && (
                  <div style={{ color: "#555", marginTop: 4, fontSize: 12 }}>{pin.service.hours}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
