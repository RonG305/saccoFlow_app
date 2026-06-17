import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SettingsSection, SettingsRow } from "@/components/common/SettingsSection";
import { Icon } from "@iconify/react";
import { getUser } from "@/lib/user";
import { logoutUser } from "@/actions/auth";
import { getUserProfile } from "@/data/user-management/auth-users";
import type { MemberProfile } from "@/types/auth";

export default function CourierAccount() {
  const user = getUser();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const name = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ")
    : user?.email?.split("@")[0] ?? "Driver";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logoutUser();
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col gap-4 pt-4 pb-6">
      <h1 className="text-xl font-bold">Account</h1>

      {/* Profile card */}
      <Card className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {profile?.email ?? user?.email ?? "—"}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs capitalize">
              {profile?.account_type ?? "Driver"}
            </Badge>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Driver ID</p>
            <p className="text-xs font-mono truncate mt-0.5">{user?.sub ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Organisation</p>
            <p className="text-xs font-mono truncate mt-0.5">{user?.organization_id ?? "—"}</p>
          </div>
          {profile?.phone_number && (
            <div className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon icon="solar:phone-linear" fontSize={13} />
              <span>{profile.phone_number}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Settings */}
      <div className="flex flex-col gap-3">
        <SettingsSection title="General">
          <SettingsRow
            icon="solar:bell-linear"
            label="Notifications"
            description="Manage delivery alerts"
            badge="Coming soon"
            disabled
          />
          <SettingsRow
            icon="solar:shield-check-linear"
            label="Privacy & Security"
            description="Passwords & account access"
            onClick={() => navigate("/account/security")}
          />
          <SettingsRow
            icon="solar:question-circle-linear"
            label="Help & Support"
            description="FAQs and contact"
            badge="Coming soon"
            disabled
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            icon="solar:logout-linear"
            label="Sign Out"
            description="Sign out of your account"
            danger
            onClick={handleLogout}
          />
        </SettingsSection>
      </div>
    </div>
  );
}
