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
  ArrowRightOnRectangleIcon as LogOut,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { 
  mapProductRowToAdminProduct, 
  seedProducts, 
  mapProductToRecordInput, 
  type AdminCatalogProduct, 
  type ProductRecordInput, 
  type ProductRow 
} from "@/lib/catalog";
import { DashboardStoreProvider } from "@/lib/dashboard-store";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(dataError ?? null);
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time filter dropdown
  const [timeRange, setTimeRange] = useState("This Month");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

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
    if (!confirm(`Are you sure you want to delete product "${id}" from database?`)) return;

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        await refreshCatalog();
        showToast(`Product "${id}" deleted from database`);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product from database.");
      }
    });
  };

  const handleSyncCatalog = async () => {
    if (!confirm("This will import seed products into your Supabase database. Existing products with matching IDs will be updated. Continue?")) return;

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
    { id: "catalog", name: "Products", icon: Package2 },
    { id: "sales", name: "Sales Ledger", icon: ShoppingBagIcon },
    { id: "expenses", name: "Expenses", icon: BanknotesIcon },
    { id: "stock", name: "Stock Manager", icon: CircleStackIcon },
  ];

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
    <DashboardStoreProvider catalogProducts={products}>
      {/* Full screen edge-to-edge container */}
      <div className="min-h-screen w-full bg-[#f8faf8] text-[#222a1d] flex flex-col">
        
        {/* Full-width sticky / top navbar */}
        <header className="sticky top-0 z-30 w-full border-b border-[#e3e8e2] bg-white/95 backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-10 py-3.5 sm:py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Left: Original Nivati Logo + Brand Identity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/logo.png" 
                  alt="Nivati Logo" 
                  className="h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#222a1d]">
                      NIVATI
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#283322]/10 text-[#283322]">
                      Admin
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#222a1d]/45 font-medium tracking-wide">
                    The Flame Craft Studio
                  </p>
                </div>
              </div>

              {/* Mobile Quick Sign-Out */}
              <button
                onClick={handleSignOut}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[#283322]/15 bg-white text-[#283322] hover:bg-[#283322] hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Center: Top Pill Navigation Bar */}
            <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide py-1 px-1 bg-[#f1f4f1] rounded-full p-1.5 border border-[#e3e8e2] shadow-inner max-w-full">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#283322] text-white shadow-md shadow-[#283322]/15"
                        : "text-[#222a1d]/60 hover:text-[#222a1d] hover:bg-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-[#222a1d]/50"}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions (Date Selector, Export, Sync, Signout - Without user avatar) */}
            <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2.5">
              {/* Date Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3.5 sm:px-4 py-2 text-xs font-semibold text-[#222a1d] shadow-sm hover:border-[#283322]/30 transition-all cursor-pointer"
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
                    <div className="absolute right-0 mt-2 z-30 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-[#e3e8e2] text-xs">
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

              {/* Export Button */}
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3.5 sm:px-4 py-2 text-xs font-semibold text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all cursor-pointer"
                title="Export Data"
              >
                <ArrowUpTrayIcon className="h-3.5 w-3.5 text-[#222a1d]/60" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Desktop Sign-Out */}
              <button
                onClick={handleSignOut}
                className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/60 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm cursor-pointer"
                title={`Sign Out (${adminEmail})`}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area - Full Screen fluid width */}
        <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8">
          
          {/* System Notices / Messages */}
          {errorMessage && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-xs text-red-900 shadow-sm">
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
            />
          )}

          {activeTab === "catalog" && (
            <div className="space-y-6">
              {/* Catalog Action Subheader */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#e3e8e2] shadow-sm">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#222a1d]">Product Catalog</h2>
                  <p className="text-xs text-[#222a1d]/50 mt-0.5">
                    Manage candle collections, pricing, scents, and storefront visibility in Supabase
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsEditorOpen(true);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-[#283322] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Product</span>
                  </button>
                  <button
                    onClick={handleSyncCatalog}
                    disabled={isPending}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full border border-[#e3e8e2] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                    <span>Sync Seed</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
                <div className="space-y-6">
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
                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#d5ded4] bg-white/60 p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f4f1] text-[#283322] shadow-sm mb-4">
                        <Package2 className="h-7 w-7 text-[#283322]" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#222a1d]">Select a Product</h3>
                      <p className="mt-2 text-xs text-[#222a1d]/50 max-w-sm leading-relaxed">
                        Choose a product from the left catalog to edit its images, olfactory notes, pricing, tags, or create a brand new candle product.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setIsEditorOpen(true);
                        }}
                        className="mt-6 flex items-center gap-2 rounded-full bg-[#283322] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create New Item</span>
                      </button>
                    </div>
                  )}
                </div>
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
    </DashboardStoreProvider>
  );
}
