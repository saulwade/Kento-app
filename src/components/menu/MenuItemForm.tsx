"use client";
import { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormData {
  name: string;
  category: string;
  sellingPrice: number;
}

interface Props {
  initialValues?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  mode: "create" | "edit";
}

export function MenuItemForm({ initialValues, onSubmit, onCancel, mode }: Props) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [sellingPrice, setSellingPrice] = useState(
    initialValues?.sellingPrice !== undefined ? String(initialValues.sellingPrice) : ""
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim() || sellingPrice === "") return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), category: category.trim(), sellingPrice: parseFloat(sellingPrice) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="item-name">Name</Label>
        <Input
          id="item-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grilled Salmon"
          required
        />
      </div>

      <div>
        <Label htmlFor="item-category">Category</Label>
        <Input
          id="item-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Main, Appetizer, Dessert"
          required
        />
      </div>

      <div>
        <Label htmlFor="item-price">Selling Price</Label>
        <Input
          id="item-price"
          type="number"
          min={0}
          step={0.01}
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : mode === "create" ? "Create Item" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
