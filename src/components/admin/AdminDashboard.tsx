"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon as Plus, ArchiveBoxIcon as Package2 } from "@heroicons/react/24/outline";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { mapProductRowToAdminProduct, seedProducts, mapProductToRecordInput, type AdminCatalogProduct, type ProductRecordInput, type ProductRow } from "@/lib/catalog";
import AdminHeader from "./AdminHeader";
import ProductList from "./ProductList";
import ProductEditor from "./ProductEditor";
import { ArrowPathIcon as RefreshCw } from "@heroicons/react/24/outline";

interface Props {
  adminEmail: string;
  initialProducts: AdminCatalogProduct[];
  dataError?: string | null;
}

const DASHBOARD_FIELDS = `
  id, title, description, price, tag, size_tag, 
  primary_image, gallery, categories, 
  scent_top, scent_mid, scent_base, 
  is_active, sort_order
`;

export default function AdminDashboard({ adminEmail, initialProducts, dataError }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<AdminCatalogProduct | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage] = useState<string | null>(dataError ?? null);
  const [isPending, startTransition] = useTransition();

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const refreshCatalog = async () => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("products")
      .select(DASHBOARD_FIELDS)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error refreshing catalog:", error);
      return;
    }

    setProducts((data || []).map((row) => mapProductRowToAdminProduct(row as ProductRow)));
  };

  const handleSave = async (formData: ProductRecordInput) => {
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        
        if (selectedProduct) {
          // Update
          const { error } = await supabase
            .from("products")
            .update(formData)
            .eq("id", selectedProduct.id);
          if (error) throw error;
        } else {
          // Create
          const { error } = await supabase
            .from("products")
            .insert([formData]);
          if (error) throw error;
        }

        await refreshCatalog();
        setIsEditorOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete ${id}?`)) return;

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        await refreshCatalog();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    });
  };

  const handleSyncCatalog = async () => {
    if (!confirm("This will import all local products into the database. Existing products with the same ID will be updated. Continue?")) return;

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const payload = seedProducts.map((p, index) => ({
          ...mapProductToRecordInput(p),
          sort_order: index,
        }));

        const { error } = await supabase.from("products").upsert(payload);
        if (error) throw error;

        await refreshCatalog();
        alert(`Successfully synced ${payload.length} products.`);
      } catch (error) {
        console.error("Error syncing catalog:", error);
        alert("Failed to sync catalog.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-creme px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminHeader email={adminEmail} onSignOut={handleSignOut} />

        {errorMessage && (
          <div className="rounded-xl border border-terracotta/20 bg-terracotta/5 px-6 py-4 text-sm text-olive/80">
            <strong>System Notice:</strong> {errorMessage}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsEditorOpen(true);
                }}
                className="flex items-center justify-center gap-3 rounded-lg bg-olive py-4 text-xs font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
              <button
                onClick={handleSyncCatalog}
                disabled={isPending}
                className="flex items-center justify-center gap-3 rounded-lg border border-olive/10 bg-creme py-4 text-xs font-bold uppercase tracking-widest text-olive transition-all hover:bg-olive hover:text-creme disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                Sync
              </button>
            </div>

            <ProductList
              products={filteredProducts}
              selectedId={selectedProduct?.id ?? null}
              onSelect={(p) => {
                setSelectedProduct(p);
                setIsEditorOpen(true);
              }}
              onDelete={handleDelete}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <main>
            {isEditorOpen ? (
              <ProductEditor
                key={selectedProduct?.id ?? "new"}
                product={selectedProduct}
                onSave={handleSave}
                onCancel={() => {
                  setIsEditorOpen(false);
                  setSelectedProduct(null);
                }}
                isSaving={isPending}
              />
            ) : (
              <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-dashed border-olive/10 bg-olive/5 text-center p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-creme text-olive shadow-sm">
                  <Package2 className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-serif text-olive">Select a Product</h3>
                <p className="mt-2 text-sm text-olive/40 max-w-xs">
                  Choose a product from the catalog to manage its details, inventory, and storefront presence.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
