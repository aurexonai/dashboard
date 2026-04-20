import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  height?: number;
}

export function ChartContainer({ title, children, height = 300 }: ChartContainerProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground font-heading mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {children as any}
      </ResponsiveContainer>
    </div>
  );
}
