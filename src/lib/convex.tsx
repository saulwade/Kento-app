"use client";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clerkUseAuth = useAuth as any;

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={clerkUseAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
