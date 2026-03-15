"use client";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { RestaurantContext } from "@/lib/restaurantContext";
import { AppShell } from "@/components/layout/AppShell";
import { Spinner } from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const restaurant = useQuery(api.restaurants.getMyRestaurant);
  const router = useRouter();

  useEffect(() => {
    if (restaurant === null) {
      router.push("/onboarding");
    }
  }, [restaurant, router]);

  if (restaurant === undefined) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <RestaurantContext.Provider value={{ restaurantId: restaurant._id, restaurantName: restaurant.name }}>
      <AppShell>{children}</AppShell>
    </RestaurantContext.Provider>
  );
}
