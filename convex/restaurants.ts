import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMyRestaurant = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return null;

    return ctx.db.get(user.restaurantId);
  },
});

export const updateRestaurantName = mutation({
  args: { id: v.id("restaurants"), name: v.string() },
  handler: async (ctx, { id, name }) => {
    await ctx.db.patch(id, { name });
  },
});

export const updateRestaurantSettings = mutation({
  args: {
    id: v.id("restaurants"),
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    const filtered = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const createRestaurant = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (existing) throw new Error("User already has a restaurant");

    const restaurantId = await ctx.db.insert("restaurants", {
      name,
      ownerUserId: identity.subject,
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      clerkId: identity.subject,
      restaurantId,
      name: identity.name ?? identity.subject,
      email: identity.email ?? "",
      role: "owner",
      createdAt: Date.now(),
    });

    return restaurantId;
  },
});
