"use client";
import { Trash2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  checklist: {
    _id: Id<"checklists">;
    title: string;
    shiftType: string;
    taskCount: number;
    role?: { name: string } | null;
  };
  completionForToday?: { completedTasks: Id<"checklistTasks">[] } | null;
  totalTasks: number;
  onClick: () => void;
  onDelete: () => void;
}

const shiftBadgeVariant: Record<string, "info" | "warning" | "neutral" | "success"> = {
  morning: "info",
  afternoon: "warning",
  evening: "neutral",
  all: "success",
};

const shiftLabel: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  all: "All Shifts",
};

export function ChecklistCard({ checklist, completionForToday, totalTasks, onClick, onDelete }: Props) {
  const completedCount = completionForToday?.completedTasks.length ?? 0;
  const pct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const statusBadge =
    totalTasks === 0 ? null
    : completedCount === totalTasks ? (
      <Badge variant="success">Complete</Badge>
    ) : completedCount > 0 ? (
      <Badge variant="warning">In Progress</Badge>
    ) : (
      <Badge variant="neutral">Not Started</Badge>
    );

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-card-active transition-shadow duration-150 relative"
      )}
      onClick={onClick}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={shiftBadgeVariant[checklist.shiftType] ?? "neutral"}>
          {shiftLabel[checklist.shiftType] ?? checklist.shiftType}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-1 leading-snug">{checklist.title}</h3>

      {/* Role */}
      {checklist.role && (
        <p className="text-xs text-gray-500 mb-3">{checklist.role.name}</p>
      )}

      {/* Task count */}
      <p className="text-xs text-gray-400 mb-4">{checklist.taskCount} task{checklist.taskCount !== 1 ? "s" : ""}</p>

      {/* Progress */}
      {totalTasks > 0 && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-gray-800 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{completedCount}/{totalTasks} complete</span>
            {statusBadge}
          </div>
        </div>
      )}
    </Card>
  );
}
