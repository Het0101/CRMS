interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  arrested: "bg-danger/15 text-danger border-danger/30",
  active: "bg-success/15 text-success border-success/30",
  wanted: "bg-primary/15 text-primary border-primary/30",
  released: "bg-muted text-muted-foreground border-border",
  open: "bg-accent/15 text-accent border-accent/30",
  closed: "bg-muted text-muted-foreground border-border",
  pending: "bg-primary/15 text-primary border-primary/30",
  "under investigation": "bg-accent/15 text-accent border-accent/30",
  filed: "bg-accent/15 text-accent border-accent/30",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const style = statusStyles[key] || "bg-muted text-muted-foreground border-border";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-mono font-bold tracking-wider uppercase ${style}`}>
      {status}
    </span>
  );
}
