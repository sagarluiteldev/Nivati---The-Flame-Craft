import { useState } from "react";
import { ArrowPathIcon as LoaderCircle, CheckCircleIcon as Save, XMarkIcon as X, CheckIcon as Check } from "@heroicons/react/24/outline";
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
    <div className="flex flex-col gap-8 rounded-xl border border-olive/10 bg-creme/90 p-6 shadow-xl backdrop-blur-xl md:p-8">
      <div className="flex items-center justify-between border-b border-olive/5 pb-6">
        <div>
          <h2 className="text-2xl font-serif text-olive">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <p className="mt-1 text-sm text-olive/40">
            {product ? `Managing ${product.id}` : "Creating a fresh catalog entry"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/10 bg-creme text-olive/40 transition-colors hover:text-olive"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                Product Title
              </span>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  updateField("title", e.target.value);
                  if (!product) updateField("id", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                }}
                className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-olive outline-none transition-all focus:border-olive/30 focus:ring-1 focus:ring-olive/10"
                placeholder="e.g. Signature Lavender Candle"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                Product ID (Slug)
              </span>
              <input
                type="text"
                required
                disabled={!!product}
                value={formData.id}
                onChange={(e) => updateField("id", e.target.value)}
                className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-olive outline-none transition-all focus:border-olive/30 disabled:opacity-50 font-mono text-xs"
                placeholder="e.g. signature-lavender"
              />
            </label>

            <div className="grid grid-cols-2 gap-6">
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                  Price (Rs)
                </span>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-olive outline-none transition-all focus:border-olive/30"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                  Tag (Badge)
                </span>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => updateField("tag", e.target.value)}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-olive outline-none transition-all focus:border-olive/30"
                  placeholder="e.g. Best Seller"
                />
              </label>
            </div>

            <div>
              <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {KNOWN_CATEGORY_ORDER.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                      formData.categories?.includes(category)
                        ? "bg-olive text-creme shadow-sm"
                        : "border border-olive/10 bg-creme text-olive/60 hover:bg-olive/5"
                    }`}
                  >
                    {formData.categories?.includes(category) && <Check className="h-3 w-3" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                Description
              </span>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-olive outline-none transition-all focus:border-olive/30"
                placeholder="Tell the story of this product..."
              />
            </label>

            <div className="flex flex-col gap-4 p-4 rounded-lg bg-olive/5 border border-olive/10">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-olive/20 text-olive focus:ring-olive"
                />
                <span className="text-sm font-medium text-olive/70">
                  Active & Visible in Storefront
                </span>
              </label>
              
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
                  Sort Order
                </span>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => updateField("sort_order", Number(e.target.value))}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2 text-sm text-olive outline-none transition-all focus:border-olive/30"
                />
              </label>
            </div>
          </div>
        </div>

        <MediaManager
          primaryImage={formData.primary_image || ""}
          gallery={formData.gallery || []}
          onChange={(data) => {
            updateField("primary_image", data.primaryImage);
            updateField("gallery", data.gallery);
          }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
              Top Notes
            </span>
            <input
              type="text"
              value={formData.scent_top}
              onChange={(e) => updateField("scent_top", e.target.value)}
              className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-sm text-olive outline-none transition-all focus:border-olive/30"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
              Middle Notes
            </span>
            <input
              type="text"
              value={formData.scent_mid}
              onChange={(e) => updateField("scent_mid", e.target.value)}
              className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-sm text-olive outline-none transition-all focus:border-olive/30"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">
              Base Notes
            </span>
            <input
              type="text"
              value={formData.scent_base}
              onChange={(e) => updateField("scent_base", e.target.value)}
              className="w-full rounded-lg border border-olive/10 bg-creme px-5 py-3 text-sm text-olive outline-none transition-all focus:border-olive/30"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-olive/5 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-8 py-3 text-xs font-bold uppercase tracking-widest text-olive/40 transition-colors hover:text-olive hover:bg-olive/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-olive px-10 py-4 text-xs font-bold uppercase tracking-widest text-creme transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
