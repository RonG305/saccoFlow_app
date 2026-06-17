import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { getDriverTripTimeSeries } from "@/data/couriers/logistics";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "Day" },
  { value: "weekly", label: "Week" },
  { value: "monthly", label: "Month" },
  { value: "yearly", label: "Year" },
];

const chartConfig = {
  value: {
    label: "Trips",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function normalizeData(raw: unknown): { label: string; value: number }[] {
  const arr: any[] = (raw as any)?.data?.series ?? [];
  return arr.map((p) => ({
    label: String(p.label ?? ""),
    value: Number(p.value ?? 0),
  }));
}

export function TripTimeSeriesChart({ driverId }: { driverId: string }) {
  const [period, setPeriod] = useState<Period>("daily");
  const [data, setData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driverId) return;
    setLoading(true);
    getDriverTripTimeSeries(driverId, period)
      .then((res) => setData(normalizeData(res)))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [driverId, period]);

  const chartPoints = data;

  const total = data.reduce((s, d) => s + d.value, 0);
  const last = data[data.length - 1]?.value ?? 0;
  const prev = data[data.length - 2]?.value ?? 0;
  const trendPct = prev > 0 ? (((last - prev) / prev) * 100).toFixed(1) : null;
  const isUp = last >= prev;

  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-base">Trip Count</CardTitle>
            <CardDescription className="text-xs">
              Number of trips per {period === "daily" ? "day" : period === "weekly" ? "week" : period === "monthly" ? "month" : "year"}
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
          <Skeleton className="h-44 w-full rounded-lg" />
        ) : chartPoints.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-sm text-muted-foreground">
            No data for this period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-44 w-full">
            <BarChart data={chartPoints} barCategoryGap="35%">
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
                width={24}
                allowDecimals={false}
                tick={{ fontSize: 10 }}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
            </BarChart>
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
            {total} total trip{total !== 1 ? "s" : ""} in view
          </div>
        </CardFooter>
      )}
    </>
  );
}
