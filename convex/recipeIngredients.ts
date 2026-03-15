import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listRecipeIngredients = query({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, { recipeId }) => {
    const ris = await ctx.db
      .query("recipeIngredients")
      .withIndex("by_recipeId", (q) => q.eq("recipeId", recipeId))
      .collect();
    return Promise.all(
      ris.map(async (ri) => ({
        ...ri,
        ingredient: await ctx.db.get(ri.ingredientId),
      }))
    );
  },
});

export const calculateRecipeCost = query({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, { recipeId }) => {
    const ris = await ctx.db
      .query("recipeIngredients")
      .withIndex("by_recipeId", (q) => q.eq("recipeId", recipeId))
      .collect();

    const items = await Promise.all(
      ris.map(async (ri) => {
        const ingredient = await ctx.db.get(ri.ingredientId);
        if (!ingredient) return null;
        const cost = ingredient.costPerUnit * ri.quantity;
        return {
          name: ingredient.name,
          unit: ingredient.unit,
          quantity: ri.quantity,
          cost,
        };
      })
    );

    const validItems = items.filter(Boolean) as NonNullable<(typeof items)[number]>[];
    const totalCost = validItems.reduce((sum, i) => sum + i.cost, 0);
    return { totalCost, ingredients: validItems };
  },
});

export const addRecipeIngredient = mutation({
  args: {
    recipeId: v.id("recipes"),
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("recipeIngredients", args);
  },
});

export const updateRecipeIngredient = mutation({
  args: { id: v.id("recipeIngredients"), quantity: v.number() },
  handler: async (ctx, { id, quantity }) => {
    await ctx.db.patch(id, { quantity });
  },
});

export const removeRecipeIngredient = mutation({
  args: { id: v.id("recipeIngredients") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
