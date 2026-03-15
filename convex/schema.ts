import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    name: v.string(),
    ownerUserId: v.string(),
    createdAt: v.number(),
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    language: v.optional(v.string()),
  }),

  users: defineTable({
    clerkId: v.string(),
    restaurantId: v.id("restaurants"),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("owner"), v.literal("manager"), v.literal("employee")),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_restaurantId", ["restaurantId"]),

  ingredients: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    unit: v.string(),
    currentStock: v.number(),
    costPerUnit: v.number(),
    minStockLevel: v.number(),
    supplierName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_restaurantId", ["restaurantId"]),

  inventoryTransactions: defineTable({
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
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_ingredientId", ["ingredientId"])
    .index("by_restaurantId", ["restaurantId"]),

  menuItems: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    sellingPrice: v.number(),
    category: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_restaurantId", ["restaurantId"]),

  recipes: defineTable({
    restaurantId: v.id("restaurants"),
    menuItemId: v.id("menuItems"),
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_menuItemId", ["menuItemId"])
    .index("by_restaurantId", ["restaurantId"]),

  recipeIngredients: defineTable({
    recipeId: v.id("recipes"),
    ingredientId: v.id("ingredients"),
    quantity: v.number(),
  }).index("by_recipeId", ["recipeId"]),

  staffRoles: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_restaurantId", ["restaurantId"]),

  checklists: defineTable({
    restaurantId: v.id("restaurants"),
    title: v.string(),
    roleId: v.optional(v.id("staffRoles")),
    shiftType: v.union(
      v.literal("morning"),
      v.literal("afternoon"),
      v.literal("evening"),
      v.literal("all")
    ),
    createdAt: v.number(),
  }).index("by_restaurantId", ["restaurantId"]),

  checklistTasks: defineTable({
    checklistId: v.id("checklists"),
    label: v.string(),
    sortOrder: v.number(),
  }).index("by_checklistId", ["checklistId"]),

  checklistCompletions: defineTable({
    checklistId: v.id("checklists"),
    completedBy: v.string(),
    completedAt: v.number(),
    shiftDate: v.string(),
    completedTasks: v.array(v.id("checklistTasks")),
  })
    .index("by_checklistId", ["checklistId"])
    .index("by_shiftDate", ["shiftDate"]),
});
