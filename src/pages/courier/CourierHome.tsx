import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import ActiveTripCard from "@/components/Courier/Dashboard/ActiveTripCard";
import TripsTable from "@/components/Courier/Trips/TripsTable";
import TripDetailsDrawer from "@/components/Courier/Trips/TripDetailsDrawer";
import ScheduleTripDrawer from "@/components/Courier/Trips/ScheduleTripDrawer";
import UpdateStatusDrawer from "@/components/Courier/Trips/UpdateStatusDrawer";
import ReportIncidentDrawer from "@/components/Courier/Trips/ReportIncidentDrawer";
import PushLocationDrawer from "@/components/Courier/Trips/PushLocationDrawer";
import { getDriverStats, getTrips } from "@/data/couriers/logistics";
import { getUser } from "@/lib/user";
import type { Trip, DriverStats } from "@/types/logistics";

export default function CourierHome() {
  const user = getUser();
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [viewTrip, setViewTrip] = useState<Trip | null>(null);
  const [updateTrip, setUpdateTrip] = useState<Trip | null>(null);
  const [incidentTrip, setIncidentTrip] = useState<Trip | null>(null);
  const [locationTrip, setLocationTrip] = useState<Trip | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.sub) return;
    const [statsRes, activeRes, recentRes] = await Promise.all([
      getDriverStats(user.sub),
      getTrips({ driver_id: user.sub, status: "in_progress", limit: 1 }),
      getTrips({ driver_id: user.sub, limit: 5 }),
    ]);
    if (statsRes?.data) setStats(statsRes.data);
    setActiveTrip(activeRes?.data?.[0] ?? null);
    setRecentTrips(recentRes?.data ?? []);
  }, [user?.sub]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="text-xl font-bold capitalize">
            {user?.email?.split("@")[0] ?? "Driver"}
          </h1>
        </div>
        <Button size="sm" onClick={() => setShowSchedule(true)}>
          <Icon icon="solar:add-circle-linear" fontSize={16} />
          New Trip
        </Button>
      </div>

      {activeTrip && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Active Trip</h2>
          <ActiveTripCard
            trip={activeTrip}
            onUpdateStatus={setUpdateTrip}
            onReportIncident={setIncidentTrip}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Trips</h2>
          <Link to="/courier/trips" className="text-xs text-primary">
            View all
          </Link>
        </div>
        <TripsTable
          trips={recentTrips}
          onView={setViewTrip}
          onUpdateStatus={setUpdateTrip}
          onReportIncident={setIncidentTrip}
        />
      </div>

      <TripDetailsDrawer
        trip={viewTrip}
        open={!!viewTrip}
        onClose={() => setViewTrip(null)}
        onUpdateStatus={(t) => { setViewTrip(null); setUpdateTrip(t); }}
        onReportIncident={(t) => { setViewTrip(null); setIncidentTrip(t); }}
        onPushLocation={(t) => { setViewTrip(null); setLocationTrip(t); }}
      />
      <PushLocationDrawer
        trip={locationTrip}
        open={!!locationTrip}
        onClose={() => setLocationTrip(null)}
        onSuccess={() => { setLocationTrip(null); fetchData(); }}
      />
      <UpdateStatusDrawer
        trip={updateTrip}
        open={!!updateTrip}
        onClose={() => setUpdateTrip(null)}
        onSuccess={() => {
          setUpdateTrip(null);
          fetchData();
        }}
      />
      <ReportIncidentDrawer
        trip={incidentTrip}
        open={!!incidentTrip}
        onClose={() => setIncidentTrip(null)}
        onSuccess={() => {
          setIncidentTrip(null);
          fetchData();
        }}
      />
      <ScheduleTripDrawer
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        onSuccess={() => {
          setShowSchedule(false);
          fetchData();
        }}
      />
    </div>
  );
}
