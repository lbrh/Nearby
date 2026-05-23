"use client";

import { useEffect, useState } from "react";
import type { NearbyService } from "@/app/lib/types";

// Leaflet needs to be imported dynamically (uses window)
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface GeocodedService {
  service: NearbyService;
  index: number;
  lat: number;
  lng: number;
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;
  try {
    const q = encodeURIComponent(`${address}, Melbourne, Australia`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=au`,
      { headers: { "User-Agent": "Nearby-Melbourne/1.0" } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export default function ResultsMap({ services }: { services: NearbyService[] }) {
  const [pins, setPins] = useState<GeocodedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPins([]);

    async function run() {
      const results = await Promise.all(
        services.slice(0, 3).map(async (svc, i) => {
          const coords = await geocode(svc.address);
          if (!coords) return null;
          return { service: svc, index: i, ...coords };
        })
      );
      if (!cancelled) {
        setPins(results.filter(Boolean) as GeocodedService[]);
        setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [services]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-line bg-paper text-[13px] text-ink-3">
        <span className="animate-pulse">Loading map…</span>
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-line bg-paper text-[13px] text-ink-3">
        Map unavailable
      </div>
    );
  }

  return <LeafletMap pins={pins} />;
}
