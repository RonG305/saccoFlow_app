import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TripsTable from "@/components/Courier/Trips/TripsTable";
import TripDetailsDrawer from "@/components/Courier/Trips/TripDetailsDrawer";
import ScheduleTripDrawer from "@/components/Courier/Trips/ScheduleTripDrawer";
import UpdateStatusDrawer from "@/components/Courier/Trips/UpdateStatusDrawer";
import ReportIncidentDrawer from "@/components/Courier/Trips/ReportIncidentDrawer";
import PushLocationDrawer from "@/components/Courier/Trips/PushLocationDrawer";
import { getTrips } from "@/data/couriers/logistics";
import { getUser } from "@/lib/user";
import type { Trip, TripStatus } from "@/types/logistics";

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "in_progress", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function CourierTrips() {
  const user = getUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeStatus, setActiveStatus] = useState("");
  const [viewTrip, setViewTrip] = useState<Trip | null>(null);
  const [updateTrip, setUpdateTrip] = useState<Trip | null>(null);
  const [incidentTrip, setIncidentTrip] = useState<Trip | null>(null);
  const [locationTrip, setLocationTrip] = useState<Trip | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const fetchTrips = useCallback(async () => {
    if (!user?.sub) return;
    const params: Record<string, string> = { driver_id: user.sub, limit: "50" };
    if (activeStatus) params.status = activeStatus as TripStatus;
    const res = await getTrips(params);
    setTrips(res?.data ?? []);
  }, [user?.sub, activeStatus]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const toolbar = (
    <div className="flex items-center gap-2 overflow-x-scroll ">
      <div className="flex gap-1 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={activeStatus === tab.value ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveStatus(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <Button size="sm" onClick={() => setShowSchedule(true)}>
        <Icon icon="solar:add-circle-linear" fontSize={16} />
        Schedule
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-xl font-bold">Deliveries</h1>

      <TripsTable
        trips={trips}
        toolbar={toolbar}
        onView={setViewTrip}
        onUpdateStatus={setUpdateTrip}
        onReportIncident={setIncidentTrip}
      />

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
        onSuccess={() => { setLocationTrip(null); fetchTrips(); }}
      />
      <UpdateStatusDrawer
        trip={updateTrip}
        open={!!updateTrip}
        onClose={() => setUpdateTrip(null)}
        onSuccess={() => {
          setUpdateTrip(null);
          fetchTrips();
        }}
      />
      <ReportIncidentDrawer
        trip={incidentTrip}
        open={!!incidentTrip}
        onClose={() => setIncidentTrip(null)}
        onSuccess={() => {
          setIncidentTrip(null);
          fetchTrips();
        }}
      />
      <ScheduleTripDrawer
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        onSuccess={() => {
          setShowSchedule(false);
          fetchTrips();
        }}
      />
    </div>
  );
}
