import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardData = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    const today = new Date().toISOString().split("T")[0];

    // Low stock
    const allIngredients = await ctx.db
      .query("ingredients")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();
    const lowStock = allIngredients.filter((i) => i.currentStock <= i.minStockLevel);

    // Menu items with recipe costs
    const menuItems = await ctx.db
      .query("menuItems")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const itemsWithCost = await Promise.all(
      menuItems.map(async (item) => {
        const recipe = await ctx.db
          .query("recipes")
          .withIndex("by_menuItemId", (q) => q.eq("menuItemId", item._id))
          .first();
        if (!recipe) return { item, recipeCost: 0, foodCostPct: 0, margin: item.sellingPrice };

        const ris = await ctx.db
          .query("recipeIngredients")
          .withIndex("by_recipeId", (q) => q.eq("recipeId", recipe._id))
          .collect();

        let recipeCost = 0;
        for (const ri of ris) {
          const ingredient = await ctx.db.get(ri.ingredientId);
          if (ingredient) recipeCost += ingredient.costPerUnit * ri.quantity;
        }

        const foodCostPct = item.sellingPrice > 0 ? (recipeCost / item.sellingPrice) * 100 : 0;
        const margin = item.sellingPrice - recipeCost;
        return { item, recipeCost, foodCostPct, margin };
      })
    );

    // Avg food cost %
    const itemsWithRecipe = itemsWithCost.filter((i) => i.recipeCost > 0);
    const avgFoodCostPercent =
      itemsWithRecipe.length > 0
        ? itemsWithRecipe.reduce((sum, i) => sum + i.foodCostPct, 0) / itemsWithRecipe.length
        : 0;

    // Top profitable items (by margin)
    const topProfitableItems = [...itemsWithCost]
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5)
      .map((i) => ({
        name: i.item.name,
        sellingPrice: i.item.sellingPrice,
        recipeCost: i.recipeCost,
        margin: i.margin,
        foodCostPct: i.foodCostPct,
      }));

    // Checklist compliance
    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();

    let completedCount = 0;
    for (const checklist of checklists) {
      const comp = await ctx.db
        .query("checklistCompletions")
        .withIndex("by_checklistId", (q) => q.eq("checklistId", checklist._id))
        .filter((q) => q.eq(q.field("shiftDate"), today))
        .first();
      if (comp) {
        const tasks = await ctx.db
          .query("checklistTasks")
          .withIndex("by_checklistId", (q) => q.eq("checklistId", checklist._id))
          .collect();
        if (tasks.length === 0 || comp.completedTasks.length === tasks.length) completedCount++;
      }
    }

    const checklistComplianceRate =
      checklists.length > 0 ? Math.round((completedCount / checklists.length) * 100) : 0;

    return {
      lowStockIngredients: lowStock,
      avgFoodCostPercent: Math.round(avgFoodCostPercent * 10) / 10,
      topProfitableItems,
      checklistComplianceRate,
      totalActiveMenuItems: menuItems.length,
      totalIngredients: allIngredients.length,
    };
  },
});

export const listMenuItemsWithCosts = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    const menuItems = await ctx.db
      .query("menuItems")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();

    return Promise.all(
      menuItems.map(async (item) => {
        const recipe = await ctx.db
          .query("recipes")
          .withIndex("by_menuItemId", (q) => q.eq("menuItemId", item._id))
          .first();

        let recipeCost = 0;
        if (recipe) {
          const ris = await ctx.db
            .query("recipeIngredients")
            .withIndex("by_recipeId", (q) => q.eq("recipeId", recipe._id))
            .collect();
          for (const ri of ris) {
            const ingredient = await ctx.db.get(ri.ingredientId);
            if (ingredient) recipeCost += ingredient.costPerUnit * ri.quantity;
          }
        }

        const foodCostPct = item.sellingPrice > 0 ? (recipeCost / item.sellingPrice) * 100 : 0;
        const margin = item.sellingPrice - recipeCost;
        const hasRecipe = recipe !== null;

        return { ...item, recipeCost, foodCostPct, margin, hasRecipe };
      })
    );
  },
});
