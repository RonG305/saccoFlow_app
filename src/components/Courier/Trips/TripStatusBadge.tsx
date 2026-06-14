import { Badge } from "@/components/ui/badge";
import type { TripStatus } from "@/types/logistics";

const VARIANTS: Record<TripStatus, "default" | "success" | "destructive" | "outline"> = {
  scheduled: "outline",
  in_progress: "default",
  completed: "success",
  cancelled: "destructive",
};

const LABELS: Record<TripStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function TripStatusBadge({ status }: { status: TripStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
