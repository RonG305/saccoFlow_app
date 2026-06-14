import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/common/DataTable/DataTable";
import { ActionDropdown } from "@/components/common/ActionDropdown";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import TripStatusBadge from "./TripStatusBadge";
import type { Trip } from "@/types/logistics";
import type { ReactNode } from "react";

interface Props {
  trips: Trip[];
  toolbar?: ReactNode;
  onView: (trip: Trip) => void;
  onUpdateStatus: (trip: Trip) => void;
  onReportIncident: (trip: Trip) => void;
}

export default function TripsTable({
  trips,
  toolbar,
  onView,
  onUpdateStatus,
  onReportIncident,
}: Props) {
  const columns: ColumnDef<Trip>[] = [
    {
      id: "route",
      header: "Trip Ref",
      accessorFn: (row) => `${row.origin} ${row.destination}`,
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-secondary">
              {trip.trip_ref}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TripStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "planned_departure",
      header: "Departure",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {format(new Date(row.original.planned_departure), "MMM d, h:mm a")}
        </span>
      ),
    },
    {
      id: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.vehicle?.reg_number ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const trip = row.original;
        const canAct = trip.status !== "completed" && trip.status !== "cancelled";
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => onView(trip)}>
              <Icon icon="solar:eye-linear" fontSize={16} />
              <span>View Details</span>
            </DropdownMenuItem>
            {/* {canAct && <DropdownMenuSeparator />} */}
           
            
          </ActionDropdown>
        );
      },
    },
  ];

  return (
    <DataTable<Trip>
      columns={columns}
      data={trips}
      searchColumn="route"
      searchPlaceholder="Search trips..."
      toolbar={toolbar}
      emptyMessage="No trips found."
    />
  );
}
