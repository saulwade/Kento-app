"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRestaurant } from "@/lib/restaurantContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { FoodCostBadge } from "@/components/food-cost/FoodCostBadge";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown } from "lucide-react";

export default function FoodCostPage() {
  const { restaurantId } = useRestaurant();
  const items = useQuery(api.dashboard.listMenuItemsWithCosts, { restaurantId });

  if (items === undefined) return (
    <div className="flex justify-center py-20"><Spinner /></div>
  );

  const itemsWithRecipe = items.filter((i) => i.hasRecipe);
  const avgFoodCost = itemsWithRecipe.length > 0
    ? itemsWithRecipe.reduce((sum, i) => sum + i.foodCostPct, 0) / itemsWithRecipe.length
    : 0;

  return (
    <div>
      <PageHeader
        title="Food Cost"
        subtitle="Recipe costs vs selling prices across your menu"
      />

      {/* Summary row */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <p className="text-sm text-gray-500 mb-1">Menu Items</p>
            <p className="text-3xl font-semibold text-gray-800">{items.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <p className="text-sm text-gray-500 mb-1">Items with Recipes</p>
            <p className="text-3xl font-semibold text-gray-800">{itemsWithRecipe.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <p className="text-sm text-gray-500 mb-1">Avg Food Cost %</p>
            <p className={`text-3xl font-semibold ${
              avgFoodCost < 30 ? "text-green-600" : avgFoodCost < 40 ? "text-amber-600" : "text-red-500"
            }`}>
              {avgFoodCost.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={<TrendingDown />}
          title="No menu items yet"
          description="Add menu items and attach recipes to see food cost analysis."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Dish</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Category</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Recipe Cost</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Selling Price</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Margin</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Food Cost %</th>
              </tr>
            </thead>
            <tbody>
              {items
                .sort((a, b) => a.foodCostPct - b.foodCostPct)
                .map((item) => (
                <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    {!item.hasRecipe && <span className="ml-2 text-xs text-gray-400">(no recipe)</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">
                    {item.hasRecipe ? formatCurrency(item.recipeCost) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-right">
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <span className={item.margin > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                      {item.hasRecipe ? formatCurrency(item.margin) : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.hasRecipe ? (
                      <FoodCostBadge pct={item.foodCostPct} />
                    ) : (
                      <span className="text-xs text-gray-400">No recipe</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
