import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCompletion = query({
  args: { checklistId: v.id("checklists"), shiftDate: v.string() },
  handler: async (ctx, { checklistId, shiftDate }) => {
    return ctx.db
      .query("checklistCompletions")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .filter((q) => q.eq(q.field("shiftDate"), shiftDate))
      .first();
  },
});

export const submitCompletion = mutation({
  args: {
    checklistId: v.id("checklists"),
    shiftDate: v.string(),
    completedTasks: v.array(v.id("checklistTasks")),
  },
  handler: async (ctx, { checklistId, shiftDate, completedTasks }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("checklistCompletions")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .filter((q) => q.eq(q.field("shiftDate"), shiftDate))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { completedTasks, completedAt: Date.now() });
      return existing._id;
    }

    return ctx.db.insert("checklistCompletions", {
      checklistId,
      completedBy: identity.subject,
      completedAt: Date.now(),
      shiftDate,
      completedTasks,
    });
  },
});

export const getCompletionRate = query({
  args: { restaurantId: v.id("restaurants"), shiftDate: v.string() },
  handler: async (ctx, { restaurantId, shiftDate }) => {
    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();

    const total = checklists.length;
    if (total === 0) return { rate: 0, completed: 0, total: 0 };

    let completed = 0;
    for (const checklist of checklists) {
      const comp = await ctx.db
        .query("checklistCompletions")
        .withIndex("by_checklistId", (q) => q.eq("checklistId", checklist._id))
        .filter((q) => q.eq(q.field("shiftDate"), shiftDate))
        .first();

      if (comp) {
        const tasks = await ctx.db
          .query("checklistTasks")
          .withIndex("by_checklistId", (q) => q.eq("checklistId", checklist._id))
          .collect();
        if (tasks.length > 0 && comp.completedTasks.length === tasks.length) {
          completed++;
        }
      }
    }

    return { rate: Math.round((completed / total) * 100), completed, total };
  },
});
