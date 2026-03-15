import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listTasks = query({
  args: { checklistId: v.id("checklists") },
  handler: async (ctx, { checklistId }) => {
    return ctx.db
      .query("checklistTasks")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .order("asc")
      .collect();
  },
});

export const addTask = mutation({
  args: { checklistId: v.id("checklists"), label: v.string(), sortOrder: v.number() },
  handler: async (ctx, args) => {
    return ctx.db.insert("checklistTasks", args);
  },
});

export const updateTask = mutation({
  args: { id: v.id("checklistTasks"), label: v.string() },
  handler: async (ctx, { id, label }) => {
    await ctx.db.patch(id, { label });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("checklistTasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
