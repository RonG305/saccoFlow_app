import { useState } from "react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, TriangleAlert } from "lucide-react";
import { deleteUserAccount } from "@/actions/users";
import { logoutUser } from "@/actions/auth";
import { getUser } from "@/lib/user";

interface Props {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteAccountDrawer({ open, onClose, onDeleted }: Props) {
  const user = getUser();
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = user?.email ?? "";
  const confirmed = confirmation.trim() === email;

  const handleClose = () => {
    setConfirmation("");
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    const result = await deleteUserAccount();
    setLoading(false);
    if (!result) {
      setError("Failed to delete account. Please try again or contact support.");
      return;
    }
    logoutUser();
    localStorage.clear();
    onDeleted();
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && handleClose()} direction="bottom">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-destructive">Delete Account</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-2 flex flex-col gap-4">

          <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-semibold text-destructive">This action is permanent</p>
              <ul className="mt-1.5 space-y-1 text-muted-foreground list-disc list-inside">
                <li>Your profile and personal data will be erased</li>
                <li>Your shares and dividend accounts will be closed</li>
                <li>You will be immediately signed out</li>
                <li>This cannot be undone</li>
              </ul>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Type your email address <span className="font-medium text-foreground">{email}</span> to confirm:
            </p>
            <Input
              placeholder={email}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              className={confirmed ? "border-destructive focus-visible:ring-destructive/30" : ""}
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!confirmed || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Permanently delete my account
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
