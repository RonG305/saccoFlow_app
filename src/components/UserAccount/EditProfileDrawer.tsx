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
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Loader2, Pencil } from "lucide-react";
import { Icon } from "@iconify/react";
import { updateUser } from "@/actions/auth";
import { getUser } from "@/lib/user";
import type { MemberProfile } from "@/types/auth";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  bio: z.string().optional(),
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
        <p className="text-[13px] font-medium  tracking-wide text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-sm font-medium ${value ? "text-foreground" : "text-muted-foreground/50"}`}>
          {value || "Not set"}
        </p>
      </div>
    </div>
  );
}

export default function EditProfileDrawer({ open, profile, onClose, onSuccess }: Props) {
  const user = getUser();
  const [mode, setMode] = useState<"view" | "edit">("view");

  const form = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "", last_name: "", middle_name: "", gender: "", date_of_birth: "", bio: "",
    },
  });

  // Sync form when profile arrives or drawer opens
  useEffect(() => {
    if (open && profile) {
      form.reset({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        middle_name: profile.middle_name ?? "",
        gender: profile.gender ?? "",
        date_of_birth: profile.date_of_birth ?? "",
        bio: profile.bio ?? "",
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
      <DrawerContent>
        <DrawerHeader className="flex-row items-center justify-between">
          <DrawerTitle>Personal Information</DrawerTitle>
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

        {/* View mode */}
        {mode === "view" && (
          <div className="flex-1 overflow-y-auto px-4 pb-2">
            <InfoRow
              icon="solar:user-bold"
              label="Full name"
              value={[profile?.first_name, profile?.middle_name, profile?.last_name].filter(Boolean).join(" ") || undefined}
            />
            <InfoRow
              icon="solar:users-group-rounded-bold"
              label="Gender"
              value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : undefined}
            />
            <InfoRow icon="solar:calendar-bold" label="Date of birth" value={profile?.date_of_birth} />
            <InfoRow icon="solar:document-text-bold" label="Bio" value={profile?.bio} />
          </div>
        )}

        {/* Edit mode */}
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
                <FormField control={form.control} name="first_name" render={({ field }) => (
                  <FormItem><FormLabel>First name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="last_name" render={({ field }) => (
                  <FormItem><FormLabel>Last name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="middle_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle name <span className="text-xs font-normal text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="A." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <NativeSelect className="w-full" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
                        <NativeSelectOption value="">Select</NativeSelectOption>
                        <NativeSelectOption value="male">Male</NativeSelectOption>
                        <NativeSelectOption value="female">Female</NativeSelectOption>
                        <NativeSelectOption value="other">Other</NativeSelectOption>
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="date_of_birth" render={({ field }) => (
                  <FormItem><FormLabel>Date of birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio <span className="text-xs font-normal text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="A short bio about yourself..." rows={3} {...field} /></FormControl>
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
