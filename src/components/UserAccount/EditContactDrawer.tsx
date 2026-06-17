import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Loader2, Pencil } from "lucide-react";
import { Icon } from "@iconify/react";
import { updateUser } from "@/actions/auth";
import { getUser } from "@/lib/user";
import type { MemberProfile } from "@/types/auth";

const schema = z.object({
  phone_number: z.string().optional(),
  alternative_phone: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  address_type: z.string().optional(),
});

type Fields = z.infer<typeof schema>;

interface Props {
  open: boolean;
  profile: MemberProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon icon={icon} fontSize={15} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-sm font-medium ${value ? "text-foreground" : "text-muted-foreground/50"}`}>
          {value || "Not set"}
        </p>
      </div>
    </div>
  );
}

export default function EditContactDrawer({ open, profile, onClose, onSuccess }: Props) {
  const user = getUser();
  const [mode, setMode] = useState<"view" | "edit">("view");

  const form = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone_number: "", alternative_phone: "", street_address: "",
      city: "", region: "", postal_code: "", country: "", address_type: "",
    },
  });

  useEffect(() => {
    if (open && profile) {
      form.reset({
        phone_number: profile.phone_number ?? "",
        alternative_phone: profile.alternative_phone ?? "",
        street_address: profile.street_address ?? "",
        city: profile.city ?? "",
        region: profile.region ?? "",
        postal_code: profile.postal_code ?? "",
        country: profile.country ?? "",
        address_type: profile.address_type ?? "",
      });
    }
  }, [open, profile, form]);

  const handleClose = () => {
    setMode("view");
    form.reset();
    onClose();
  };

  const onSubmit = async (values: Fields) => {
    const id = user?.sub;
    if (!id) {
      form.setError("root", { message: "Session expired. Please sign in again." });
      return;
    }
    const result = await updateUser(id, values);
    if (result?.error) {
      form.setError("root", { message: result.error });
      return;
    }
    setMode("view");
    onSuccess();
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && handleClose()} direction="bottom">
      <DrawerContent >
        <DrawerHeader className="flex-row items-center justify-between">
          <DrawerTitle>Contact & Address</DrawerTitle>
          {mode === "view" && (
            <button
              type="button"
              onClick={() => setMode("edit")}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </DrawerHeader>

        {mode === "view" && (
          <div className="flex-1 overflow-y-auto px-4 pb-2 border mx-2 rounded-lg">
            <InfoRow icon="solar:phone-bold" label="Phone number" value={profile?.phone_number} />
            <InfoRow icon="solar:phone-calling-bold" label="Alternative phone" value={profile?.alternative_phone} />
            <InfoRow icon="solar:home-2-bold" label="Street address" value={profile?.street_address} />
            <InfoRow
              icon="solar:city-bold"
              label="City / Region"
              value={[profile?.city, profile?.region].filter(Boolean).join(", ") || undefined}
            />
            <InfoRow icon="solar:map-point-bold" label="Postal code" value={profile?.postal_code} />
            <InfoRow icon="solar:global-bold" label="Country" value={profile?.country} />
            <InfoRow icon="solar:tag-bold" label="Address type" value={profile?.address_type} />
          </div>
        )}

        {mode === "edit" && (
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex-1 overflow-y-auto px-4 flex flex-col gap-4 pb-2"
            >
              {form.formState.errors.root && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="phone_number" render={({ field }) => (
                  <FormItem><FormLabel>Phone number</FormLabel><FormControl><Input type="tel" placeholder="+254722334455" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="alternative_phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt. phone <span className="text-xs font-normal text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl><Input type="tel" placeholder="+254711000000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="street_address" render={({ field }) => (
                <FormItem><FormLabel>Street address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="region" render={({ field }) => (
                  <FormItem><FormLabel>Region</FormLabel><FormControl><Input placeholder="Nairobi County" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="postal_code" render={({ field }) => (
                  <FormItem><FormLabel>Postal code</FormLabel><FormControl><Input placeholder="00100" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="Kenya" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="address_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address type</FormLabel>
                  <FormControl>
                    <NativeSelect className="w-full" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
                      <NativeSelectOption value="">Select</NativeSelectOption>
                      <NativeSelectOption value="Residence">Residence</NativeSelectOption>
                      <NativeSelectOption value="Work">Work</NativeSelectOption>
                      <NativeSelectOption value="Billing">Billing</NativeSelectOption>
                      <NativeSelectOption value="Shipping">Shipping</NativeSelectOption>
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </form>
          </Form>
        )}

        <DrawerFooter>
          {mode === "view" ? (
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </DrawerClose>
          ) : (
            <>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <Button variant="outline" onClick={() => setMode("view")}>Cancel</Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
