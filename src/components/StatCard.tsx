import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: string;
  className?: string;
}

export function StatCard({ icon, label, value, delta, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-body">{label}</p>
            <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
          </div>
        </div>
        {delta && (
          <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', delta.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
