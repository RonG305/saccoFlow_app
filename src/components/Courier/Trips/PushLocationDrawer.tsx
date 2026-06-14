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
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { pushLocation } from "@/data/couriers/logistics";
import { Row, Section } from "@/components/common/ContentSection";
import type { Trip } from "@/types/logistics";

interface Props {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PushLocationDrawer({
  trip,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePush = async () => {
    if (!trip) return;
    setLoading(true);
    setError(null);
    try {
      await pushLocation(trip.id);
      onSuccess();
    } catch (err) {
      console.log("Push location error: ", err)
      if (err instanceof GeolocationPositionError) {
        const messages: Record<number, string> = {
          1: "Location permission denied. Please allow location access and try again.",
          2: "Unable to determine your location. Make sure GPS is enabled.",
          3: "Location request timed out. Try again.",
        };
        setError(messages[err.code] ?? "Could not get your location.");
      } else {
        setError("Failed to send location. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!trip) return null;

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="bottom">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share Your Location</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 flex flex-col gap-4 pb-2">
          <Section title={trip.trip_ref}>
            <Row label="From" value={trip.origin} />
            <Row label="To" value={trip.destination} />
          </Section>

          <p className="text-sm text-muted-foreground">
            Your current GPS position will be sent to the server.
            {trip.status === "scheduled" &&
              " This will automatically start the trip."}
          </p>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DrawerFooter>
          <Button onClick={handlePush} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon icon="solar:map-point-wave-bold" fontSize={18} />
            )}
            {loading ? "Getting location…" : "Send My Location"}
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
