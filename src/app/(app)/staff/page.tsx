"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { ClipboardList, Plus, X } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useRestaurant } from "@/lib/restaurantContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ChecklistCard } from "@/components/staff/ChecklistCard";
import { ChecklistForm } from "@/components/staff/ChecklistForm";
import { Toast, useToast } from "@/components/ui/Toast";

export default function StaffPage() {
  const { restaurantId } = useRestaurant();
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const checklists = useQuery(api.checklists.listChecklists, { restaurantId });
  const staffRoles = useQuery(api.staffRoles.listStaffRoles, { restaurantId });
  const completionRate = useQuery(api.checklistCompletions.getCompletionRate, {
    restaurantId,
    shiftDate: today,
  });

  const createChecklist = useMutation(api.checklists.createChecklist);
  const deleteChecklist = useMutation(api.checklists.deleteChecklist);
  const addTask = useMutation(api.checklistTasks.addTask);
  const createStaffRole = useMutation(api.staffRoles.createStaffRole);
  const deleteStaffRole = useMutation(api.staffRoles.deleteStaffRole);

  const [addOpen, setAddOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  const { toast, showToast, dismissToast } = useToast();

  async function handleCreate(data: {
    title: string;
    shiftType: string;
    roleId?: Id<"staffRoles">;
    tasks: string[];
  }) {
    const checklistId = await createChecklist({
      restaurantId,
      title: data.title,
      shiftType: data.shiftType as "morning" | "afternoon" | "evening" | "all",
      roleId: data.roleId,
    });
    for (let i = 0; i < data.tasks.length; i++) {
      await addTask({ checklistId, label: data.tasks[i], sortOrder: i });
    }
    setAddOpen(false);
    showToast("Checklist created");
  }

  async function handleDelete(id: Id<"checklists">) {
    const confirmed = window.confirm("Delete this checklist? This cannot be undone.");
    if (!confirmed) return;
    await deleteChecklist({ id });
  }

  async function handleAddRole() {
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    setRoleLoading(true);
    try {
      await createStaffRole({ restaurantId, name: trimmed });
      setNewRoleName("");
    } finally {
      setRoleLoading(false);
    }
  }

  async function handleDeleteRole(id: Id<"staffRoles">) {
    const confirmed = window.confirm("Delete this role? This cannot be undone.");
    if (!confirmed) return;
    await deleteStaffRole({ id });
  }

  const isLoading = checklists === undefined || staffRoles === undefined;

  return (
    <div>
      <PageHeader
        title="Staff Operations"
        subtitle="Manage checklists and shift compliance"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            New Checklist
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KpiCard
          label="Today's Compliance"
          value={completionRate !== undefined ? `${completionRate.rate}%` : "—"}
          subtext={
            completionRate
              ? `${completionRate.completed} of ${completionRate.total} checklists fully complete`
              : undefined
          }
        />
        <KpiCard
          label="Total Checklists"
          value={checklists !== undefined ? checklists.length : "—"}
        />
        <KpiCard
          label="Today's Date"
          value={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          subtext="Active shift date"
        />
      </div>

      {/* Staff Roles card */}
      <div className="mb-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Staff Roles
            </h2>
          </div>

          {/* Role chips */}
          {staffRoles && staffRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {staffRoles.map((role) => (
                <span
                  key={role._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  {role.name}
                  <button
                    onClick={() => handleDeleteRole(role._id)}
                    className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Delete ${role.name}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          ) : staffRoles !== undefined ? (
            <p className="text-sm text-gray-400 mb-4">No roles yet. Add one below.</p>
          ) : null}

          {/* Add role inline form */}
          <div className="flex items-center gap-2">
            <Input
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Role name"
              className="max-w-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddRole();
                }
              }}
            />
            <Button
              variant="secondary"
              onClick={handleAddRole}
              disabled={roleLoading || !newRoleName.trim()}
            >
              {roleLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Checklist grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : checklists.length === 0 ? (
        <EmptyState
          icon={<ClipboardList />}
          title="No checklists yet"
          description="Create your first checklist to start tracking staff operations by shift and role."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus size={16} className="mr-1.5" />
              New Checklist
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {checklists.map((checklist) => (
            <ChecklistCard
              key={checklist._id}
              checklist={checklist}
              totalTasks={checklist.taskCount}
              onClick={() => router.push(`/staff/${checklist._id}`)}
              onDelete={() => handleDelete(checklist._id)}
            />
          ))}
        </div>
      )}

      {/* Add Checklist Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New Checklist"
        className="max-w-lg"
      >
        <ChecklistForm
          staffRoles={staffRoles ?? []}
          onSubmit={handleCreate}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}
