"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { useRestaurant } from "@/lib/restaurantContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { LogTransactionForm } from "@/components/inventory/LogTransactionForm";
import { TransactionHistory } from "@/components/inventory/TransactionHistory";

export default function IngredientDetailPage() {
  const params = useParams();
  const ingredientId = params.ingredientId as Id<"ingredients">;

  const { restaurantId } = useRestaurant();

  const ingredients = useQuery(api.ingredients.listIngredients, { restaurantId });
  const transactions = useQuery(api.inventoryTransactions.listTransactions, { ingredientId });

  const logTransaction = useMutation(api.inventoryTransactions.logTransaction);

  const [logOpen, setLogOpen] = useState(false);

  const ingredient = ingredients?.find((i) => i._id === ingredientId);

  async function handleLogTransaction(data: { type: string; quantity: number; notes?: string }) {
    await logTransaction({
      restaurantId,
      ingredientId,
      type: data.type as "purchase" | "usage" | "waste" | "adjustment",
      quantity: data.quantity,
      notes: data.notes,
    });
    setLogOpen(false);
  }

  const isLoading = ingredients === undefined || transactions === undefined;

  // Compute variance log values from transactions
  const totalPurchased = transactions
    ? transactions.filter((t) => t.type === "purchase").reduce((s, t) => s + t.quantity, 0)
    : 0;
  const totalUsed = transactions
    ? transactions.filter((t) => t.type === "usage").reduce((s, t) => s + t.quantity, 0)
    : 0;
  const totalWasted = transactions
    ? transactions.filter((t) => t.type === "waste").reduce((s, t) => s + t.quantity, 0)
    : 0;
  const totalAdjusted = transactions
    ? transactions.filter((t) => t.type === "adjustment").reduce((s, t) => s + t.quantity, 0)
    : 0;

  return (
    <div>
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Inventory
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !ingredient ? (
        <p className="text-sm text-gray-500">Ingredient not found.</p>
      ) : (
        <>
          <PageHeader
            title={ingredient.name}
            subtitle={`${ingredient.unit} — inventory detail`}
            action={
              <Button onClick={() => setLogOpen(true)}>Log Transaction</Button>
            }
          />

          {/* Stock Health Summary */}
          <div className="mb-6">
            <Card>
              <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Stock Summary
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Current stock — large, color-coded */}
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Current Stock
                  </span>
                  <span
                    className={`text-3xl font-bold ${
                      ingredient.currentStock <= ingredient.minStockLevel
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {ingredient.currentStock}
                    <span className="text-base font-medium ml-1 text-gray-500">
                      {ingredient.unit}
                    </span>
                  </span>
                  <div className="mt-1.5">
                    {ingredient.currentStock <= ingredient.minStockLevel ? (
                      <Badge variant="danger">Below minimum</Badge>
                    ) : (
                      <Badge variant="success">Healthy</Badge>
                    )}
                  </div>
                </div>

                <div className="hidden sm:block h-12 w-px bg-gray-100" />

                {/* Variance log — 4-column mini grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Purchased
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      +{totalPurchased} {ingredient.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Used
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      -{totalUsed} {ingredient.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Wasted
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      -{totalWasted} {ingredient.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Adjusted
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {totalAdjusted >= 0 ? "+" : ""}
                      {totalAdjusted} {ingredient.unit}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
            {/* Details card */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Details
                </h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Unit</dt>
                    <dd className="font-medium text-gray-800">{ingredient.unit}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Cost / Unit</dt>
                    <dd className="font-medium text-gray-800">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      }).format(ingredient.costPerUnit)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Current Stock</dt>
                    <dd className="font-medium text-gray-800">
                      {ingredient.currentStock} {ingredient.unit}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Min Stock Level</dt>
                    <dd className="font-medium text-gray-800">
                      {ingredient.minStockLevel} {ingredient.unit}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Supplier</dt>
                    <dd className="font-medium text-gray-800">
                      {ingredient.supplierName ?? <span className="text-gray-300">—</span>}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      {ingredient.currentStock <= ingredient.minStockLevel ? (
                        <Badge variant="danger">Low</Badge>
                      ) : (
                        <Badge variant="success">OK</Badge>
                      )}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>

            {/* Transaction history */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Transaction History
                </h2>
                <TransactionHistory transactions={transactions} unit={ingredient.unit} />
              </Card>
            </div>
          </div>

          {/* Log Transaction Modal */}
          <Modal
            open={logOpen}
            onClose={() => setLogOpen(false)}
            title="Log Transaction"
          >
            <LogTransactionForm
              ingredientName={ingredient.name}
              ingredientUnit={ingredient.unit}
              onSubmit={handleLogTransaction}
              onCancel={() => setLogOpen(false)}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
