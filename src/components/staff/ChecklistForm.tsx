"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";

interface Props {
  staffRoles: Array<{ _id: Id<"staffRoles">; name: string }>;
  onSubmit: (data: {
    title: string;
    shiftType: string;
    roleId?: Id<"staffRoles">;
    tasks: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

const shiftOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "all", label: "All Shifts" },
];

export function ChecklistForm({ staffRoles, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [shiftType, setShiftType] = useState("morning");
  const [roleId, setRoleId] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "", label: "No specific role" },
    ...staffRoles.map((r) => ({ value: r._id, label: r.name })),
  ];

  function addTask() {
    setTasks((prev) => [...prev, ""]);
  }

  function removeTask(index: number) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTask(index: number, value: string) {
    setTasks((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        shiftType,
        roleId: roleId ? (roleId as Id<"staffRoles">) : undefined,
        tasks: tasks.filter((t) => t.trim() !== ""),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Checklist Title</Label>
        <Input
          id="title"
          placeholder="e.g. Opening Checklist"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Shift type */}
      <div className="space-y-1.5">
        <Label>Shift Type</Label>
        <Select
          value={shiftType}
          onValueChange={setShiftType}
          options={shiftOptions}
        />
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <Label>Role (optional)</Label>
        <Select
          value={roleId}
          onValueChange={setRoleId}
          options={roleOptions}
          placeholder="No specific role"
        />
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <Label>Tasks</Label>
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder={`Task ${i + 1}`}
              value={task}
              onChange={(e) => updateTask(i, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
              onClick={() => removeTask(i)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 pl-0"
          onClick={addTask}
        >
          <Plus size={14} className="mr-1" />
          Add task
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !title.trim()}>
          {loading ? "Creating..." : "Create Checklist"}
        </Button>
      </div>
    </form>
  );
}
