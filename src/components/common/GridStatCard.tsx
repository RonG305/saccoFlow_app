import React from "react"
import { Card } from "../ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface GridStatItem {
    title: string
    value: string | number
    icon: React.ReactNode
    iconBg: string
    trend?: number
    trendLabel?: string
}

interface GridStatCardProps {
    items: [GridStatItem, GridStatItem, GridStatItem, GridStatItem]
}

function StatCell({ item }: { item: GridStatItem }) {
    const isPositive = item.trend !== undefined && item.trend >= 0
    return (
        <div className="flex-1 px-3 py-3 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground truncate">{item.title}</p>
                <div className={`rounded-full p-1.5 shrink-0 ${item.iconBg}`}>
                    {item.icon}
                </div>
            </div>
            <p className="text-lg font-bold tracking-tight leading-tight">{item.value}</p>
            {item.trend !== undefined && (
                <div className="flex items-center gap-1">
                    {isPositive
                        ? <TrendingUp className="h-3 w-3 text-success shrink-0" />
                        : <TrendingDown className="h-3 w-3 text-destructive shrink-0" />}
                    <span className={`text-[11px] font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
                        {Math.abs(item.trend)}%
                    </span>
                    {item.trendLabel && (
                        <span className="text-[10px] text-muted-foreground">{item.trendLabel}</span>
                    )}
                </div>
            )}
        </div>
    )
}

const GridStatCard = ({ items }: GridStatCardProps) => {
    return (
        <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-2">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={[
                            i % 2 === 1 ? "border-l border-border" : "",
                            i >= 2 ? "border-t border-border" : "",
                        ].join(" ")}
                    >
                        <StatCell item={item} />
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default GridStatCard
