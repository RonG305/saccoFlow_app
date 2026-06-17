import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { getDriverFuelTimeSeries } from "@/data/couriers/logistics";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "Day" },
  { value: "weekly", label: "Week" },
  { value: "monthly", label: "Month" },
  { value: "yearly", label: "Year" },
];

const chartConfig = {
  value: {
    label: "Litres",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function normalizeData(raw: unknown): { label: string; value: number }[] {
  const arr: any[] = (raw as any)?.data?.series ?? [];
  return arr.map((p) => ({
    label: String(p.label ?? ""),
    value: Number(p.value ?? 0),
  }));
}

export function FuelConsumptionTimeSeriesChart({ driverId }: { driverId: string }) {
  const [period, setPeriod] = useState<Period>("daily");
  const [data, setData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driverId) return;
    setLoading(true);
    getDriverFuelTimeSeries(driverId, period)
      .then((res) => setData(normalizeData(res)))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [driverId, period]);

  const chartPoints = data;

  const totalLitres = data.reduce((s, d) => s + d.value, 0);
  const last = data[data.length - 1]?.value ?? 0;
  const prev = data[data.length - 2]?.value ?? 0;
  const trendPct = prev > 0 ? (((last - prev) / prev) * 100).toFixed(1) : null;
  const isUp = last >= prev;

  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-base">Fuel Consumed</CardTitle>
            <CardDescription className="text-xs">
              Litres used per {period === "daily" ? "day" : period === "weekly" ? "week" : period === "monthly" ? "month" : "year"}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={[
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  period === p.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent",
                ].join(" ")}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {loading ? (
          <Skeleton className="h-52 w-full rounded-lg" />
        ) : chartPoints.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
            No data for this period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <AreaChart data={chartPoints} margin={{ top: 6, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={36}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}L`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v) => `${Number(v).toFixed(1)} L`}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                fill="url(#fillFuel)"
                stroke="var(--color-value)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>

      {!loading && (
        <CardFooter className="flex-col items-start gap-1 pt-0 pb-4 text-sm">
          {trendPct !== null && (
            <div className="flex items-center gap-1.5 leading-none font-medium">
              {isUp ? (
                <>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Up {trendPct}% vs prior period
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                  Down {Math.abs(Number(trendPct))}% vs prior period
                </>
              )}
            </div>
          )}
          <div className="text-xs leading-none text-muted-foreground">
            {totalLitres.toFixed(1)} L total fuel consumed in view
          </div>
        </CardFooter>
      )}
    </>
  );
}
