"use client";

import { useState } from "react";
import { PhotoIcon as ImagePlus, ArrowPathIcon as LoaderCircle, TrashIcon as Trash2 } from "@heroicons/react/24/outline";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase/env";

interface Props {
  primaryImage: string;
  gallery: string[];
  onChange: (data: { primaryImage: string; gallery: string[] }) => void;
}

export default function MediaManager({ primaryImage, gallery, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
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
      alert("Failed to upload image. Please check your storage settings.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-widest text-olive/40">
          Media Gallery
        </h3>
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-olive px-4 py-2 text-xs font-medium tracking-wide text-creme transition-all hover:bg-olive/90">
          {isUploading ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImagePlus className="h-3.5 w-3.5" />
          )}
          Upload Images
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {gallery.map((url) => (
          <div
            key={url}
            className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
              primaryImage === url ? "border-olive shadow-md" : "border-transparent"
            }`}
          >
            <img
              src={url}
              alt="Product"
              className="h-full w-full object-cover"
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-olive/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setAsPrimary(url)}
                className="rounded-full bg-creme px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-olive"
              >
                Set Primary
              </button>
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="rounded-full bg-terracotta p-2 text-creme shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {primaryImage === url && (
              <div className="absolute left-2 top-2 rounded-full bg-olive px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-creme">
                Primary
              </div>
            )}
          </div>
        ))}

        {gallery.length === 0 && !isUploading && (
          <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-olive/10 bg-olive/5">
            <ImagePlus className="h-6 w-6 text-olive/20" />
          </div>
        )}
      </div>
    </div>
  );
}
