export function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-2 ">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
        {title}
      </p>
      {children}
    </div>
  );
}
