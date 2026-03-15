import { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: { direction: "up" | "down"; label: string };
  className?: string;
  valueClassName?: string;
}

export function KpiCard({ label, value, subtext, icon, trend, className, valueClassName }: KpiCardProps) {
  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className={cn("text-3xl font-semibold text-gray-800", valueClassName)}>{value}</div>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      {trend && (
        <p className={cn("text-xs font-medium", trend.direction === "up" ? "text-green-600" : "text-red-500")}>
          {trend.direction === "up" ? "↑" : "↓"} {trend.label}
        </p>
      )}
    </Card>
  );
}
