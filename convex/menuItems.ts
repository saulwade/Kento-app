import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listMenuItems = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    return ctx.db
      .query("menuItems")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .order("desc")
      .collect();
  },
});

export const createMenuItem = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    sellingPrice: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("menuItems", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const updateMenuItem = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.optional(v.string()),
    sellingPrice: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    const filtered = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const toggleMenuItemActive = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (!item) throw new Error("Not found");
    await ctx.db.patch(id, { isActive: !item.isActive });
  },
});

export const deleteMenuItem = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
