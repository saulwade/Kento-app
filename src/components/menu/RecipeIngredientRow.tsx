"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface Props {
  id: Id<"recipeIngredients">;
  ingredientName: string;
  unit: string;
  quantity: number;
  cost: number;
  onRemove: (id: Id<"recipeIngredients">) => void;
  onUpdateQuantity: (id: Id<"recipeIngredients">, quantity: number) => void;
}

export function RecipeIngredientRow({ id, ingredientName, unit, quantity, cost, onRemove, onUpdateQuantity }: Props) {
  const [localQty, setLocalQty] = useState(String(quantity));

  function handleBlur() {
    const parsed = parseFloat(localQty);
    if (!isNaN(parsed) && parsed > 0 && parsed !== quantity) {
      onUpdateQuantity(id, parsed);
    } else {
      setLocalQty(String(quantity));
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="flex-1 text-sm font-medium text-gray-800 min-w-0 truncate">{ingredientName}</span>

      <div className="flex items-center gap-1.5 shrink-0">
        <Input
          type="number"
          min={0.001}
          step={0.001}
          value={localQty}
          onChange={(e) => setLocalQty(e.target.value)}
          onBlur={handleBlur}
          className="w-20 h-8 text-sm px-2"
        />
        <span className="text-sm text-gray-500 w-12 truncate">{unit}</span>
      </div>

      <span className="text-sm text-gray-600 w-16 text-right shrink-0">{formatCurrency(cost)}</span>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 px-2"
      >
        <Trash2 size={15} />
      </Button>
    </div>
  );
}
