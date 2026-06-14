import { useState, useEffect, useCallback } from "react";
import { getTrips } from "@/data/couriers/logistics";
import { getUser } from "@/lib/user";
import TripTrackingMap from "@/components/common/Map/TripTrackingMap";
import TripStatusBadge from "@/components/Courier/Trips/TripStatusBadge";
import type { Trip } from "@/types/logistics";

export default function CourierMap() {
  const user = getUser();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [distanceCovered, setDistanceCovered] = useState(0);

  const fetchActiveTrip = useCallback(async () => {
    if (!user?.sub) return;
    try {
      const res = await getTrips({ driver_id: user.sub, status: "in_progress", limit: 1 });
      console.log("Trips Response: ", res);
      setTrip(res?.data?.[0] ?? null);
    } finally {
      setLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => { fetchActiveTrip(); }, [fetchActiveTrip]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-8 gap-2">
        <p className="font-semibold text-lg">No active trip</p>
        <p className="text-sm text-muted-foreground">
          Live tracking is available when a trip is in progress.
        </p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Full-screen map */}
      <TripTrackingMap
        trip={trip}
        mapHeight="calc(100vh - 4rem)"
        showInfo={false}
        onDistanceUpdate={setDistanceCovered}
      />

      {/* Bottom info panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl px-4 pt-4 pb-6 flex flex-col gap-2 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between">
          <p className="font-bold text-base">Live Tracking</p>
          <TripStatusBadge status={trip.status} />
        </div>
        <p className="text-xs font-mono text-muted-foreground">{trip.trip_ref}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm">
            <span className="text-muted-foreground">{trip.origin}</span>
            <span className="mx-1 text-muted-foreground">→</span>
            <span className="text-muted-foreground">{trip.destination}</span>
          </p>
          {distanceCovered > 0 && (
            <p className="text-sm font-medium tabular-nums">
              {distanceCovered.toFixed(1)} km
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
