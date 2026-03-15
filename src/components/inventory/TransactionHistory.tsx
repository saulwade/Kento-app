import type { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/Badge";

interface Transaction {
  _id: Id<"inventoryTransactions">;
  type: string;
  quantity: number;
  notes?: string;
  createdBy: string;
  createdAt: number;
}

interface Props {
  transactions: Transaction[];
  unit: string;
}

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

const typeBadgeVariant: Record<string, BadgeVariant> = {
  purchase: "info",
  usage: "neutral",
  waste: "warning",
  adjustment: "neutral",
};

const typeLabel: Record<string, string> = {
  purchase: "Purchase",
  usage: "Usage",
  waste: "Waste",
  adjustment: "Adjustment",
};

function formatQuantity(type: string, quantity: number): string {
  if (type === "purchase") return `+${quantity}`;
  if (type === "usage" || type === "waste") return `-${quantity}`;
  // adjustment: quantity is already signed
  return quantity >= 0 ? `+${quantity}` : `${quantity}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TransactionHistory({ transactions, unit }: Props) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">No transactions yet.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={typeBadgeVariant[tx.type] ?? "neutral"}>
                {typeLabel[tx.type] ?? tx.type}
              </Badge>
              <span className="text-sm font-semibold text-gray-800">
                {formatQuantity(tx.type, tx.quantity)} {unit}
              </span>
            </div>
            {tx.notes && (
              <p className="text-xs text-gray-500 mt-1 truncate">{tx.notes}</p>
            )}
          </div>
          <time className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
            {formatDate(tx.createdAt)}
          </time>
        </li>
      ))}
    </ul>
  );
}
