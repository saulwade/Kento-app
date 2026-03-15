import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

export const ensureUser = mutation({
  args: { name: v.string(), email: v.string(), restaurantId: v.id("restaurants") },
  handler: async (ctx, { name, email, restaurantId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existing) return existing;

    return ctx.db.insert("users", {
      clerkId: identity.subject,
      restaurantId,
      name,
      email,
      role: "owner",
      createdAt: Date.now(),
    });
  },
});
