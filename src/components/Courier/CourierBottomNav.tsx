import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

const tabs = [
  { to: "/courier/home", label: "Home", icon: "solar:home-2-linear" },
  { to: "/courier/trips", label: "Deliveries", icon: "solar:delivery-linear" },
  { to: "/courier/account", label: "Account", icon: "solar:user-circle-linear" },
];

export function CourierBottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background">
      <div className="mx-auto flex max-w-xl">
        {tabs.map(({ to, label, icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                active ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              <Icon icon={icon} fontSize={25} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
