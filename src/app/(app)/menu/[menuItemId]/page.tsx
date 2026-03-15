"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { ArrowLeft, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { useRestaurant } from "@/lib/restaurantContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { MenuItemForm } from "@/components/menu/MenuItemForm";
import { RecipeEditor } from "@/components/menu/RecipeEditor";
import { formatCurrency } from "@/lib/utils";

export default function MenuItemDetailPage() {
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const { restaurantId } = useRestaurant();
  const router = useRouter();

  const menuItems = useQuery(api.menuItems.listMenuItems, { restaurantId });
  const updateMenuItem = useMutation(api.menuItems.updateMenuItem);
  const deleteMenuItem = useMutation(api.menuItems.deleteMenuItem);
  const recordSale = useMutation(api.inventoryTransactions.recordSale);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [recordSaleOpen, setRecordSaleOpen] = useState(false);
  const [unitsSold, setUnitsSold] = useState(1);
  const [recording, setRecording] = useState(false);

  if (menuItems === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const item = menuItems.find((m) => m._id === (menuItemId as Id<"menuItems">));

  if (!item) {
    return (
      <div className="text-center py-16 text-sm text-gray-400">
        Menu item not found.
      </div>
    );
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMenuItem({ id: item!._id });
      router.push("/menu");
    } finally {
      setDeleting(false);
    }
  }

  async function handleRecordSale() {
    setRecording(true);
    try {
      await recordSale({ restaurantId, menuItemId: item!._id, unitsSold });
      setRecordSaleOpen(false);
      setUnitsSold(1);
    } finally {
      setRecording(false);
    }
  }

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => router.push("/menu")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Menu
      </button>

      <PageHeader
        title={item.name}
        subtitle={item.category}
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setRecordSaleOpen(true)}>
              <ShoppingCart size={14} className="mr-1.5" />
              Record Sale
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil size={14} className="mr-1.5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeleteConfirm(true)}
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete
            </Button>
          </div>
        }
      />

      {/* Item details summary card */}
      <Card padding="sm" className="mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">Category</span>
            <p className="font-medium text-gray-800 mt-0.5">{item.category}</p>
          </div>
          <div>
            <span className="text-gray-500">Selling Price</span>
            <p className="font-medium text-gray-800 mt-0.5">{formatCurrency(item.sellingPrice)}</p>
          </div>
          <div>
            <span className="text-gray-500">Status</span>
            <div className="mt-0.5">
              <Badge variant={item.isActive ? "success" : "neutral"}>
                {item.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Recipe editor */}
      <RecipeEditor
        menuItemId={item._id}
        restaurantId={restaurantId}
        menuItemName={item.name}
        sellingPrice={item.sellingPrice}
      />

      {/* Record Sale modal */}
      <Modal
        open={recordSaleOpen}
        onClose={() => {
          setRecordSaleOpen(false);
          setUnitsSold(1);
        }}
        title="Record Sale"
        description={`How many portions of "${item.name}" were sold?`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setRecordSaleOpen(false);
                setUnitsSold(1);
              }}
              disabled={recording}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordSale} disabled={recording || unitsSold < 1}>
              {recording ? "Recording..." : "Record Sale"}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Units Sold
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={unitsSold}
            onChange={(e) => setUnitsSold(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Menu Item">
        <MenuItemForm
          mode="edit"
          initialValues={{ name: item.name, category: item.category, sellingPrice: item.sellingPrice }}
          onCancel={() => setEditOpen(false)}
          onSubmit={async (data) => {
            await updateMenuItem({ id: item._id, ...data });
            setEditOpen(false);
          }}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <span />
      </Modal>
    </div>
  );
}
