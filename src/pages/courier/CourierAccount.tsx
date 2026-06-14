import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";
import { Icon } from "@iconify/react";
import { getUser } from "@/lib/user";
import { logoutUser } from "@/actions/auth";

const MENU = [
  { icon: "solar:bell-linear", label: "Notifications", sub: "Manage alerts" },
  { icon: "solar:shield-check-linear", label: "Privacy & Security", sub: "Passwords & access" },
  { icon: "solar:question-circle-linear", label: "Help & Support", sub: "FAQs and contact" },
];

export default function CourierAccount() {
  const user = getUser();
  const navigate = useNavigate();
  const name = user?.email?.split("@")[0] ?? "Driver";
  const initials = name.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-xl font-bold">Account</h1>

      <Card className="p-4 gap-4 flex flex-col">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold capitalize">{name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Driver ID</p>
            <p className="text-xs font-mono truncate">{user?.sub}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Organisation</p>
            <p className="text-xs font-mono truncate">{user?.organization_id}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 gap-1 flex flex-col">
        <p className="text-sm text-muted-foreground">Account Balance</p>
        <p className="text-2xl font-bold">KES 0.00</p>
      </Card>

      <ItemGroup>
        {MENU.map((item) => (
          <Item key={item.label} variant="outline">
            <ItemMedia variant="icon">
              <Icon icon={item.icon} fontSize={18} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{item.label}</ItemTitle>
              <ItemDescription>{item.sub}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon icon="solar:alt-arrow-right-linear" fontSize={16} className="text-muted-foreground" />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      <Button variant="destructive" onClick={handleLogout}>
        <Icon icon="solar:logout-linear" fontSize={18} />
        Sign Out
      </Button>
    </div>
  );
}
