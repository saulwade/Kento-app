import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle } from "lucide-react";

interface Props {
  ingredients: Array<{
    _id: string;
    name: string;
    unit: string;
    currentStock: number;
    minStockLevel: number;
  }>;
}

export function LowStockAlert({ ingredients }: Props) {
  if (ingredients.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={18} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">Stock Alerts</h3>
        </div>
        <p className="text-sm text-green-600 font-medium">All ingredients are well stocked.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          <h3 className="text-sm font-semibold text-gray-700">Low Stock Alerts</h3>
        </div>
        <Badge variant="danger">{ingredients.length} item{ingredients.length > 1 ? "s" : ""}</Badge>
      </div>
      <div className="space-y-3">
        {ingredients.slice(0, 5).map((ing) => (
          <div key={ing._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-700">{ing.name}</p>
              <p className="text-xs text-gray-400">Min: {ing.minStockLevel} {ing.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-red-500">{ing.currentStock} {ing.unit}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href="/inventory" className="text-xs text-gray-500 hover:text-gray-700 mt-3 block">
        View all inventory →
      </Link>
    </Card>
  );
}
