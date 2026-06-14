import { Label } from "@/components/ui/label";
import type { ReactNode } from "react";

interface Props {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export default function DrawerField({ label, required, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
