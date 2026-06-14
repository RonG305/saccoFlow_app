import { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io, type Socket } from "socket.io-client";
import { getLocationHistory } from "@/data/couriers/logistics";
import type { Trip } from "@/types/logistics";

const TRACKING_URL = new URL(import.meta.env.VITE_LOGISTICS_BASE_URL as string)
  .origin;

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function totalDistance(trail: [number, number][]): number {
  let d = 0;
  for (let i = 1; i < trail.length; i++)
    d += haversineKm(
      trail[i - 1][0],
      trail[i - 1][1],
      trail[i][0],
      trail[i][1],
    );
  return d;
}

const dot = (bg: string, size = 16) =>
  L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const ICON_ORIGIN = dot("#22c55e");
const ICON_DEST = dot("#ef4444");
const ICON_DRIVER = L.divIcon({
  html: `<div style="width:22px;height:22px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 1px 8px rgba(59,130,246,.6);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;border-radius:50%;background:white"></div></div>`,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function BoundsUpdater({ points }: { points: [number, number][] }) {
  const map = useMap();
  const key = points.map((p) => p.join(",")).join("|");
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [32, 32] });
    else if (points.length === 1) map.setView(points[0], 14);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

interface LocationPayload {
  latitude: number;
  longitude: number;
  speed_kmh?: number;
  recorded_at?: string;
}

interface Props {
  trip: Trip;
  mapHeight?: number | string;
  showInfo?: boolean;
  onDistanceUpdate?: (km: number) => void;
}

export default function TripTrackingMap({ trip, mapHeight = 220, showInfo = true, onDistanceUpdate }: Props) {
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [trail, setTrail] = useState<[number, number][]>([]);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  // Load breadcrumb history once on mount
  const loadHistory = useCallback(async () => {
    try {
      const history = await getLocationHistory(trip.id);
      if (Array.isArray(history) && history.length) {
        const pts: [number, number][] = history.map(
          (p: LocationPayload) => [Number(p.latitude), Number(p.longitude)],
        );
        const d = totalDistance(pts);
        setTrail(pts);
        setDistanceCovered(d);
        setDriverPos(pts[pts.length - 1]);
        onDistanceUpdate?.(d);
      }
    } catch {
      // no history yet
    }
  }, [trip.id]);

  useEffect(() => {
    loadHistory();

    if (trip.status !== "in_progress") return;

    // Get auth token from cookie
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    const socket = io(`${TRACKING_URL}/tracking`, {
      auth: token ? { token } : undefined,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () =>
      console.log("[tracking] connected:", socket.id),
    );
    socket.on("disconnect", (reason) =>
      console.log("[tracking] disconnected:", reason),
    );
    socket.on("connect_error", (err) =>
      console.error("[tracking] connection error:", err.message),
    );

    socket.emit("subscribe_trip", trip.id, (ack: unknown) =>
      console.log("[tracking] subscribed to trip", trip.id, ack),
    );

    socket.on("location_update", (payload: LocationPayload) => {
      console.log("[tracking] location_update:", payload);
      const pos: [number, number] = [
        Number(payload.latitude),
        Number(payload.longitude),
      ];
      setDriverPos(pos);
      setTrail((prev) => {
        const next = [...prev, pos];
        const d = totalDistance(next);
        setDistanceCovered(d);
        onDistanceUpdate?.(d);
        return next;
      });
    });

    socket.on("status_change", (payload: unknown) =>
      console.log("[tracking] status_change:", payload),
    );

    socket.on("geofence_event", (payload: unknown) =>
      console.log("[tracking] geofence_event:", payload),
    );

    return () => {
      console.log("[tracking] unsubscribing trip", trip.id);
      socket.emit("unsubscribe_trip", trip.id);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [trip.id, trip.status, loadHistory]);

  const originPos: [number, number] | null =
    trip.origin_lat != null && trip.origin_lng != null
      ? [Number(trip.origin_lat), Number(trip.origin_lng)]
      : null;

  const destPos: [number, number] | null =
    trip.destination_lat != null && trip.destination_lng != null
      ? [Number(trip.destination_lat), Number(trip.destination_lng)]
      : null;

  const defaultCenter: [number, number] =
    originPos ?? destPos ?? driverPos ?? [-1.2921, 36.8219];

  const boundPoints: [number, number][] = [
    ...(originPos ? [originPos] : []),
    ...(destPos ? [destPos] : []),
    ...(driverPos ? [driverPos] : []),
    ...trail,
  ];

  return (
    <div className="flex flex-col gap-2">
      {showInfo && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              {trip.origin}
            </span>
            <span>→</span>
            <span className="flex items-center gap-1">
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              {trip.destination}
            </span>
          </div>
          {distanceCovered > 0 && (
            <span className="font-medium tabular-nums">
              {distanceCovered.toFixed(1)} km covered
            </span>
          )}
        </div>
      )}

      <div style={{ height: mapHeight, borderRadius: typeof mapHeight === "number" ? 12 : 8, overflow: "hidden" }}>
        <MapContainer
          center={defaultCenter}
          zoom={30}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {trail.length > 1 && (
            <Polyline
              positions={trail}
              color="#3b82f6"
              weight={3}
              opacity={0.8}
            />
          )}
          {originPos && (
            <Marker position={originPos} icon={ICON_ORIGIN}>
              <Popup>{trip.origin}</Popup>
            </Marker>
          )}
          {destPos && (
            <Marker position={destPos} icon={ICON_DEST}>
              <Popup>{trip.destination}</Popup>
            </Marker>
          )}
          {driverPos && (
            <Marker position={driverPos} icon={ICON_DRIVER}>
              <Popup>Driver</Popup>
            </Marker>
          )}
          {boundPoints.length > 0 && <BoundsUpdater points={boundPoints} />}
        </MapContainer>
      </div>
    </div>
  );
}
