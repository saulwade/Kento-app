import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { FoodCostBadge } from "@/components/food-cost/FoodCostBadge";
import { TrendingUp } from "lucide-react";

interface Props {
  items: Array<{
    name: string;
    sellingPrice: number;
    recipeCost: number;
    margin: number;
    foodCostPct: number;
  }>;
}

export function TopItemsWidget({ items }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">Top Profitable Items</h3>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No items with recipes yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-400">{formatCurrency(item.sellingPrice)} selling price</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">{formatCurrency(item.margin)}</span>
                <FoodCostBadge pct={item.foodCostPct} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/food-cost" className="text-xs text-gray-500 hover:text-gray-700 mt-3 block">
        View food cost analysis →
      </Link>
    </Card>
  );
}
