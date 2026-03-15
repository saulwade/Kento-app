import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listChecklists = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, { restaurantId }) => {
    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_restaurantId", (q) => q.eq("restaurantId", restaurantId))
      .collect();

    return Promise.all(
      checklists.map(async (c) => {
        const tasks = await ctx.db
          .query("checklistTasks")
          .withIndex("by_checklistId", (q) => q.eq("checklistId", c._id))
          .collect();
        const role = c.roleId ? await ctx.db.get(c.roleId) : null;
        return { ...c, taskCount: tasks.length, role };
      })
    );
  },
});

export const getChecklist = query({
  args: { id: v.id("checklists") },
  handler: async (ctx, { id }) => {
    const checklist = await ctx.db.get(id);
    if (!checklist) return null;
    const tasks = await ctx.db
      .query("checklistTasks")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", id))
      .order("asc")
      .collect();
    const role = checklist.roleId ? await ctx.db.get(checklist.roleId) : null;
    return { ...checklist, tasks, role };
  },
});

export const createChecklist = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    title: v.string(),
    shiftType: v.union(
      v.literal("morning"),
      v.literal("afternoon"),
      v.literal("evening"),
      v.literal("all")
    ),
    roleId: v.optional(v.id("staffRoles")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("checklists", { ...args, createdAt: Date.now() });
  },
});

export const updateChecklist = mutation({
  args: {
    id: v.id("checklists"),
    title: v.optional(v.string()),
    shiftType: v.optional(
      v.union(
        v.literal("morning"),
        v.literal("afternoon"),
        v.literal("evening"),
        v.literal("all")
      )
    ),
    roleId: v.optional(v.id("staffRoles")),
  },
  handler: async (ctx, { id, ...patch }) => {
    const filtered = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteChecklist = mutation({
  args: { id: v.id("checklists") },
  handler: async (ctx, { id }) => {
    const tasks = await ctx.db
      .query("checklistTasks")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", id))
      .collect();
    for (const t of tasks) await ctx.db.delete(t._id);

    const completions = await ctx.db
      .query("checklistCompletions")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", id))
      .collect();
    for (const c of completions) await ctx.db.delete(c._id);

    await ctx.db.delete(id);
  },
});
