"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Plus, ChefHat } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { RecipeIngredientRow } from "./RecipeIngredientRow";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { calcFoodCostPercent, calcMargin, foodCostRating } from "@/lib/foodCost";

interface Props {
  menuItemId: Id<"menuItems">;
  restaurantId: Id<"restaurants">;
  menuItemName: string;
  sellingPrice: number;
}

export function RecipeEditor({ menuItemId, restaurantId, menuItemName, sellingPrice }: Props) {
  const recipe = useQuery(api.recipes.getRecipeByMenuItem, { menuItemId });
  const ingredients = useQuery(api.ingredients.listIngredients, { restaurantId });

  const recipeIngredients = useQuery(
    api.recipeIngredients.listRecipeIngredients,
    recipe ? { recipeId: recipe._id } : "skip"
  );
  const recipeCostData = useQuery(
    api.recipeIngredients.calculateRecipeCost,
    recipe ? { recipeId: recipe._id } : "skip"
  );

  const createRecipe = useMutation(api.recipes.createRecipe);
  const addIngredient = useMutation(api.recipeIngredients.addRecipeIngredient);
  const removeIngredient = useMutation(api.recipeIngredients.removeRecipeIngredient);
  const updateIngredient = useMutation(api.recipeIngredients.updateRecipeIngredient);

  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [addQty, setAddQty] = useState("");
  const [adding, setAdding] = useState(false);
  const [creatingRecipe, setCreatingRecipe] = useState(false);

  if (recipe === undefined || ingredients === undefined) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (recipe === null) {
    return (
      <Card className="flex flex-col items-center justify-center py-14 text-center gap-4">
        <div className="text-gray-300">
          <ChefHat size={48} />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-700">No recipe yet</p>
          <p className="text-sm text-gray-400 mt-1">Create a recipe to track ingredient costs for this dish.</p>
        </div>
        <Button
          disabled={creatingRecipe}
          onClick={async () => {
            setCreatingRecipe(true);
            try {
              await createRecipe({ restaurantId, menuItemId, name: menuItemName });
            } finally {
              setCreatingRecipe(false);
            }
          }}
        >
          <Plus size={16} className="mr-1.5" />
          {creatingRecipe ? "Creating..." : "Create Recipe"}
        </Button>
      </Card>
    );
  }

  const totalCost = recipeCostData?.totalCost ?? 0;
  const pct = calcFoodCostPercent(totalCost, sellingPrice);
  const margin = calcMargin(sellingPrice, totalCost);
  const rating = foodCostRating(pct);
  const costColor =
    rating === "good" ? "text-green-600" : rating === "moderate" ? "text-amber-600" : "text-red-600";

  const ingredientOptions =
    ingredients?.map((i) => ({ value: i._id, label: `${i.name} (${i.unit})` })) ?? [];

  async function handleAdd() {
    if (!selectedIngredientId || !addQty || !recipe) return;
    const qty = parseFloat(addQty);
    if (isNaN(qty) || qty <= 0) return;
    setAdding(true);
    try {
      await addIngredient({
        recipeId: recipe._id,
        ingredientId: selectedIngredientId as Id<"ingredients">,
        quantity: qty,
      });
      setSelectedIngredientId("");
      setAddQty("");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card padding="md">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{recipe.name}</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
            <span>Recipe cost: <span className="font-medium text-gray-700">{formatCurrency(totalCost)}</span></span>
            <span>Selling price: <span className="font-medium text-gray-700">{formatCurrency(sellingPrice)}</span></span>
            <span>
              Food cost:{" "}
              <span className={`font-semibold ${costColor}`}>{formatPercent(pct)}</span>
            </span>
            <span>Margin: <span className="font-medium text-gray-700">{formatCurrency(margin)}</span></span>
          </div>
        </div>
      </div>

      {/* Ingredient list */}
      <div className="mb-4">
        {recipeIngredients === undefined ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : recipeIngredients.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No ingredients added yet.</p>
        ) : (
          <div>
            <div className="flex items-center gap-3 px-0 pb-1 border-b border-gray-200 mb-1">
              <span className="flex-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Ingredient</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-20 text-center">Qty</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-12">Unit</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-16 text-right">Cost</span>
              <span className="w-8" />
            </div>
            {recipeIngredients.map((ri) => {
              if (!ri.ingredient) return null;
              const costRow = (ri.ingredient.costPerUnit ?? 0) * ri.quantity;
              return (
                <RecipeIngredientRow
                  key={ri._id}
                  id={ri._id}
                  ingredientName={ri.ingredient.name}
                  unit={ri.ingredient.unit}
                  quantity={ri.quantity}
                  cost={costRow}
                  onRemove={(id) => removeIngredient({ id })}
                  onUpdateQuantity={(id, quantity) => updateIngredient({ id, quantity })}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add ingredient row */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div className="flex-1 min-w-0">
          <Select
            value={selectedIngredientId}
            onValueChange={setSelectedIngredientId}
            options={ingredientOptions}
            placeholder="Select ingredient..."
          />
        </div>
        <Input
          type="number"
          min={0.001}
          step={0.001}
          value={addQty}
          onChange={(e) => setAddQty(e.target.value)}
          placeholder="Qty"
          className="w-24 shrink-0"
        />
        <Button
          type="button"
          size="md"
          disabled={!selectedIngredientId || !addQty || adding}
          onClick={handleAdd}
          className="shrink-0"
        >
          <Plus size={16} className="mr-1" />
          {adding ? "Adding..." : "Add"}
        </Button>
      </div>
    </Card>
  );
}
