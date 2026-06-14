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
import { reportIncident } from "@/data/couriers/logistics";
import { getUser } from "@/lib/user";
import type { Trip, IncidentType } from "@/types/logistics";
import DrawerField from "./DrawerField";

interface Props {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: "breakdown", label: "Breakdown" },
  { value: "accident", label: "Accident" },
  { value: "off_route", label: "Off Route" },
  { value: "delay", label: "Delay" },
  { value: "fuel_issue", label: "Fuel Issue" },
  { value: "other", label: "Other" },
];

export default function ReportIncidentDrawer({
  trip,
  open,
  onClose,
  onSuccess,
}: Props) {
  const user = getUser();
  const [incidentType, setIncidentType] = useState<IncidentType>("other");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [occurredAt, setOccurredAt] = useState(() =>
    new Date().toISOString().slice(0, 16),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!trip || !user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await reportIncident(trip.id, {
        incident_type: incidentType,
        description,
        occurred_at: new Date(occurredAt).toISOString(),
        reported_by: user.sub,
        location: location || undefined,
      });
      if (result?.error) {
        setError(result?.message ?? "Failed to report incident");
        return;
      }
      setDescription("");
      setLocation("");
      setIncidentType("other");
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
          <DrawerTitle>Report Incident</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 flex flex-col gap-4 pb-2">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <DrawerField label="Incident Type" required>
            <NativeSelect
              className="w-full"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as IncidentType)}
            >
              {INCIDENT_TYPES.map((opt) => (
                <NativeSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </DrawerField>

          <DrawerField label="Description" required>
            <Textarea
              placeholder="Describe what happened..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DrawerField>

          <DrawerField label="Location">
            <Input
              placeholder="e.g. Mombasa road near Athi River"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </DrawerField>

          <DrawerField label="When did it occur?">
            <Input
              type="datetime-local"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
          </DrawerField>
        </div>

        <DrawerFooter>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
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
