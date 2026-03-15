import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

export function Card({ className, padding = "md", ...props }: CardProps) {
  const paddingClasses = { sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-card",
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}
