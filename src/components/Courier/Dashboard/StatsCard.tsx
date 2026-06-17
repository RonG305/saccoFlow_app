"use client";

import { Icon } from "@iconify/react";
import GridStatCard from "@/components/common/GridStatCard";

export default function DashboardStats({
  stats,
}: {
  stats?: any;
}) {
  const data = stats?.data ?? stats;
console.log("Dashboard statistics: ", data)

  return (
    <div>
      <GridStatCard
        items={[
          {
            title: "Total Trips",
            value: data?.trip_summary?.total_assigned ?? 0,
            icon: <Icon icon="solar:route-linear" fontSize={14} className="text-white" />,
            iconBg: "bg-primary",
          },
          {
            title: "Trips Completed",
            value: `${data?.trip_summary?.completed ?? 0} (${data?.trip_summary?.completion_rate ?? "0.0%"})`,
            icon: <Icon icon="solar:check-circle-linear" fontSize={14} className="text-white" />,
            iconBg: "bg-success",
          },
          {
            title: "On-Time Rate",
            value: data?.performance?.on_time_rate ?? "0.0%",
            icon: <Icon icon="solar:clock-circle-linear" fontSize={14} className="text-white" />,
            iconBg: "bg-secondary",
          },
          {
            title: "Total Incidents",
            value: data?.performance?.total_incidents ?? 0,
            icon: <Icon icon="solar:danger-triangle-linear" fontSize={14} className="text-white" />,
            iconBg: "bg-destructive/80",
          },
        ]}
      />
    </div>
  );
}
