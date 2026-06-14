import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import TripStatusBadge from "./TripStatusBadge";
import { format } from "date-fns";
import type { Trip } from "@/types/logistics";

interface Props {
  trip: Trip;
  onUpdateStatus: (trip: Trip) => void;
  onReportIncident: (trip: Trip) => void;
}

export default function TripCard({ trip, onUpdateStatus, onReportIncident }: Props) {
  const canAct = trip.status !== "completed" && trip.status !== "cancelled";

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          {trip.origin} → {trip.destination}
        </ItemTitle>
        <ItemDescription>
          {trip.trip_ref} · {format(new Date(trip.planned_departure), "MMM d, h:mm a")}
          {trip.vehicle ? ` · ${trip.vehicle.reg_number}` : ""}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <TripStatusBadge status={trip.status} />
        {canAct && (
          <>
            <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(trip)}>
              Update
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => onReportIncident(trip)}
            >
              Report
            </Button>
          </>
        )}
      </ItemActions>
    </Item>
  );
}
