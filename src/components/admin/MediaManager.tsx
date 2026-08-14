"use client";

import { useState } from "react";
import { 
  PhotoIcon as ImagePlus, 
  ArrowPathIcon as LoaderCircle, 
  TrashIcon as Trash2,
  PlusIcon,
  LinkIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase/env";

interface Props {
  primaryImage: string;
  gallery: string[];
  onChange: (data: { primaryImage: string; gallery: string[] }) => void;
}

export default function MediaManager({ primaryImage, gallery, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .getPublicUrl(filePath);
        
        uploadedUrls.push(data.publicUrl);
      }

      const newGallery = [...gallery, ...uploadedUrls];
      onChange({
        primaryImage: primaryImage || uploadedUrls[0] || "",
        gallery: newGallery,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image to Supabase Storage.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const url = customUrl.trim();
    const newGallery = gallery.includes(url) ? gallery : [...gallery, url];
    onChange({
      primaryImage: primaryImage || url,
      gallery: newGallery,
    });
    setCustomUrl("");
    setIsUrlModalOpen(false);
  };

  const removeImage = (url: string) => {
    const newGallery = gallery.filter((item) => item !== url);
    onChange({
      primaryImage: primaryImage === url ? newGallery[0] || "" : primaryImage,
      gallery: newGallery,
    });
  };

  const setAsPrimary = (url: string) => {
    onChange({ primaryImage: url, gallery });
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-serif font-bold text-[#222a1d]">
            Product Imagery & Media
          </h3>
          <p className="text-xs text-[#222a1d]/45">
            Primary display photo & high-res storefront gallery
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Add URL Button */}
          <button
            type="button"
            onClick={() => setIsUrlModalOpen(!isUrlModalOpen)}
            className="flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-1.5 text-xs font-semibold text-[#222a1d] hover:bg-[#f1f4f1] transition-all cursor-pointer"
          >
            <LinkIcon className="h-3.5 w-3.5 text-[#222a1d]/60" />
            <span>Add URL</span>
          </button>

          {/* Upload Storage Button */}
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#283322] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#34422c] shadow-sm transition-all">
            {isUploading ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            <span>Upload File</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* URL Input Dropdown */}
      {isUrlModalOpen && (
        <form onSubmit={handleAddUrl} className="flex gap-2 p-3 bg-[#f8faf8] rounded-2xl border border-[#e3e8e2] animate-fade-in">
          <input
            type="url"
            required
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste image URL (e.g. /images/... or https://...)"
            className="flex-1 rounded-xl border border-[#e3e8e2] bg-white px-3 py-1.5 text-xs text-[#222a1d] outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#283322] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#34422c] cursor-pointer"
          >
            Add Image
          </button>
        </form>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {gallery.map((url) => {
          const isPrimary = primaryImage === url;

          return (
            <div
              key={url}
              className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                isPrimary ? "border-[#283322] shadow-md shadow-[#283322]/15" : "border-[#e8ede7]"
              }`}
            >
              <img
                src={url}
                alt="Product"
                className="h-full w-full object-cover"
              />
              
              {/* Action Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#283322]/60 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                {!isPrimary && (
                  <button
                    type="button"
                    onClick={() => setAsPrimary(url)}
                    className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#283322] hover:bg-[#f1f4f1] transition-all cursor-pointer"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700 shadow-sm transition-all cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {isPrimary && (
                <div className="absolute left-2 top-2 rounded-full bg-[#283322] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                  <CheckCircleIcon className="h-3 w-3 text-[#86efac]" />
                  <span>Primary</span>
                </div>
              )}
            </div>
          );
        })}

        {gallery.length === 0 && !isUploading && (
          <div className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d4ded3] bg-[#f8faf8] text-[#222a1d]/30 text-center p-3">
            <ImagePlus className="h-6 w-6 mb-1" />
            <span className="text-[10px] font-medium">No images uploaded</span>
          </div>
        )}
      </div>

    </div>
  );
}
