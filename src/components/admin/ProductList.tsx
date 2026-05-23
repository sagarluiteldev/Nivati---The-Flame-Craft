"use client";

import { PencilIcon as Edit3, ArchiveBoxIcon as Package2, MagnifyingGlassIcon as Search, TrashIcon as Trash2 } from "@heroicons/react/24/outline";
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
  return (
    <aside className="flex flex-col gap-6 rounded-2xl border border-olive/10 bg-creme/40 p-6 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-serif text-olive tracking-tight">Catalog</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-olive/30 mt-0.5">
            {products.length} Products Available
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-olive/5 flex items-center justify-center">
          <Package2 className="h-4 w-4 text-olive/40" />
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-olive/30 transition-colors group-focus-within:text-olive/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search catalog..."
          className="w-full rounded-xl border border-olive/10 bg-creme/50 px-11 py-3 text-sm text-olive placeholder:text-olive/20 outline-none transition-all focus:border-olive/30 focus:bg-creme focus:ring-4 focus:ring-olive/5"
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden pr-2 max-h-[600px] scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className={`group relative flex items-center gap-4 rounded-xl border p-3.5 transition-all duration-300 overflow-hidden ${
              selectedId === product.id
                ? "border-olive bg-olive text-creme shadow-lg shadow-olive/20"
                : "border-olive/5 bg-creme/40 hover:border-olive/20 hover:bg-creme/60 hover:shadow-md"
            }`}
          >
            <div
              className="flex flex-1 items-center gap-4 cursor-pointer min-w-0"
              onClick={() => onSelect(product)}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-olive/5 shadow-inner">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-olive/10">
                    <Package2 className="h-6 w-6" />
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute inset-0 bg-olive/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-creme">Hidden</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className={`truncate font-serif text-[15px] leading-tight ${
                  selectedId === product.id ? "text-creme" : "text-olive"
                }`}>
                  {product.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className={`text-xs font-medium ${
                    selectedId === product.id ? "text-creme/70" : "text-olive/50"
                  }`}>
                    Rs {product.price.toLocaleString()}
                  </span>
                  {product.tag && (
                    <span className={`text-[8px] font-black uppercase tracking-[0.15em] ${
                      selectedId === product.id ? "text-creme/60" : "text-terracotta/60"
                    }`}>
                      • {product.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-1 transition-all duration-300 ${
              selectedId === product.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}>
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(product); }}
                className={`p-2 rounded-lg transition-colors ${
                  selectedId === product.id ? "hover:bg-creme/20" : "hover:bg-olive/5"
                }`}
                title="Edit Product"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                className={`p-2 rounded-lg transition-colors ${
                  selectedId === product.id ? "hover:bg-creme/20 text-creme" : "hover:bg-terracotta/10 text-terracotta"
                }`}
                title="Delete Product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-olive/5 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-olive/10" />
            </div>
            <h4 className="text-olive font-serif">No products found</h4>
            <p className="mt-1 text-sm text-olive/40 px-6">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
