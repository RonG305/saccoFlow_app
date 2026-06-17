import { ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="rounded-2xl border bg-background divide-y overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function SettingsRow({
  icon,
  label,
  description,
  onClick,
  danger,
  badge,
  disabled,
}: {
  icon: string;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
  badge?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors",
        danger ? "text-destructive" : "text-foreground hover:bg-accent",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          danger ? "bg-destructive/10" : "bg-muted",
        ].join(" ")}
      >
        <Icon
          icon={icon}
          fontSize={18}
          className={danger ? "text-destructive" : "text-muted-foreground"}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      {badge ? (
        <Badge variant="secondary" className="text-[10px] shrink-0">
          {badge}
        </Badge>
      ) : !disabled ? (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      ) : null}
    </button>
  );
}
