"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  PlusIcon as Plus, 
  ArchiveBoxIcon as Package2, 
  ArrowPathIcon as RefreshCw,
  Squares2X2Icon,
  ShoppingBagIcon,
  BanknotesIcon,
  CircleStackIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { mapProductRowToAdminProduct, seedProducts, mapProductToRecordInput, type AdminCatalogProduct, type ProductRecordInput, type ProductRow } from "@/lib/catalog";
import { DashboardStoreProvider } from "@/lib/dashboard-store";
import AdminHeader from "./AdminHeader";
import ProductList from "./ProductList";
import ProductEditor from "./ProductEditor";
import OverviewTab from "./OverviewTab";
import SalesTab from "./SalesTab";
import ExpensesTab from "./ExpensesTab";
import StockTab from "./StockTab";

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

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Defer rendering until client-side mount to prevent SSR hydration mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const editorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditorOpen && typeof window !== "undefined" && window.innerWidth < 1024) {
      const timer = setTimeout(() => {
        editorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditorOpen, selectedProduct]);

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

  // Navigation tabs definition
  const navItems = [
    { id: "overview", name: "Overview", icon: Squares2X2Icon },
    { id: "catalog", name: "Product Catalog", icon: Package2 },
    { id: "sales", name: "Sales Ledger", icon: ShoppingBagIcon },
    { id: "expenses", name: "Operating Expenses", icon: BanknotesIcon },
    { id: "stock", name: "Stock Manager", icon: CircleStackIcon },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-creme flex items-center justify-center">
        <div className="text-center font-serif text-olive/40 text-sm">
          Loading Nivati Business Panel...
        </div>
      </div>
    );
  }

  return (
    <DashboardStoreProvider catalogProducts={products}>
      <div className="min-h-screen bg-creme text-olive">
        {/* Mobile Nav Top Bar */}
        <div className="flex items-center justify-between border-b border-olive/10 bg-creme/90 px-4 py-4 backdrop-blur-md lg:hidden">
          <span className="font-serif text-lg font-bold uppercase tracking-wider">Nivati Business</span>
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="rounded-lg border border-olive/15 p-2 text-olive hover:bg-olive/5"
          >
            {isMobileSidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        <div className="mx-auto max-w-none px-4 py-6 md:px-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            
            {/* Sidebar Left */}
            <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-olive/10 bg-creme p-6 shadow-xl transition-transform duration-300 lg:static lg:z-0 lg:w-auto lg:border-r-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}>
              <div className="space-y-8">
                {/* Brand Logo inside sidebar */}
                <div className="hidden lg:block border-b border-olive/5 pb-4">
                  <span className="font-serif text-xl font-bold uppercase tracking-widest text-olive">NIVATI</span>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-olive/30 mt-0.5">Management Suite</p>
                </div>

                {/* Sidebar Navigation */}
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-3.5 rounded-xl px-4.5 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-olive text-creme shadow-lg shadow-olive/15"
                            : "text-olive/50 hover:bg-olive/5 hover:text-olive"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {item.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Sidebar Close Cover */}
              {isMobileSidebarOpen && (
                <div 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="fixed inset-0 -z-10 bg-black/10 lg:hidden"
                />
              )}
            </aside>

            {/* Main Content Area Right */}
            <div className="space-y-8 min-w-0">
              
              {/* Common Premium Header */}
              <AdminHeader email={adminEmail} onSignOut={handleSignOut} />

              {errorMessage && (
                <div className="rounded-xl border border-terracotta/20 bg-terracotta/5 px-6 py-4 text-sm text-olive/80">
                  <strong>System Notice:</strong> {errorMessage}
                </div>
              )}

              {/* Tab Router Switch */}
              <main className="transition-all duration-300">
                {activeTab === "overview" && (
                  <OverviewTab 
                    catalogProducts={products} 
                    setActiveTab={setActiveTab} 
                  />
                )}

                {activeTab === "catalog" && (
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
                          New Item
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

                    <div ref={editorSectionRef}>
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
                    </div>
                  </div>
                )}

                {activeTab === "sales" && (
                  <SalesTab catalogProducts={products} />
                )}

                {activeTab === "expenses" && (
                  <ExpensesTab />
                )}

                {activeTab === "stock" && (
                  <StockTab catalogProducts={products} />
                )}
              </main>

            </div>
          </div>
        </div>
      </div>
    </DashboardStoreProvider>
  );
}
