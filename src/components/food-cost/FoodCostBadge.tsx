import { Badge } from "@/components/ui/Badge";
import { formatPercent } from "@/lib/utils";
import { foodCostRating } from "@/lib/foodCost";

interface Props {
  pct: number;
}

export function FoodCostBadge({ pct }: Props) {
  const rating = foodCostRating(pct);
  const variant = rating === "good" ? "success" : rating === "moderate" ? "warning" : "danger";
  return <Badge variant={variant}>{formatPercent(pct)}</Badge>;
}
