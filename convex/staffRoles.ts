import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listStaffRoles = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    return ctx.db
      .query("staffRoles")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();
  },
});

export const createStaffRole = mutation({
  args: { restaurantId: v.id("restaurants"), name: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.insert("staffRoles", { ...args, createdAt: Date.now() });
  },
});

export const deleteStaffRole = mutation({
  args: { id: v.id("staffRoles") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
