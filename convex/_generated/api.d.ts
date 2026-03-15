/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as checklistCompletions from "../checklistCompletions.js";
import type * as checklistTasks from "../checklistTasks.js";
import type * as checklists from "../checklists.js";
import type * as dashboard from "../dashboard.js";
import type * as ingredients from "../ingredients.js";
import type * as inventoryTransactions from "../inventoryTransactions.js";
import type * as menuItems from "../menuItems.js";
import type * as recipeIngredients from "../recipeIngredients.js";
import type * as recipes from "../recipes.js";
import type * as restaurants from "../restaurants.js";
import type * as staffRoles from "../staffRoles.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  checklistCompletions: typeof checklistCompletions;
  checklistTasks: typeof checklistTasks;
  checklists: typeof checklists;
  dashboard: typeof dashboard;
  ingredients: typeof ingredients;
  inventoryTransactions: typeof inventoryTransactions;
  menuItems: typeof menuItems;
  recipeIngredients: typeof recipeIngredients;
  recipes: typeof recipes;
  restaurants: typeof restaurants;
  staffRoles: typeof staffRoles;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
