import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import type { Trip } from "@/types/logistics";
import { Badge } from "@/components/ui/badge";

interface Props {
  trip: Trip;
  onUpdateStatus: (trip: Trip) => void;
  onReportIncident: (trip: Trip) => void;
}

export default function ActiveTripCard({ trip, onUpdateStatus, onReportIncident }: Props) {
  return (
    <Card className="bg-secondary text-background p-4 gap-4 flex flex-col ">
      <div className="flex items-center justify-between">
        <Badge>In Progress</Badge>
        <span className="text-xs text-background/50 font-mono">{trip.trip_ref}</span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold">
          {trip.origin} to {trip.destination}
        </p>
        {trip.purpose && (
          <p className="text-xs text-background/60">{trip.purpose}</p>
        )}
        <Progress value={40} className="mt-2 h-1.5 bg-background/20" />
      </div>

      {(trip.planned_departure || trip.planned_arrival) && (
        <div className="flex justify-between text-xs text-background/60">
          {trip.planned_departure && (
            <span>Dep: {format(new Date(trip.planned_departure), "MMM d, h:mm a")}</span>
          )}
          {trip.planned_arrival && (
            <span>ETA: {format(new Date(trip.planned_arrival), "h:mm a")}</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onUpdateStatus(trip)}
        >
          <Icon icon="solar:refresh-circle-linear" fontSize={14} />
          Update Status
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={() => onReportIncident(trip)}
        >
          <Icon icon="solar:danger-triangle-linear" fontSize={14} />
          Report Issue
        </Button>
      </div>
    </Card>
  );
}
