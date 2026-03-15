import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listTransactions = query({
  args: { ingredientId: v.id("ingredients") },
  handler: async (ctx, { ingredientId }) => {
    return ctx.db
      .query("inventoryTransactions")
      .withIndex("by_ingredientId", (q) => q.eq("ingredientId", ingredientId))
      .order("desc")
      .collect();
  },
});

export const logTransaction = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    ingredientId: v.id("ingredients"),
    type: v.union(
      v.literal("purchase"),
      v.literal("usage"),
      v.literal("waste"),
      v.literal("adjustment")
    ),
    quantity: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { restaurantId, ingredientId, type, quantity, notes }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const ingredient = await ctx.db.get(ingredientId);
    if (!ingredient) throw new Error("Ingredient not found");

    let delta: number;
    if (type === "purchase") {
      delta = quantity;
    } else if (type === "usage" || type === "waste") {
      delta = -quantity;
    } else {
      // adjustment: quantity is a signed number passed by caller
      delta = quantity;
    }

    await ctx.db.patch(ingredientId, {
      currentStock: ingredient.currentStock + delta,
    });

    await ctx.db.insert("inventoryTransactions", {
      restaurantId,
      ingredientId,
      type,
      quantity,
      notes,
      createdBy: identity.subject,
      createdAt: Date.now(),
    });
  },
});

export const recordSale = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    menuItemId: v.id("menuItems"),
    unitsSold: v.number(),
  },
  handler: async (ctx, { restaurantId, menuItemId, unitsSold }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const recipe = await ctx.db
      .query("recipes")
      .withIndex("by_menuItemId", (q) => q.eq("menuItemId", menuItemId))
      .first();
    if (!recipe) return;

    const recipeIngredients = await ctx.db
      .query("recipeIngredients")
      .withIndex("by_recipeId", (q) => q.eq("recipeId", recipe._id))
      .collect();

    for (const ri of recipeIngredients) {
      const ingredient = await ctx.db.get(ri.ingredientId);
      if (!ingredient) continue;

      const delta = -(ri.quantity * unitsSold);
      await ctx.db.patch(ri.ingredientId, {
        currentStock: ingredient.currentStock + delta,
      });

      await ctx.db.insert("inventoryTransactions", {
        restaurantId,
        ingredientId: ri.ingredientId,
        type: "usage",
        quantity: ri.quantity * unitsSold,
        notes: `Sale of menu item`,
        createdBy: identity.subject,
        createdAt: Date.now(),
      });
    }
  },
});
