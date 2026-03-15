"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRestaurant } from "@/lib/restaurantContext";
import { Spinner } from "@/components/ui/Spinner";
import { KpiCard } from "@/components/ui/KpiCard";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { TopItemsWidget } from "@/components/dashboard/TopItemsWidget";
import { ChecklistComplianceWidget } from "@/components/dashboard/ChecklistComplianceWidget";
import { Package, UtensilsCrossed, TrendingDown, ClipboardList } from "lucide-react";

export default function DashboardPage() {
  const { restaurantId, restaurantName } = useRestaurant();
  const today = new Date().toISOString().split("T")[0];
  const data = useQuery(api.dashboard.getDashboardData, { restaurantId });
  const complianceData = useQuery(api.checklistCompletions.getCompletionRate, { restaurantId, shiftDate: today });

  if (data === undefined) {
    return (
      <div className="flex justify-center py-20"><Spinner /></div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">{restaurantName}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total Ingredients"
          value={data.totalIngredients}
          icon={<Package size={18} />}
          subtext={`${data.lowStockIngredients.length} low stock`}
          valueClassName={data.lowStockIngredients.length > 0 ? "text-red-500" : undefined}
        />
        <KpiCard
          label="Active Menu Items"
          value={data.totalActiveMenuItems}
          icon={<UtensilsCrossed size={18} />}
        />
        <KpiCard
          label="Avg Food Cost"
          value={`${data.avgFoodCostPercent.toFixed(1)}%`}
          icon={<TrendingDown size={18} />}
          valueClassName={
            data.avgFoodCostPercent < 30 ? "text-green-600" :
            data.avgFoodCostPercent < 40 ? "text-amber-600" : "text-red-500"
          }
        />
        <KpiCard
          label="Today's Compliance"
          value={`${complianceData?.rate ?? 0}%`}
          icon={<ClipboardList size={18} />}
          subtext={`${complianceData?.completed ?? 0} / ${complianceData?.total ?? 0} checklists`}
        />
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert ingredients={data.lowStockIngredients} />
        <TopItemsWidget items={data.topProfitableItems} />
        <ChecklistComplianceWidget
          rate={complianceData?.rate ?? 0}
          completed={complianceData?.completed ?? 0}
          total={complianceData?.total ?? 0}
        />
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Add ingredient to inventory", href: "/inventory" },
              { label: "Create a menu item", href: "/menu" },
              { label: "Set up staff checklists", href: "/staff" },
              { label: "View food cost analysis", href: "/food-cost" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <span className="text-sm text-gray-600 group-hover:text-gray-800">{action.label}</span>
                <span className="text-gray-400 group-hover:text-gray-600">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
