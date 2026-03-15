import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listIngredients = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    return ctx.db
      .query("ingredients")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .order("desc")
      .collect();
  },
});

export const getLowStockIngredients = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    const all = await ctx.db
      .query("ingredients")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();
    return all.filter((i) => i.currentStock <= i.minStockLevel);
  },
});

export const createIngredient = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    unit: v.string(),
    costPerUnit: v.number(),
    currentStock: v.number(),
    minStockLevel: v.number(),
    supplierName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("ingredients", { ...args, createdAt: Date.now() });
  },
});

export const updateIngredient = mutation({
  args: {
    id: v.id("ingredients"),
    name: v.optional(v.string()),
    unit: v.optional(v.string()),
    costPerUnit: v.optional(v.number()),
    minStockLevel: v.optional(v.number()),
    supplierName: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    const filtered = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteIngredient = mutation({
  args: { id: v.id("ingredients") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
