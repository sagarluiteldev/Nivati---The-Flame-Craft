"use client";

import { useState, useMemo } from "react";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  SparklesIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  products: AdminCatalogProduct[];
  selectedId: string | null;
  onSelect: (product: AdminCatalogProduct) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (product: AdminCatalogProduct) => void;
  onNewProduct: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductList({
  products,
  selectedId,
  onSelect,
  onDelete,
  onToggleActive,
  onNewProduct,
  searchQuery,
  onSearchChange,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract all categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (Array.isArray(p.categories)) {
        p.categories.forEach((c) => set.add(c));
      } else if (p.category) {
        if (Array.isArray(p.category)) p.category.forEach((c) => set.add(c));
        else set.add(p.category);
      }
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filter by category, search query, and active status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (Array.isArray(p.categories) && p.categories.includes(selectedCategory)) ||
        (Array.isArray(p.category) ? p.category.includes(selectedCategory) : p.category === selectedCategory);

      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.scentNotes?.top && p.scentNotes.top.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.scentNotes?.mid && p.scentNotes.mid.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.scentNotes?.base && p.scentNotes.base.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && p.isActive) ||
        (statusFilter === "hidden" && !p.isActive);

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [products, selectedCategory, searchQuery, statusFilter]);

  const activeCount = products.filter((p) => p.isActive).length;
  const hiddenCount = products.length - activeCount;

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      
      {/* 1. TOP MOBILE-OPTIMIZED CONTROL BAR */}
      <div className="flex flex-col gap-3.5 bg-white p-4 sm:p-5 rounded-3xl border border-[#e3e8e2] shadow-sm">
        
        {/* Top line: Header & Counts & Mobile CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#222a1d]">
              Product Catalog
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="px-2.5 py-0.5 rounded-full bg-[#283322]/10 text-[#283322]">
                {products.length} Total
              </span>
              <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px]">
                {activeCount} Active
              </span>
              {hiddenCount > 0 && (
                <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px]">
                  {hiddenCount} Hidden
                </span>
              )}
            </div>
          </div>

          {/* Desktop/Tablet View Switcher & Quick Add Button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-[#f1f4f1] p-1 rounded-full border border-[#e3e8e2]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === "grid" ? "bg-white text-[#283322] shadow-sm" : "text-[#222a1d]/50 hover:text-[#222a1d]"
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === "list" ? "bg-white text-[#283322] shadow-sm" : "text-[#222a1d]/50 hover:text-[#222a1d]"
                }`}
                title="List View"
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onNewProduct}
              className="flex items-center gap-1.5 rounded-full bg-[#283322] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Search & Status Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/35" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products by title, scent notes, tag, ID..."
              className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none focus:border-[#283322]/40 focus:bg-white transition-all"
            />
          </div>

          {/* Visibility Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "hidden")}
            className="rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
          >
            <option value="all">All Storefront Statuses</option>
            <option value="active">Active on Storefront ({activeCount})</option>
            <option value="hidden">Hidden / Drafts ({hiddenCount})</option>
          </select>
        </div>

        {/* Category Filter Chips (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#283322] text-white shadow-sm"
                    : "bg-[#f1f4f1] text-[#222a1d]/70 hover:bg-[#e8ede7] hover:text-[#222a1d]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PRODUCTS GRID / LIST (Mobile-First Card Layout) */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => {
            const isSelected = selectedId === product.id;
            const categoryStr = Array.isArray(product.categories) && product.categories.length > 0
              ? product.categories[0]
              : (Array.isArray(product.category) ? product.category[0] : product.category || "Candles");

            return (
              <div
                key={product.id}
                onClick={() => onSelect(product)}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white p-4 border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#283322] ring-2 ring-[#283322]/20 shadow-lg"
                    : "border-[#e3e8e2] shadow-sm hover:border-[#283322]/30 hover:shadow-md"
                }`}
              >
                {/* Top Media & Status Header */}
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f1f4f1] border border-[#e8ede7] mb-3.5">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-[#283322]/25">
                        <PhotoIcon className="h-10 w-10 mb-1" />
                        <span className="text-[10px] font-medium">No Image</span>
                      </div>
                    )}

                    {/* Storefront Active / Hidden Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
                        product.isActive
                          ? "bg-white/95 text-emerald-800 border border-emerald-200"
                          : "bg-red-50/95 text-red-700 border border-red-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${product.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>

                    {/* Badge / Tag (e.g. Best Seller) */}
                    {product.tag && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#283322] text-white shadow-sm">
                          {product.tag}
                        </span>
                      </div>
                    )}

                    {/* Gallery Count */}
                    {product.gallery && product.gallery.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                          +{product.gallery.length - 1} photos
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#222a1d]/50 bg-[#f1f4f1] px-2 py-0.5 rounded-full">
                      {categoryStr}
                    </span>
                    <span className="text-[10px] font-mono text-[#222a1d]/40">
                      ID: {product.id}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#222a1d] line-clamp-1 group-hover:text-[#283322]">
                    {product.title}
                  </h3>

                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-[#283322]">
                      Rs {Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#222a1d]/45">
                      Order #{product.sortOrder || 0}
                    </span>
                  </div>

                  {/* Scent Pyramid Notes Chips */}
                  {(product.scentNotes?.top !== "Unscented" || product.scentNotes?.mid !== "Unscented") && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#f0f4ef] flex items-center gap-1.5 text-[10px] text-[#222a1d]/65 truncate">
                      <SparklesIcon className="h-3 w-3 shrink-0 text-[#283322]" />
                      <span className="truncate">
                        {[product.scentNotes.top, product.scentNotes.mid, product.scentNotes.base].filter(Boolean).filter(s => s !== "Unscented").join(" • ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#eef2ee] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Quick Toggle Storefront Visibility */}
                  {onToggleActive && (
                    <button
                      type="button"
                      onClick={() => onToggleActive(product)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                        product.isActive
                          ? "bg-[#f1f4f1] text-[#222a1d]/70 hover:bg-red-50 hover:text-red-700"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                      title={product.isActive ? "Hide from Storefront" : "Publish to Storefront"}
                    >
                      {product.isActive ? (
                        <>
                          <EyeSlashIcon className="h-3.5 w-3.5" />
                          <span className="hidden xs:inline">Hide</span>
                        </>
                      ) : (
                        <>
                          <EyeIcon className="h-3.5 w-3.5" />
                          <span className="hidden xs:inline">Publish</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => onSelect(product)}
                      className="flex items-center gap-1 rounded-full bg-[#283322] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#34422c] transition-colors cursor-pointer"
                    >
                      <PencilSquareIcon className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-3xl bg-white p-4 sm:p-6 border border-[#e3e8e2] shadow-sm divide-y divide-[#f2f6f1]">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelect(product)}
              className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#f8faf8] -mx-4 px-4 rounded-2xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f1f4f1] border border-[#e8ede7]">
                  {product.img ? (
                    <img src={product.img} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#283322]/30 text-xs">🕯️</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#222a1d]">{product.title}</h3>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      product.isActive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                    }`}>
                      {product.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#222a1d]/50 font-mono mt-0.5">
                    {product.id} • {Array.isArray(product.categories) ? product.categories.join(", ") : product.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                <span className="font-mono font-bold text-base text-[#283322]">
                  Rs {Number(product.price).toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelect(product)}
                    className="rounded-full bg-[#283322] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#34422c] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1.5 rounded-full hover:bg-red-50 text-red-600 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-white border border-dashed border-[#d5ded4]">
          <div className="h-16 w-16 rounded-full bg-[#f1f4f1] flex items-center justify-center text-[#283322] mb-3">
            <MagnifyingGlassIcon className="h-7 w-7 text-[#283322]/40" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#222a1d]">No Products Found</h3>
          <p className="text-xs text-[#222a1d]/50 max-w-sm mt-1">
            No products match &quot;{searchQuery}&quot; under the selected &quot;{selectedCategory}&quot; category filter.
          </p>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedCategory("All");
              setStatusFilter("all");
            }}
            className="mt-4 rounded-full bg-[#283322] px-5 py-2 text-xs font-bold text-white hover:bg-[#34422c] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
