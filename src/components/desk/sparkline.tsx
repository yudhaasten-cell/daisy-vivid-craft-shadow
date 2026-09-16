import type { SparkPoint } from "@/lib/macro/types";
import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  rising,
  className,
}: {
  data: SparkPoint[];
  rising?: boolean;
  className?: string;
}) {
  if (data.length < 2) {
    return <div className={cn("h-10", className)} />;
  }
  const values = data.map((d) => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const path = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((point.v - min) / span) * 100;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn(
        "h-10 w-full overflow-visible",
        rising ? "text-down" : "text-up",
        className,
      )}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
