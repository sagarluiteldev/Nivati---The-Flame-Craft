"use client";

import { useState } from "react";
import { 
  ArrowPathIcon as LoaderCircle, 
  CheckCircleIcon as Save, 
  XMarkIcon as X, 
  CheckIcon as Check,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon
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
      categories: [],
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
      alert("Title and ID are required.");
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
    <div className="flex flex-col gap-6 sm:gap-8 rounded-[26px] sm:rounded-[28px] bg-white p-5 sm:p-7 md:p-8 border border-[#e3e8e2] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eef2ee] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#283322]/10 text-[#283322]">
            {product ? "Edit Mode" : "New Creation"}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#222a1d] mt-1.5">
            {product ? product.title : "Create New Product"}
          </h2>
          <p className="text-xs text-[#222a1d]/45">
            {product ? `Managing record ${product.id}` : "Configure product details and publish directly to Supabase catalog"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Left Inputs */}
          <div className="space-y-4">
            <label className="block">
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
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Amber Moss Concrete Candle"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Product ID / Slug *
              </span>
              <input
                type="text"
                required
                disabled={!!product}
                value={formData.id}
                onChange={(e) => updateField("id", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white disabled:opacity-50"
                placeholder="e.g. amber-moss-concrete"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                  Price (Rs) *
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                  Badge / Tag
                </span>
                <input
                  type="text"
                  value={formData.tag || ""}
                  onChange={(e) => updateField("tag", e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
                  placeholder="e.g. Best Seller"
                />
              </label>
            </div>

            {/* Category Select Chips */}
            <div>
              <span className="mb-2 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Categories (Select all that apply) *
              </span>
              <div className="flex flex-wrap gap-1.5">
                {KNOWN_CATEGORY_ORDER.map((category) => {
                  const isChecked = formData.categories?.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        isChecked
                          ? "bg-[#283322] text-white shadow-sm"
                          : "border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/60 hover:bg-[#e8ede7]"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                      <span>{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Inputs */}
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#222a1d]/70 uppercase tracking-wider text-[10px]">
                Product Story & Description
              </span>
              <textarea
                rows={4}
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
                placeholder="Describe olfactory profile, vessel crafting, and burn time..."
              />
            </label>

            <div className="rounded-2xl bg-[#f8faf8] p-4 border border-[#e8ede7] space-y-3">
              {/* Storefront Active Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  {formData.is_active ? (
                    <EyeIcon className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs font-bold text-[#222a1d]">
                    Visible on Storefront
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-[#d4ded3] text-[#283322] focus:ring-[#283322] cursor-pointer"
                />
              </label>

              {/* Sort Order */}
              <div className="flex items-center justify-between pt-2 border-t border-[#e8ede7]">
                <span className="text-[11px] font-medium text-[#222a1d]/60">
                  Storefront Display Priority (Sort Order)
                </span>
                <input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => updateField("sort_order", Number(e.target.value))}
                  className="w-20 rounded-xl border border-[#e3e8e2] bg-white px-2.5 py-1 text-xs text-center font-mono font-bold text-[#222a1d] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Manager Component */}
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

        {/* Scent Pyramid Section */}
        <div className="border-t border-[#eef2ee] pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-[#283322]" />
            <h3 className="text-sm font-serif font-bold text-[#222a1d]">
              Olfactory Scent Pyramid
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/50">
                Top Notes
              </span>
              <input
                type="text"
                value={formData.scent_top || ""}
                onChange={(e) => updateField("scent_top", e.target.value)}
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Bergamot, French Lavender"
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
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Sage, Clary blossom"
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
                className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                placeholder="e.g. Cedarwood, Amber, Vanilla"
              />
            </label>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-[#eef2ee] pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-6 py-2.5 text-xs font-semibold text-[#222a1d]/60 hover:bg-[#f1f4f1] hover:text-[#222a1d] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-full bg-[#283322] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{product ? "Update Database" : "Publish Product"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
