"use client";

import { useState, useMemo } from "react";
import { 
  PencilIcon as Edit3, 
  ArchiveBoxIcon as Package2, 
  MagnifyingGlassIcon as Search, 
  TrashIcon as Trash2,
  CheckCircleIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  products: AdminCatalogProduct[];
  selectedId: string | null;
  onSelect: (product: AdminCatalogProduct) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductList({
  products,
  selectedId,
  onSelect,
  onDelete,
  searchQuery,
  onSearchChange,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Filter by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (Array.isArray(p.categories) && p.categories.includes(selectedCategory)) ||
        (Array.isArray(p.category) ? p.category.includes(selectedCategory) : p.category === selectedCategory);

      return matchesCategory;
    });
  }, [products, selectedCategory]);

  return (
    <aside className="flex flex-col gap-5 rounded-[26px] sm:rounded-[28px] bg-white p-5 sm:p-6 border border-[#e3e8e2] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#222a1d]">Catalog List</h2>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#222a1d]/40 mt-0.5">
            {filteredProducts.length} of {products.length} Products
          </p>
        </div>
        <div className="h-9 w-9 rounded-full bg-[#f1f4f1] flex items-center justify-center text-[#283322]">
          <Package2 className="h-4 w-4" />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/35 transition-colors group-focus-within:text-[#283322]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, scent, or slug..."
          className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2.5 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
        />
      </div>

      {/* Category Filter Pills (Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#283322] text-white shadow-sm"
                : "bg-[#f1f4f1] text-[#222a1d]/60 hover:bg-[#e8ede7] hover:text-[#222a1d]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Scrollable List */}
      <div className="space-y-2.5 overflow-y-auto pr-1 max-h-145 scrollbar-hide">
        {filteredProducts.map((product) => {
          const isSelected = selectedId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onSelect(product)}
              className={`group relative flex items-center gap-3.5 rounded-2xl border p-3 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[#283322] bg-[#283322] text-white shadow-md shadow-[#283322]/15"
                  : "border-[#eef2ee] bg-[#fcfdfc] hover:border-[#283322]/20 hover:bg-white hover:shadow-sm"
              }`}
            >
              {/* Product Thumbnail */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f1f4f1] border border-black/5 shadow-inner">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#283322]/20 text-xs font-serif">
                    🕯️
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute inset-0 bg-[#283322]/60 backdrop-blur-[1px] flex items-center justify-center">
                    <EyeSlashIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className={`truncate font-bold text-xs ${
                    isSelected ? "text-white" : "text-[#222a1d]"
                  }`}>
                    {product.title}
                  </h3>
                  {product.isActive ? (
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${isSelected ? "bg-[#86efac]" : "bg-emerald-500"}`} title="Active in Store" />
                  ) : (
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${isSelected ? "bg-white/20 text-white" : "bg-red-100 text-red-700"}`}>Hidden</span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-xs font-bold ${
                    isSelected ? "text-white" : "text-[#283322]"
                  }`}>
                    Rs {Number(product.price).toLocaleString()}
                  </span>
                  {product.tag && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#f1f4f1] text-[#222a1d]/60"
                    }`}>
                      {product.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(product);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected ? "hover:bg-white/20 text-white" : "hover:bg-[#f1f4f1] text-[#222a1d]/60"
                  }`}
                  title="Edit Product"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected ? "hover:bg-red-500/30 text-white" : "hover:bg-red-50 text-red-600"
                  }`}
                  title="Delete Product"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#222a1d]/40">
            <Package2 className="h-8 w-8 mb-2 text-[#222a1d]/20" />
            <p className="text-xs font-bold">No products match filters</p>
            <p className="text-[10px] mt-0.5">Try searching for a different keyword</p>
          </div>
        )}
      </div>

    </aside>
  );
}
