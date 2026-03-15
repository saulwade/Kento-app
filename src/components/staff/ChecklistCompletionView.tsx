"use client";
import { Check, CheckCircle2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface Props {
  checklist: {
    _id: Id<"checklists">;
    title: string;
    shiftType: string;
    tasks: Array<{ _id: Id<"checklistTasks">; label: string; sortOrder: number }>;
  };
  completion: { completedTasks: Id<"checklistTasks">[] } | null;
  shiftDate: string;
  onToggleTask: (taskId: Id<"checklistTasks">) => void;
}

export function ChecklistCompletionView({ checklist, completion, onToggleTask }: Props) {
  const completedTasks = completion?.completedTasks ?? [];
  const total = checklist.tasks.length;
  const completedCount = completedTasks.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const allDone = total > 0 && completedCount === total;

  return (
    <Card>
      {/* Header + progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {completedCount} of {total} tasks complete
          </span>
          <span className="text-sm font-semibold text-gray-800">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-gray-800 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      {total === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No tasks added yet.</p>
      ) : (
        <ul className="space-y-3">
          {checklist.tasks.map((task) => {
            const isCompleted = completedTasks.includes(task._id);
            return (
              <li
                key={task._id}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onToggleTask(task._id)}
              >
                {/* Custom checkbox */}
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all",
                    isCompleted
                      ? "bg-gray-800 border-gray-800"
                      : "border-gray-300 group-hover:border-gray-500"
                  )}
                >
                  {isCompleted && <Check size={12} className="text-white" />}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm transition-colors select-none",
                    isCompleted
                      ? "line-through text-gray-400"
                      : "text-gray-700 group-hover:text-gray-900"
                  )}
                >
                  {task.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Completion message */}
      {allDone && (
        <div className="mt-6 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span className="text-sm font-medium">All tasks complete! Great work.</span>
        </div>
      )}
    </Card>
  );
}
