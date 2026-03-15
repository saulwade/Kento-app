"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { ChecklistCompletionView } from "@/components/staff/ChecklistCompletionView";

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

export default function ChecklistDetailPage() {
  const { checklistId } = useParams<{ checklistId: string }>();
  const today = new Date().toISOString().split("T")[0];

  const checklist = useQuery(api.checklists.getChecklist, {
    id: checklistId as Id<"checklists">,
  });
  const completion = useQuery(api.checklistCompletions.getCompletion, {
    checklistId: checklistId as Id<"checklists">,
    shiftDate: today,
  });

  const submitCompletion = useMutation(api.checklistCompletions.submitCompletion);
  const addTask = useMutation(api.checklistTasks.addTask);

  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  async function handleToggleTask(taskId: Id<"checklistTasks">) {
    const currentCompleted = completion?.completedTasks ?? [];
    const newCompleted = currentCompleted.includes(taskId)
      ? currentCompleted.filter((id) => id !== taskId)
      : [...currentCompleted, taskId];
    await submitCompletion({
      checklistId: checklistId as Id<"checklists">,
      shiftDate: today,
      completedTasks: newCompleted,
    });
  }

  async function handleAddTask() {
    if (!newTaskLabel.trim() || !checklist) return;
    setAddingTask(true);
    try {
      await addTask({
        checklistId: checklistId as Id<"checklists">,
        label: newTaskLabel.trim(),
        sortOrder: checklist.tasks.length,
      });
      setNewTaskLabel("");
    } finally {
      setAddingTask(false);
    }
  }

  if (checklist === undefined || completion === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (checklist === null) {
    return (
      <div className="py-20 text-center text-gray-500">
        Checklist not found.{" "}
        <Link href="/staff" className="text-gray-800 underline">
          Back to Staff
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/staff"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Staff
      </Link>

      <PageHeader
        title={checklist.title}
        action={
          <Badge variant={shiftBadgeVariant[checklist.shiftType] ?? "neutral"}>
            {shiftLabel[checklist.shiftType] ?? checklist.shiftType}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: metadata */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
              Details
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Shift</dt>
                <dd className="text-sm font-medium text-gray-700">
                  {shiftLabel[checklist.shiftType] ?? checklist.shiftType}
                </dd>
              </div>
              {checklist.role && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Role</dt>
                  <dd className="text-sm font-medium text-gray-700">{checklist.role.name}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Tasks</dt>
                <dd className="text-sm font-medium text-gray-700">{checklist.tasks.length} tasks</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Date</dt>
                <dd className="text-sm font-medium text-gray-700">
                  {new Date(today).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Add Task */}
          <Card>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
              Add Task
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Task description"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
              />
              <Button
                size="sm"
                className="flex-shrink-0"
                onClick={handleAddTask}
                disabled={addingTask || !newTaskLabel.trim()}
              >
                <Plus size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: completion view */}
        <div className="lg:col-span-2">
          <ChecklistCompletionView
            checklist={checklist}
            completion={completion ?? null}
            shiftDate={today}
            onToggleTask={handleToggleTask}
          />
        </div>
      </div>
    </div>
  );
}
