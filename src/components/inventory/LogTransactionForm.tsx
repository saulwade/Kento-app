"use client";
import { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface Props {
  ingredientName: string;
  ingredientUnit: string;
  onSubmit: (data: { type: string; quantity: number; notes?: string }) => Promise<void>;
  onCancel: () => void;
}

const TYPE_OPTIONS = [
  { value: "purchase", label: "Purchase (add stock)" },
  { value: "usage", label: "Usage (deduct)" },
  { value: "waste", label: "Waste (deduct)" },
  { value: "adjustment", label: "Adjustment (signed)" },
];

const helperText: Record<string, string> = {
  purchase: "Quantity will be ADDED to stock.",
  usage: "Quantity will be DEDUCTED from stock.",
  waste: "Quantity will be DEDUCTED from stock.",
  adjustment: "Positive adds, negative deducts.",
};

export function LogTransactionForm({ ingredientName, ingredientUnit, onSubmit, onCancel }: Props) {
  const [type, setType] = useState("purchase");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdjustment = type === "adjustment";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (isNaN(qty) || (!isAdjustment && qty <= 0)) return;
    setLoading(true);
    try {
      await onSubmit({
        type,
        quantity: qty,
        notes: notes.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">
        Logging transaction for <span className="font-medium text-gray-700">{ingredientName}</span>
      </p>

      <div>
        <Label htmlFor="tx-type">Transaction Type</Label>
        <Select
          value={type}
          onValueChange={setType}
          options={TYPE_OPTIONS}
        />
      </div>

      <div>
        <Label htmlFor="tx-qty">
          Quantity ({ingredientUnit})
        </Label>
        <Input
          id="tx-qty"
          type="number"
          min={isAdjustment ? undefined : 0.001}
          step={0.001}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={isAdjustment ? "e.g. -2.5 or 3" : "0.000"}
          required
        />
        {type && (
          <p className="mt-1.5 text-xs text-gray-400">{helperText[type]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tx-notes">Notes (optional)</Label>
        <textarea
          id="tx-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          rows={3}
          className="flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent disabled:opacity-50 transition-all resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Log Transaction"}
        </Button>
      </div>
    </form>
  );
}
