import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSection, SettingsRow } from "@/components/common/SettingsSection";
import EditProfileDrawer from "@/components/UserAccount/EditProfileDrawer";
import EditContactDrawer from "@/components/UserAccount/EditContactDrawer";
import ChangePasswordDrawer from "@/components/UserAccount/ChangePasswordDrawer";
import DeleteAccountDrawer from "@/components/UserAccount/DeleteAccountDrawer";
import { getUser } from "@/lib/user";
import { getUserProfile } from "@/data/user-management/auth-users";
import type { MemberProfile } from "@/types/auth";


type DrawerKey = "profile" | "contact" | "password" | "delete" | null;

export default function PrivacySecurityPage() {
  const navigate = useNavigate();
  const user = getUser();

  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState<DrawerKey>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const data = await getUserProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSuccess = () => {
    setOpenDrawer(null);
    fetchProfile();
  };

  const name = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ")
    : user?.email?.split("@")[0] ?? "Member";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen mx-1 pb-20">
      <div className="flex items-center gap-3  pt-10 pb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border bg-background shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight">Privacy & Security</h1>
          <p className="text-xs text-muted-foreground">Manage your profile and account security</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-background p-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{name}</p>
                <p className="text-sm text-muted-foreground truncate">{profile?.email ?? user?.email ?? "—"}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs capitalize">
                {profile?.account_type ?? "Member"}
              </Badge>
            </div>

            {(profile?.phone_number || profile?.city) && (
              <>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {profile?.phone_number && (
                    <div className="flex items-center gap-1.5">
                      <Icon icon="solar:phone-linear" fontSize={14} />
                      <span className="truncate">{profile.phone_number}</span>
                    </div>
                  )}
                  {profile?.city && (
                    <div className="flex items-center gap-1.5">
                      <Icon icon="solar:map-point-linear" fontSize={14} />
                      <span className="truncate">{profile.city}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SettingsSection title="Profile">
          <SettingsRow icon="solar:user-id-bold" label="Personal Information" description="Name, gender, date of birth" onClick={() => setOpenDrawer("profile")} />
          <SettingsRow icon="solar:phone-bold" label="Contact & Address" description="Phone number, location details" onClick={() => setOpenDrawer("contact")} />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingsRow icon="solar:lock-password-bold" label="Change Password" description="Update your account password" onClick={() => setOpenDrawer("password")} />
          <SettingsRow icon="solar:shield-check-bold" label="Two-Factor Authentication" description="Add an extra layer of security" badge="Coming soon" disabled />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow icon="solar:eye-bold" label="Data & Privacy" description="Control how your data is used" badge="Coming soon" disabled />
          <SettingsRow icon="solar:trash-bin-trash-bold" label="Delete Account" description="Permanently remove your data" danger onClick={() => setOpenDrawer("delete")} />
        </SettingsSection>
      </div>

      <EditProfileDrawer
        open={openDrawer === "profile"}
        profile={profile}
        onClose={() => setOpenDrawer(null)}
        onSuccess={handleSuccess}
      />
      <EditContactDrawer
        open={openDrawer === "contact"}
        profile={profile}
        onClose={() => setOpenDrawer(null)}
        onSuccess={handleSuccess}
      />
      <ChangePasswordDrawer
        open={openDrawer === "password"}
        onClose={() => setOpenDrawer(null)}
        onSuccess={() => { setOpenDrawer(null); navigate("/signin", { replace: true }); }}
      />
      <DeleteAccountDrawer
        open={openDrawer === "delete"}
        onClose={() => setOpenDrawer(null)}
        onDeleted={() => navigate("/", { replace: true })}
      />
    </div>
  );
}
