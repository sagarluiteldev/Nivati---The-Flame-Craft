"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Squares2X2Icon,
  CubeIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  CircleStackIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import ProductList from "@/components/admin/ProductList";
import ProductEditor from "@/components/admin/ProductEditor";
import OverviewTab from "@/components/admin/OverviewTab";
import SalesTab from "@/components/admin/SalesTab";
import ExpensesTab from "@/components/admin/ExpensesTab";
import StockTab from "@/components/admin/StockTab";
import RecycleBinDrawer from "@/components/admin/RecycleBinDrawer";

import { 
  type AdminCatalogProduct, 
  type ProductRecordInput, 
  type ProductRow, 
  seedProducts 
} from "@/lib/catalog";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DashboardStoreProvider, useDashboardStore } from "@/lib/dashboard-store";

interface Props {
  adminEmail: string;
  initialProducts: AdminCatalogProduct[];
  dataError?: string | null;
}

const DASHBOARD_FIELDS = "id, title, description, price, tag, size_tag, primary_image, gallery, categories, scent_top, scent_mid, scent_base, is_active, sort_order, created_at, updated_at";

function mapProductRowToAdminProduct(row: ProductRow): AdminCatalogProduct {
  const primaryCategory = row.categories?.[0] ?? "Signature Candles";
  const primaryImg = row.primary_image ?? "/images/IMG_4171.jpg";

  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    description: row.description,
    tag: row.tag ?? "",
    img: primaryImg,
    gallery: row.gallery && row.gallery.length > 0 ? row.gallery : [primaryImg],
    category: primaryCategory,
    categories: row.categories ?? [primaryCategory],
    sizeTag: row.size_tag ?? "col-span-1 row-span-1",
    scentNotes: {
      top: row.scent_top ?? "Unscented",
      mid: row.scent_mid ?? "Unscented",
      base: row.scent_base ?? "Unscented",
    },
    isActive: row.is_active ?? true,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

function mapProductToRecordInput(product: AdminCatalogProduct): ProductRecordInput {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    tag: product.tag ?? "",
    size_tag: product.sizeTag ?? "col-span-1 row-span-1",
    primary_image: product.img,
    gallery: product.gallery && product.gallery.length > 0 ? product.gallery : [product.img],
    categories: product.categories && product.categories.length > 0 ? product.categories : [product.category as string],
    scent_top: product.scentNotes?.top ?? "Unscented",
    scent_mid: product.scentNotes?.mid ?? "Unscented",
    scent_base: product.scentNotes?.base ?? "Unscented",
    is_active: product.isActive,
    sort_order: product.sortOrder ?? 0,
  };
}

function AdminDashboardInner({ adminEmail, initialProducts, dataError }: Props) {
  const router = useRouter();
  const { trashItems, moveToTrash } = useDashboardStore();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<AdminCatalogProduct | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(dataError ?? null);
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time filter dropdown
  const [timeRange, setTimeRange] = useState("This Month");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
      setErrorMessage("Failed to fetch products from Supabase database.");
      return;
    }

    setProducts((data || []).map((row) => mapProductRowToAdminProduct(row as ProductRow)));
    showToast("Catalog successfully refreshed from database");
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
          showToast(`Product "${formData.title}" updated successfully`);
        } else {
          // Create
          const { error } = await supabase
            .from("products")
            .insert([formData]);
          if (error) throw error;
          showToast(`Product "${formData.title}" created successfully`);
        }

        await refreshCatalog();
        setIsEditorOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product to database.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    const productToDelete = products.find((p) => p.id === id);
    if (!productToDelete) return;

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        
        // 1. Move to 30-Day Recycle Bin
        await moveToTrash(
          "product",
          id,
          productToDelete.title,
          mapProductToRecordInput(productToDelete),
          `${Array.isArray(productToDelete.category) ? productToDelete.category[0] : productToDelete.category || "Candles"} • Rs ${Number(productToDelete.price).toLocaleString()}`
        );

        // 2. Remove from active catalog
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        
        await refreshCatalog();
        showToast(`Moved "${productToDelete.title}" to Recycle Bin (Kept for 30 days)`);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product from database.");
      }
    });
  };

  const handleToggleActive = async (product: AdminCatalogProduct) => {
    const nextActive = !product.isActive;
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase
          .from("products")
          .update({ is_active: nextActive })
          .eq("id", product.id);
        if (error) throw error;
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: nextActive } : p))
        );
        showToast(`Product "${product.title}" is now ${nextActive ? "visible in store" : "hidden from store"}`);
      } catch (e) {
        console.error("Error toggling product status:", e);
        alert("Failed to update status in database.");
      }
    });
  };

  const handleSyncCatalog = async () => {
    if (!confirm("This will import seed products into your Supabase database. Existing products with matching IDs will be updated. Continue?")) return;

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const payload = seedProducts.map((p, index) => ({
          ...mapProductToRecordInput(p as any),
          sort_order: index,
        }));

        const { error } = await supabase.from("products").upsert(payload);
        if (error) throw error;

        await refreshCatalog();
        showToast(`Synced ${payload.length} products with Supabase database!`);
      } catch (error) {
        console.error("Error syncing catalog:", error);
        alert("Failed to sync catalog with database.");
      }
    });
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nivati_catalog_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Catalog JSON exported successfully");
  };

  // Navigation tabs definition
  const navItems = [
    { id: "overview", name: "Dashboard", icon: Squares2X2Icon },
    { id: "catalog", name: "Products", icon: CubeIcon },
    { id: "sales", name: "Sales Ledger", icon: ShoppingBagIcon },
    { id: "expenses", name: "Expenses", icon: BanknotesIcon },
    { id: "stock", name: "Stock Manager", icon: CircleStackIcon },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8faf8] text-[#222a1d] flex flex-col">
      
      {/* Full-width sticky / top navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#e3e8e2] bg-white/95 backdrop-blur-md px-3 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Original Nivati Logo + Brand Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img 
                src="/images/logo.png" 
                alt="Nivati Logo" 
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0" 
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#222a1d]">
                    NIVATI
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#283322]/10 text-[#283322]">
                    Admin
                  </span>
                </div>
                <p className="text-[9px] sm:text-xs text-[#222a1d]/45 font-medium tracking-wide">
                  The Flame Craft Studio
                </p>
              </div>
            </div>

            {/* Mobile Quick Actions (Bin & Sign-Out) */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                onClick={() => setIsRecycleBinOpen(true)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#dc2626] text-white shadow-sm hover:bg-[#b91c1c] transition-colors cursor-pointer"
                title="Recycle Bin"
              >
                <TrashIcon className="h-4 w-4 text-white" />
                {trashItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#283322] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {trashItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleSignOut}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#283322]/15 bg-white text-[#222a1d] hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center: Top Pill Navigation Bar (Scrollable on Mobile) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide py-1 px-1 bg-[#f1f4f1] rounded-full p-1 border border-[#e3e8e2] shadow-inner max-w-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#283322] text-white shadow-md shadow-[#283322]/15"
                      : "text-[#222a1d]/60 hover:text-[#222a1d] hover:bg-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${isActive ? "text-white" : "text-[#222a1d]/50"}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions (Recycle Bin, Date Selector, Export, Sync, Signout) */}
          <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2.5">
            
            {/* Recycle Bin Button with dark red badge & white SVG */}
            <button
              onClick={() => setIsRecycleBinOpen(true)}
              className="relative hidden sm:flex items-center gap-2 rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-2 pr-3.5 py-1.5 sm:py-2 text-xs font-semibold text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all cursor-pointer"
              title="30-Day Recycle Bin"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dc2626] text-white shadow-xs">
                <TrashIcon className="h-3 w-3 text-white" />
              </div>
              <span>Bin</span>
              {trashItems.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[10px] font-bold text-white shadow-xs">
                  {trashItems.length}
                </span>
              )}
            </button>

            {/* Date Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-[#222a1d] shadow-sm hover:border-[#283322]/30 transition-all cursor-pointer"
              >
                <span>{timeRange}</span>
                <ChevronDownIcon className="h-3.5 w-3.5 text-[#222a1d]/50" />
              </button>

              {isTimeDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsTimeDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 z-30 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-[#e3e8e2] text-xs">
                    {["This Week", "This Month", "This Quarter", "All Time"].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          setIsTimeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                          timeRange === range
                            ? "bg-[#283322] text-white"
                            : "text-[#222a1d]/70 hover:bg-[#f1f4f1] hover:text-[#222a1d]"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Export JSON */}
            <button
              onClick={handleExportData}
              className="hidden md:flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all cursor-pointer"
              title="Export Catalog Data as JSON"
            >
              <span>Export</span>
            </button>

            {/* Sync Seed Products */}
            <button
              onClick={handleSyncCatalog}
              disabled={isPending}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all cursor-pointer disabled:opacity-50"
              title="Sync Seed Catalog"
            >
              <ArrowPathIcon className={`h-3.5 w-3.5 text-[#222a1d]/60 ${isPending ? 'animate-spin' : ''}`} />
              <span>Seed</span>
            </button>

            {/* Desktop Sign-Out */}
            <button
              onClick={handleSignOut}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/60 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm cursor-pointer"
              title={`Sign Out (${adminEmail})`}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Screen fluid width */}
      <main className="flex-1 w-full max-w-full px-3 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-8">
        
        {/* System Notices / Messages */}
        {errorMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 sm:px-5 py-3.5 text-xs text-red-900 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-800">
                Database Notice
              </span>
              <span>{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-red-600 hover:text-red-900 cursor-pointer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#283322] px-5 py-3.5 text-xs font-semibold text-white shadow-2xl animate-fade-in">
            <CheckCircleIcon className="h-4 w-4 text-[#86efac]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB ROUTING */}
        {activeTab === "overview" && (
          <OverviewTab 
            catalogProducts={products} 
            setActiveTab={setActiveTab}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        )}

        {/* PRODUCTS CATALOG TAB - Mobile First & Responsive */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <ProductList
              products={filteredProducts}
              selectedId={selectedProduct?.id ?? null}
              onSelect={(p) => {
                setSelectedProduct(p);
                setIsEditorOpen(true);
              }}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onNewProduct={() => {
                setSelectedProduct(null);
                setIsEditorOpen(true);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* DEDICATED RESPONSIVE PRODUCT EDITOR MODAL / DRAWER */}
            {isEditorOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
                <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto scrollbar-hide my-auto">
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
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <SalesTab catalogProducts={products} />
        )}

        {activeTab === "expenses" && (
          <ExpensesTab />
        )}

        {activeTab === "stock" && (
          <StockTab />
        )}

        {/* 30-DAY RECYCLE BIN DRAWER */}
        <RecycleBinDrawer
          isOpen={isRecycleBinOpen}
          onClose={() => setIsRecycleBinOpen(false)}
          onProductRestored={refreshCatalog}
        />
      </main>

    </div>
  );
}

export default function AdminDashboard(props: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#283322] border-t-transparent mb-3" />
          <p className="font-serif text-[#283322]/60 text-sm tracking-wide">
            Loading Nivati Business Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardStoreProvider catalogProducts={props.initialProducts}>
      <AdminDashboardInner {...props} />
    </DashboardStoreProvider>
  );
}
