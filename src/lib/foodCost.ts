export function calcFoodCostPercent(recipeCost: number, sellingPrice: number): number {
  if (sellingPrice === 0) return 0;
  return (recipeCost / sellingPrice) * 100;
}

export function calcMargin(sellingPrice: number, recipeCost: number): number {
  return sellingPrice - recipeCost;
}

export function foodCostRating(pct: number): "good" | "moderate" | "high" {
  if (pct < 30) return "good";
  if (pct < 40) return "moderate";
  return "high";
}
