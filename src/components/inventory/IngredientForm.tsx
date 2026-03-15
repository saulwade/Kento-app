"use client";
import { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export interface IngredientFormData {
  name: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
  minStockLevel: number;
  supplierName?: string;
}

interface Props {
  initialValues?: Partial<IngredientFormData>;
  onSubmit: (data: IngredientFormData) => Promise<void>;
  onCancel: () => void;
  mode: "create" | "edit";
}

const UNIT_OPTIONS = [
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "liter", label: "liter" },
  { value: "ml", label: "ml" },
  { value: "unit", label: "unit" },
  { value: "portion", label: "portion" },
  { value: "other", label: "Other..." },
];

function resolveInitialUnit(unit?: string): { selectValue: string; customValue: string } {
  if (!unit) return { selectValue: "unit", customValue: "" };
  const known = UNIT_OPTIONS.filter((o) => o.value !== "other").find((o) => o.value === unit);
  if (known) return { selectValue: unit, customValue: "" };
  return { selectValue: "other", customValue: unit };
}

interface FormErrors {
  name?: string;
  unit?: string;
  costPerUnit?: string;
  currentStock?: string;
  minStockLevel?: string;
}

export function IngredientForm({ initialValues, onSubmit, onCancel, mode }: Props) {
  const resolved = resolveInitialUnit(initialValues?.unit);

  const [name, setName] = useState(initialValues?.name ?? "");
  const [unitSelect, setUnitSelect] = useState(resolved.selectValue);
  const [customUnit, setCustomUnit] = useState(resolved.customValue);
  const [costPerUnit, setCostPerUnit] = useState(
    initialValues?.costPerUnit !== undefined ? String(initialValues.costPerUnit) : ""
  );
  const [currentStock, setCurrentStock] = useState(
    initialValues?.currentStock !== undefined ? String(initialValues.currentStock) : ""
  );
  const [minStockLevel, setMinStockLevel] = useState(
    initialValues?.minStockLevel !== undefined ? String(initialValues.minStockLevel) : ""
  );
  const [supplierName, setSupplierName] = useState(initialValues?.supplierName ?? "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const effectiveUnit = unitSelect === "other" ? customUnit : unitSelect;

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = "Name is required.";
    }

    if (unitSelect === "other" && !customUnit.trim()) {
      errs.unit = "Please enter a custom unit.";
    }

    const parsedCost = parseFloat(costPerUnit);
    if (costPerUnit === "" || isNaN(parsedCost)) {
      errs.costPerUnit = "Cost per unit is required.";
    } else if (parsedCost < 0) {
      errs.costPerUnit = "Cost per unit must be 0 or greater.";
    }

    if (mode === "create") {
      const parsedStock = parseFloat(currentStock);
      if (currentStock === "" || isNaN(parsedStock)) {
        errs.currentStock = "Current stock is required.";
      } else if (parsedStock < 0) {
        errs.currentStock = "Current stock must be 0 or greater.";
      }
    }

    const parsedMin = parseFloat(minStockLevel);
    if (minStockLevel === "" || isNaN(parsedMin)) {
      errs.minStockLevel = "Min stock level is required.";
    } else if (parsedMin < 0) {
      errs.minStockLevel = "Min stock level must be 0 or greater.";
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        unit: effectiveUnit.trim(),
        costPerUnit: parseFloat(costPerUnit) || 0,
        currentStock: mode === "create" ? (parseFloat(currentStock) || 0) : (initialValues?.currentStock ?? 0),
        minStockLevel: parseFloat(minStockLevel) || 0,
        supplierName: supplierName.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="ing-name">
          Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="ing-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="e.g. Olive Oil"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="ing-unit">
          Unit <span className="text-red-400">*</span>
        </Label>
        <Select
          value={unitSelect}
          onValueChange={(val) => {
            setUnitSelect(val);
            if (errors.unit) setErrors((prev) => ({ ...prev, unit: undefined }));
          }}
          options={UNIT_OPTIONS}
        />
        {unitSelect === "other" && (
          <Input
            className="mt-2"
            value={customUnit}
            onChange={(e) => {
              setCustomUnit(e.target.value);
              if (errors.unit) setErrors((prev) => ({ ...prev, unit: undefined }));
            }}
            placeholder="Enter custom unit"
          />
        )}
        {errors.unit && (
          <p className="mt-1 text-xs text-red-500">{errors.unit}</p>
        )}
      </div>

      <div>
        <Label htmlFor="ing-cost">
          Cost per Unit ($) <span className="text-red-400">*</span>
        </Label>
        <Input
          id="ing-cost"
          type="number"
          min={0}
          step={0.01}
          value={costPerUnit}
          onChange={(e) => {
            setCostPerUnit(e.target.value);
            if (errors.costPerUnit) setErrors((prev) => ({ ...prev, costPerUnit: undefined }));
          }}
          placeholder="0.00"
        />
        {errors.costPerUnit && (
          <p className="mt-1 text-xs text-red-500">{errors.costPerUnit}</p>
        )}
      </div>

      {mode === "create" && (
        <div>
          <Label htmlFor="ing-stock">
            Current Stock <span className="text-red-400">*</span>
          </Label>
          <Input
            id="ing-stock"
            type="number"
            min={0}
            step={0.001}
            value={currentStock}
            onChange={(e) => {
              setCurrentStock(e.target.value);
              if (errors.currentStock) setErrors((prev) => ({ ...prev, currentStock: undefined }));
            }}
            placeholder="0"
          />
          {errors.currentStock && (
            <p className="mt-1 text-xs text-red-500">{errors.currentStock}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="ing-min">
          Min Stock Level <span className="text-red-400">*</span>
        </Label>
        <Input
          id="ing-min"
          type="number"
          min={0}
          step={0.001}
          value={minStockLevel}
          onChange={(e) => {
            setMinStockLevel(e.target.value);
            if (errors.minStockLevel) setErrors((prev) => ({ ...prev, minStockLevel: undefined }));
          }}
          placeholder="0"
        />
        {errors.minStockLevel && (
          <p className="mt-1 text-xs text-red-500">{errors.minStockLevel}</p>
        )}
      </div>

      <div>
        <Label htmlFor="ing-supplier">Supplier Name (optional)</Label>
        <Input
          id="ing-supplier"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="e.g. Metro Cash & Carry"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Add Ingredient" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
