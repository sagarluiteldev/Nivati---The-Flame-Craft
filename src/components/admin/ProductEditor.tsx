"use client";

import { useState } from "react";
import { 
  ArrowPathIcon as LoaderCircle, 
  CheckCircleIcon as Save, 
  XMarkIcon as X, 
  CheckIcon as Check,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
  TagIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { type AdminCatalogProduct, type ProductRecordInput, KNOWN_CATEGORY_ORDER } from "@/lib/catalog";
import MediaManager from "@/components/admin/MediaManager";

interface Props {
  product: AdminCatalogProduct | null;
  onSave: (data: ProductRecordInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ProductEditor({ product, onSave, onCancel, isSaving }: Props) {
  const [formData, setFormData] = useState<Partial<ProductRecordInput>>(() => {
    if (product) {
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        tag: product.tag,
        size_tag: product.sizeTag,
        primary_image: product.img,
        gallery: product.gallery,
        categories: product.categories,
        scent_top: product.scentNotes.top,
        scent_mid: product.scentNotes.mid,
        scent_base: product.scentNotes.base,
        is_active: product.isActive,
        sort_order: product.sortOrder,
      };
    }
    return {
      id: "",
      title: "",
      description: "",
      price: 0,
      tag: "",
      size_tag: "col-span-1 row-span-1",
      primary_image: "",
      gallery: [],
      categories: ["Signature Candles"],
      scent_top: "Unscented",
      scent_mid: "Unscented",
      scent_base: "Unscented",
      is_active: true,
      sort_order: 0,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id) {
      alert("Title and Product ID/Slug are required.");
      return;
    }
    if (!formData.categories || formData.categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    await onSave(formData as ProductRecordInput);
  };

  const updateField = <K extends keyof ProductRecordInput>(
    key: K,
    value: ProductRecordInput[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) => {
    const current = formData.categories || [];
    const next = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    updateField("categories", next);
  };

  return (
    <div className="w-full max-w-full rounded-3xl bg-white p-4 sm:p-7 md:p-8 border border-[#e3e8e2] shadow-xl overflow-hidden">
      
      {/* Sticky / Top Header */}
      <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4 sm:pb-5">
        <div className="min-w-0 flex-1 pr-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#283322]/10 text-[#283322]">
              {product ? "Edit Product" : "New Creation"}
            </span>
            {product && (
              <span className="text-[10px] font-mono text-[#222a1d]/40 truncate">
                ID: {product.id}
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#222a1d] mt-1 truncate">
            {product ? product.title : "Create New Product"}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/60 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
            title="Close / Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-6 sm:space-y-8">
        
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#222a1d] flex items-center gap-1.5">
            <TagIcon className="h-4 w-4 text-[#283322]" />
            <span>Essential Details</span>
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Product Title *
              </span>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  updateField("title", e.target.value);
                  if (!product) {
                    updateField("id", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }
                }}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-3 text-sm text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Amber Moss Concrete Candle"
              />
            </label>

            {/* ID / Slug */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Catalog ID / Slug *
              </span>
              <input
                type="text"
                required
                disabled={!!product}
                value={formData.id}
                onChange={(e) => updateField("id", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs sm:text-sm font-mono text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white disabled:opacity-60"
                placeholder="e.g. amber-moss-concrete"
              />
            </label>

            {/* Price */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Retail Price (Rs) *
              </span>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs sm:text-sm font-mono font-bold text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
              />
            </label>

            {/* Tag / Badge */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Highlight Badge (Optional)
              </span>
              <input
                type="text"
                value={formData.tag || ""}
                onChange={(e) => updateField("tag", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs sm:text-sm text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Best Seller, Limited Edition, New"
              />
            </label>

            {/* Sort Order */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Storefront Display Priority (Sort Order)
              </span>
              <input
                type="number"
                value={formData.sort_order || 0}
                onChange={(e) => updateField("sort_order", Number(e.target.value))}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs sm:text-sm font-mono text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
              />
            </label>
          </div>

          {/* Categories Multi-Select Chips */}
          <div className="pt-2">
            <span className="mb-2 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
              Categories (Tap to toggle) *
            </span>
            <div className="flex flex-wrap gap-1.5">
              {KNOWN_CATEGORY_ORDER.map((category) => {
                const isChecked = formData.categories?.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isChecked
                        ? "bg-[#283322] text-white shadow-sm"
                        : "border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/70 hover:bg-[#e8ede7]"
                    }`}
                  >
                    {isChecked ? (
                      <Check className="h-3.5 w-3.5 text-[#86efac]" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#222a1d]/30" />
                    )}
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <label className="block pt-2">
            <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
              Product Story & Olfactory Description
            </span>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] p-3.5 text-xs sm:text-sm text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
              placeholder="Describe olfactory character, wax blend composition, vessel styling, and burn duration..."
            />
          </label>
        </div>

        {/* SECTION 2: STOREFRONT VISIBILITY TOGGLE */}
        <div className="rounded-2xl bg-[#f8faf8] p-4 border border-[#e8ede7]">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                formData.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
              }`}>
                {formData.is_active ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#222a1d]">
                  {formData.is_active ? "Published on Storefront" : "Hidden / Draft Mode"}
                </p>
                <p className="text-[11px] text-[#222a1d]/50">
                  {formData.is_active ? "Customers can view and buy this product online" : "Hidden from customer catalog and shop pages"}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
              className="h-5 w-5 rounded-md border-[#d4ded3] text-[#283322] focus:ring-[#283322] cursor-pointer"
            />
          </label>
        </div>

        {/* SECTION 3: MEDIA & PHOTOGRAPHY */}
        <div className="border-t border-[#eef2ee] pt-6">
          <MediaManager
            primaryImage={formData.primary_image || ""}
            gallery={formData.gallery || []}
            onChange={(data) => {
              updateField("primary_image", data.primaryImage);
              updateField("gallery", data.gallery);
            }}
          />
        </div>

        {/* SECTION 4: SCENT PYRAMID */}
        <div className="border-t border-[#eef2ee] pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-[#283322]" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#222a1d]">
              Olfactory Scent Pyramid
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/50">
                Top Notes
              </span>
              <input
                type="text"
                value={formData.scent_top || ""}
                onChange={(e) => updateField("scent_top", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Bergamot, Citrus"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/50">
                Middle Notes
              </span>
              <input
                type="text"
                value={formData.scent_mid || ""}
                onChange={(e) => updateField("scent_mid", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Lavender, Sage"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/50">
                Base Notes
              </span>
              <input
                type="text"
                value={formData.scent_base || ""}
                onChange={(e) => updateField("scent_base", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Amber, Sandalwood"
              />
            </label>
          </div>
        </div>

        {/* SECTION 5: ACTION BUTTONS (Sticky/Prominent on Mobile) */}
        <div className="flex items-center justify-end gap-3 border-t border-[#eef2ee] pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-initial rounded-full px-6 py-3 text-xs font-semibold text-[#222a1d]/70 hover:bg-[#f1f4f1] hover:text-[#222a1d] transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-[#283322] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{product ? "Save Changes" : "Publish Product"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
