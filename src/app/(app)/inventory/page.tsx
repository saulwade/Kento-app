"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Package } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useRestaurant } from "@/lib/restaurantContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { IngredientTable } from "@/components/inventory/IngredientTable";
import { IngredientForm, type IngredientFormData } from "@/components/inventory/IngredientForm";
import { LogTransactionForm } from "@/components/inventory/LogTransactionForm";
import { Toast, useToast } from "@/components/ui/Toast";

export default function InventoryPage() {
  const { restaurantId } = useRestaurant();

  const ingredients = useQuery(api.ingredients.listIngredients, { restaurantId });

  const createIngredient = useMutation(api.ingredients.createIngredient);
  const updateIngredient = useMutation(api.ingredients.updateIngredient);
  const deleteIngredient = useMutation(api.ingredients.deleteIngredient);
  const logTransaction = useMutation(api.inventoryTransactions.logTransaction);

  const [addOpen, setAddOpen] = useState(false);
  const [editIngredientId, setEditIngredientId] = useState<Id<"ingredients"> | null>(null);
  const [logTransactionId, setLogTransactionId] = useState<Id<"ingredients"> | null>(null);

  const { toast, showToast, dismissToast } = useToast();

  const editIngredient = editIngredientId
    ? ingredients?.find((i) => i._id === editIngredientId)
    : null;

  const logIngredient = logTransactionId
    ? ingredients?.find((i) => i._id === logTransactionId)
    : null;

  async function handleCreate(data: IngredientFormData) {
    await createIngredient({ restaurantId, ...data });
    setAddOpen(false);
    showToast("Ingredient added");
  }

  async function handleEdit(data: IngredientFormData) {
    if (!editIngredientId) return;
    await updateIngredient({
      id: editIngredientId,
      name: data.name,
      unit: data.unit,
      costPerUnit: data.costPerUnit,
      minStockLevel: data.minStockLevel,
      supplierName: data.supplierName,
    });
    setEditIngredientId(null);
    showToast("Ingredient updated");
  }

  async function handleLogTransaction(data: { type: string; quantity: number; notes?: string }) {
    if (!logTransactionId) return;
    await logTransaction({
      restaurantId,
      ingredientId: logTransactionId,
      type: data.type as "purchase" | "usage" | "waste" | "adjustment",
      quantity: data.quantity,
      notes: data.notes,
    });
    setLogTransactionId(null);
    showToast("Transaction logged");
  }

  async function handleDelete(id: Id<"ingredients">) {
    const confirmed = window.confirm("Delete this ingredient? This cannot be undone.");
    if (!confirmed) return;
    await deleteIngredient({ id });
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Track ingredient stock and costs"
        action={
          <Button onClick={() => setAddOpen(true)}>Add Ingredient</Button>
        }
      />

      {ingredients === undefined ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : ingredients.length === 0 ? (
        <EmptyState
          icon={<Package />}
          title="No ingredients yet"
          description="Start by adding your first ingredient."
          action={
            <Button onClick={() => setAddOpen(true)}>Add Ingredient</Button>
          }
        />
      ) : (
        <IngredientTable
          ingredients={ingredients}
          onEdit={setEditIngredientId}
          onLogTransaction={setLogTransactionId}
          onDelete={handleDelete}
        />
      )}

      {/* Add Ingredient Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Ingredient"
      >
        <IngredientForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      {/* Edit Ingredient Modal */}
      <Modal
        open={!!editIngredientId}
        onClose={() => setEditIngredientId(null)}
        title="Edit Ingredient"
      >
        {editIngredient && (
          <IngredientForm
            mode="edit"
            initialValues={editIngredient}
            onSubmit={handleEdit}
            onCancel={() => setEditIngredientId(null)}
          />
        )}
      </Modal>

      {/* Log Transaction Modal */}
      <Modal
        open={!!logTransactionId}
        onClose={() => setLogTransactionId(null)}
        title="Log Transaction"
      >
        {logIngredient && (
          <LogTransactionForm
            ingredientName={logIngredient.name}
            ingredientUnit={logIngredient.unit}
            onSubmit={handleLogTransaction}
            onCancel={() => setLogTransactionId(null)}
          />
        )}
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}
