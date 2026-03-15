"use client";
import { createContext, useContext } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface RestaurantContextValue {
  restaurantId: Id<"restaurants">;
  restaurantName: string;
}

export const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function useRestaurant(): RestaurantContextValue {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant must be used inside RestaurantContext.Provider");
  return ctx;
}
