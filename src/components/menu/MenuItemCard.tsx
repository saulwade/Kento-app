"use client";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { calcFoodCostPercent, foodCostRating } from "@/lib/foodCost";

interface Props {
  item: {
    _id: Id<"menuItems">;
    name: string;
    category: string;
    sellingPrice: number;
    isActive: boolean;
  };
  recipeCost?: number;
  onClick: () => void;
}

export function MenuItemCard({ item, recipeCost, onClick }: Props) {
  const hasCost = recipeCost !== undefined;
  const pct = hasCost ? calcFoodCostPercent(recipeCost, item.sellingPrice) : null;
  const rating = pct !== null ? foodCostRating(pct) : null;

  const costBadgeVariant =
    rating === "good" ? "success" : rating === "moderate" ? "warning" : rating === "high" ? "danger" : "neutral";

  return (
    <Card
      padding="md"
      className="cursor-pointer hover:shadow-card-active transition-shadow duration-150 rounded-2xl"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant="neutral">{item.category}</Badge>
        <span
          className={`h-2.5 w-2.5 rounded-full ${item.isActive ? "bg-green-400" : "bg-gray-300"}`}
          title={item.isActive ? "Active" : "Inactive"}
        />
      </div>

      <p className="text-lg font-semibold text-gray-800 mb-4 leading-snug">{item.name}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{formatCurrency(item.sellingPrice)}</span>
        {hasCost && pct !== null ? (
          <Badge variant={costBadgeVariant}>Food cost: {formatPercent(pct)}</Badge>
        ) : (
          <Badge variant="neutral">No recipe</Badge>
        )}
      </div>
    </Card>
  );
}
