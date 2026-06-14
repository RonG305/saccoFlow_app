import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Loader2 } from "lucide-react";
import { updateTripStatus } from "@/data/couriers/logistics";
import type { Trip, TripStatus } from "@/types/logistics";
import DrawerField from "./DrawerField";

interface Props {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function UpdateStatusDrawer({
  trip,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<TripStatus>("in_progress");
  const [distanceKm, setDistanceKm] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCompletion = status === "completed";

  const handleSubmit = async () => {
    if (!trip) return;
    setLoading(true);
    setError(null);
    try {
      const result = await updateTripStatus(trip.id, {
        status,
        distance_km:
          isCompletion && distanceKm ? Number(distanceKm) : undefined,
        fuel_used_liters:
          isCompletion && fuelUsed ? Number(fuelUsed) : undefined,
        notes: notes || undefined,
      });
      if (result?.error) {
        setError(result?.message ?? "Failed to update status");
        return;
      }
      setDistanceKm("");
      setFuelUsed("");
      setNotes("");
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => !v && onClose()}
      direction="bottom"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update Trip Status</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 flex flex-col gap-4 pb-2">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <DrawerField label="Status" required>
            <NativeSelect
              className="w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value as TripStatus)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <NativeSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </DrawerField>

          {isCompletion && (
            <>
              <DrawerField label="Distance Covered (km)">
                <Input
                  type="number"
                  placeholder="e.g. 480"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                />
              </DrawerField>
              <DrawerField label="Fuel Used (litres)">
                <Input
                  type="number"
                  placeholder="e.g. 42.3"
                  value={fuelUsed}
                  onChange={(e) => setFuelUsed(e.target.value)}
                />
              </DrawerField>
            </>
          )}

          <DrawerField label="Notes">
            <Textarea
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </DrawerField>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
