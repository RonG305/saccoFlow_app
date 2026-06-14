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
import { Loader2 } from "lucide-react";
import { scheduleTrip } from "@/data/couriers/logistics";
import { getUser } from "@/lib/user";
import DrawerField from "./DrawerField";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY = {
  vehicle_id: "",
  origin: "",
  destination: "",
  planned_departure: "",
  planned_arrival: "",
  purpose: "",
  cargo_description: "",
  notes: "",
};

export default function ScheduleTripDrawer({
  open,
  onClose,
  onSuccess,
}: Props) {
  const user = getUser();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await scheduleTrip({
        vehicle_id: form.vehicle_id,
        driver_id: user.sub,
        organization_id: user.organization_id,
        origin: form.origin,
        destination: form.destination,
        planned_departure: new Date(form.planned_departure).toISOString(),
        planned_arrival: form.planned_arrival
          ? new Date(form.planned_arrival).toISOString()
          : undefined,
        purpose: form.purpose || undefined,
        cargo_description: form.cargo_description || undefined,
        notes: form.notes || undefined,
      });
      if (!result?.id) {
        setError(result?.message ?? "Failed to schedule trip");
        return;
      }
      setForm(EMPTY);
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    !loading &&
    form.vehicle_id.trim() &&
    form.origin.trim() &&
    form.destination.trim() &&
    form.planned_departure;

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => !v && onClose()}
      direction="bottom"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Schedule New Trip</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 flex flex-col gap-4 pb-2">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <DrawerField label="Vehicle ID" required>
            <Input
              placeholder="e.g. clvehicle123"
              value={form.vehicle_id}
              onChange={set("vehicle_id")}
            />
          </DrawerField>
          <DrawerField label="Origin" required>
            <Input
              placeholder="Pickup location"
              value={form.origin}
              onChange={set("origin")}
            />
          </DrawerField>
          <DrawerField label="Destination" required>
            <Input
              placeholder="Drop-off location"
              value={form.destination}
              onChange={set("destination")}
            />
          </DrawerField>
          <DrawerField label="Planned Departure" required>
            <Input
              type="datetime-local"
              value={form.planned_departure}
              onChange={set("planned_departure")}
            />
          </DrawerField>
          <DrawerField label="Planned Arrival">
            <Input
              type="datetime-local"
              value={form.planned_arrival}
              onChange={set("planned_arrival")}
            />
          </DrawerField>
          <DrawerField label="Purpose">
            <Input
              placeholder="e.g. Cargo delivery"
              value={form.purpose}
              onChange={set("purpose")}
            />
          </DrawerField>
          <DrawerField label="Cargo Description">
            <Textarea
              placeholder="Describe the cargo..."
              value={form.cargo_description}
              onChange={set("cargo_description")}
            />
          </DrawerField>
          <DrawerField label="Notes">
            <Textarea
              placeholder="Any additional notes..."
              value={form.notes}
              onChange={set("notes")}
            />
          </DrawerField>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule Trip
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
