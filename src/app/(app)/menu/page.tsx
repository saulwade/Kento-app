"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Plus, ChefHat } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useRestaurant } from "@/lib/restaurantContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemForm } from "@/components/menu/MenuItemForm";
import { Toast, useToast } from "@/components/ui/Toast";

export default function MenuPage() {
  const { restaurantId } = useRestaurant();
  const router = useRouter();
  const menuItems = useQuery(api.menuItems.listMenuItems, { restaurantId });
  const createMenuItem = useMutation(api.menuItems.createMenuItem);
  const [addOpen, setAddOpen] = useState(false);

  const { toast, showToast, dismissToast } = useToast();

  return (
    <div>
      <PageHeader
        title="Menu & Recipes"
        subtitle="Manage dishes and recipe composition"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            Add Item
          </Button>
        }
      />

      {menuItems === undefined ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : menuItems.length === 0 ? (
        <EmptyState
          icon={<ChefHat />}
          title="No menu items yet"
          description="Add your first dish to start tracking recipes and food costs."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus size={16} className="mr-1.5" />
              Add Item
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onClick={() => router.push(`/menu/${item._id}`)}
            />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Menu Item">
        <MenuItemForm
          mode="create"
          onCancel={() => setAddOpen(false)}
          onSubmit={async (data) => {
            await createMenuItem({ restaurantId, ...data });
            setAddOpen(false);
            showToast("Menu item created");
          }}
        />
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}
