import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ClipboardList } from "lucide-react";

interface Props {
  rate: number;      // 0-100
  completed: number;
  total: number;
}

export function ChecklistComplianceWidget({ rate, completed, total }: Props) {
  const color = rate >= 80 ? "text-green-600" : rate >= 50 ? "text-amber-600" : "text-red-500";
  const barColor = rate >= 80 ? "bg-green-500" : rate >= 50 ? "bg-amber-400" : "bg-red-400";

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={18} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">Today&apos;s Compliance</h3>
      </div>
      <div className={`text-3xl font-bold mb-1 ${color}`}>{rate}%</div>
      <p className="text-xs text-gray-400 mb-4">{completed} of {total} checklists complete</p>
      <div className="h-2 bg-gray-200 rounded-full">
        <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${rate}%` }} />
      </div>
      <Link href="/staff" className="text-xs text-gray-500 hover:text-gray-700 mt-3 block">
        View staff operations →
      </Link>
    </Card>
  );
}
