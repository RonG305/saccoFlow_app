import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import { formatDateTime } from "@/utils/format";
import TripStatusBadge from "./TripStatusBadge";
import type { Trip } from "@/types/logistics";
import { Row, Section } from "@/components/common/ContentSection";

interface Props {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (trip: Trip) => void;
  onReportIncident: (trip: Trip) => void;
}


export default function TripDetailsDrawer({
  trip,
  open,
  onClose,
  onUpdateStatus,
  onReportIncident,
}: Props) {
  if (!trip) return null;
  const canAct = trip.status !== "completed" && trip.status !== "cancelled";

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="bottom">
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-mono text-base">{trip.trip_ref}</DrawerTitle>
            <TripStatusBadge status={trip.status} />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 flex flex-col gap-4 pb-2">
          {/* Route */}
          <Section title="Route">
            <Row label="From" value={trip.origin} />
            <Row label="To" value={trip.destination} />
            {trip.purpose && <Row label="Purpose" value={trip.purpose} />}
            {trip.distance_km && (
              <Row label="Distance" value={`${trip.distance_km} km`} />
            )}
          </Section>

          <Separator />

          {/* Schedule */}
          <Section title="Schedule">
            <Row
              label="Planned Departure"
              value={formatDateTime(trip.planned_departure)}
            />
            <Row
              label="Planned Arrival"
              value={formatDateTime(trip.planned_arrival)}
            />
            <Row
              label="Actual Departure"
              value={formatDateTime(trip.actual_departure)}
            />
            <Row
              label="Actual Arrival"
              value={formatDateTime(trip.actual_arrival)}
            />
          </Section>

          <Separator />

          {/* Vehicle */}
          <Section title="Vehicle">
            <Row label="Reg Number" value={trip.vehicle?.reg_number} />
          </Section>

          {/* Cargo */}
          {trip.cargo_description && (
            <>
              <Separator />
              <Section title="Cargo">
                <Row label="Description" value={trip.cargo_description} />
                {trip.fuel_used_liters && (
                  <Row label="Fuel Used" value={`${trip.fuel_used_liters} L`} />
                )}
              </Section>
            </>
          )}

          {/* Notes */}
          {trip.notes && (
            <>
              <Separator />
              <Section title="Notes">
                <p className="text-sm mt-1">{trip.notes}</p>
              </Section>
            </>
          )}

          {/* Incidents */}
          {trip.incidents && trip.incidents.length > 0 && (
            <>
              <Separator />
              <Section title={`Incidents (${trip.incidents.length})`}>
                {trip.incidents.map((incident) => (
                  <div key={incident.id} className="py-2 flex flex-col gap-0.5">
                    <p className="text-sm font-medium capitalize">
                      {incident.incident_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {incident.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(incident.occurred_at)}
                      {incident.location ? ` · ${incident.location}` : ""}
                    </p>
                  </div>
                ))}
              </Section>
            </>
          )}
        </div>

        <DrawerFooter>
          {canAct && (
            <>
              <Button
                onClick={() => {
                  onClose();
                  onUpdateStatus(trip);
                }}
              >
                <Icon icon="solar:refresh-circle-linear" fontSize={16} />
                Update Status
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onClose();
                  onReportIncident(trip);
                }}
              >
                <Icon icon="solar:danger-triangle-linear" fontSize={16} />
                Report Incident
              </Button>
            </>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
