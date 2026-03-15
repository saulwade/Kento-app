"use client";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface IngredientRow {
  _id: Id<"ingredients">;
  name: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
  minStockLevel: number;
  supplierName?: string;
}

interface Props {
  ingredients: IngredientRow[];
  onEdit: (id: Id<"ingredients">) => void;
  onLogTransaction: (id: Id<"ingredients">) => void;
  onDelete: (id: Id<"ingredients">) => void;
}

export function IngredientTable({ ingredients, onEdit, onLogTransaction, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-card bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Unit
            </th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Cost / Unit
            </th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Current Stock
            </th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Min Stock
            </th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Supplier
            </th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => {
            const isLow = ingredient.currentStock <= ingredient.minStockLevel;
            return (
              <tr key={ingredient._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-medium text-gray-800">{ingredient.name}</td>
                <td className="px-5 py-4 text-gray-600">{ingredient.unit}</td>
                <td className="px-5 py-4 text-gray-600">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  }).format(ingredient.costPerUnit)}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {ingredient.currentStock} {ingredient.unit}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {ingredient.minStockLevel} {ingredient.unit}
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {ingredient.supplierName ?? <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-4">
                  {isLow ? (
                    <Badge variant="danger">Low</Badge>
                  ) : (
                    <Badge variant="success">OK</Badge>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(ingredient._id)}
                      title="Edit ingredient"
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLogTransaction(ingredient._id)}
                      title="Log transaction"
                    >
                      <Plus size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(ingredient._id)}
                      title="Delete ingredient"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
