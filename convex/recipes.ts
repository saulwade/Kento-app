import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRecipeByMenuItem = query({
  args: { menuItemId: v.id("menuItems") },
  handler: async (ctx, { menuItemId }) => {
    return ctx.db
      .query("recipes")
      .withIndex("by_menuItemId", (q) => q.eq("menuItemId", menuItemId))
      .first();
  },
});

export const createRecipe = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    menuItemId: v.id("menuItems"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("recipes", { ...args, createdAt: Date.now() });
  },
});

export const deleteRecipe = mutation({
  args: { id: v.id("recipes") },
  handler: async (ctx, { id }) => {
    const ris = await ctx.db
      .query("recipeIngredients")
      .withIndex("by_recipeId", (q) => q.eq("recipeId", id))
      .collect();
    for (const ri of ris) await ctx.db.delete(ri._id);
    await ctx.db.delete(id);
  },
});
