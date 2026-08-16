"use client";

import { useState } from "react";
import { 
  PhotoIcon as ImagePlus, 
  ArrowPathIcon as LoaderCircle, 
  TrashIcon as Trash2,
  PlusIcon,
  LinkIcon,
  CheckCircleIcon,
  StarIcon,
  SparklesIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase/env";
import { compressImage, formatFileSize } from "@/lib/image-compressor";

interface Props {
  primaryImage: string;
  gallery: string[];
  onChange: (data: { primaryImage: string; gallery: string[] }) => void;
}

export default function MediaManager({ primaryImage, gallery, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalTotal: number;
    compressedTotal: number;
    savingsPct: number;
  } | null>(null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    setIsUploading(true);
    setUploadStatus("Optimizing & compressing images...");

    try {
      const supabase = createSupabaseBrowserClient();
      const uploadedUrls: string[] = [];

      let totalOrig = 0;
      let totalComp = 0;

      for (let i = 0; i < rawFiles.length; i++) {
        const rawFile = rawFiles[i];
        setUploadStatus(`Compressing ${i + 1} of ${rawFiles.length} (${rawFile.name})...`);

        // 1. High-Fidelity Client-Side WebP Compression (Max 1800px, 85% quality)
        const { file: compressedFile, originalSize, compressedSize, savingsPercent } = await compressImage(rawFile, {
          maxWidth: 1800,
          maxHeight: 1800,
          quality: 0.85,
          mimeType: "image/webp",
        });

        totalOrig += originalSize;
        totalComp += compressedSize;

        setUploadStatus(`Uploading optimized photo ${i + 1}/${rawFiles.length}...`);

        // 2. Upload Compressed WebP File to Supabase Storage
        const fileExt = compressedFile.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .upload(filePath, compressedFile, {
            contentType: compressedFile.type,
            cacheControl: "31536000",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .getPublicUrl(filePath);
        
        uploadedUrls.push(data.publicUrl);
      }

      const totalSavingsPct = totalOrig > 0 
        ? Math.round(((totalOrig - totalComp) / totalOrig) * 100)
        : 0;

      setCompressionStats({
        originalTotal: totalOrig,
        compressedTotal: totalComp,
        savingsPct: totalSavingsPct,
      });

      const newGallery = [...gallery, ...uploadedUrls];
      onChange({
        primaryImage: primaryImage || uploadedUrls[0] || "",
        gallery: newGallery,
      });

      // Clear compression stat badge after 8 seconds
      setTimeout(() => setCompressionStats(null), 8000);
    } catch (error) {
      console.error("Error compressing/uploading image:", error);
      alert("Failed to upload image. Please check your network or credentials.");
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
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
    const newGallery = gallery.filter((img) => img !== url);
    let newPrimary = primaryImage;
    if (primaryImage === url) {
      newPrimary = newGallery.length > 0 ? newGallery[0] : "";
    }
    onChange({
      primaryImage: newPrimary,
      gallery: newGallery,
    });
  };

  const setAsPrimary = (url: string) => {
    onChange({
      primaryImage: url,
      gallery: gallery.includes(url) ? gallery : [url, ...gallery],
    });
  };

  const allImages = Array.from(new Set([primaryImage, ...gallery].filter(Boolean)));

  return (
    <div className="space-y-4">
      
      {/* Header & Upload Triggers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#222a1d]">
              Product Imagery & Gallery
            </h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
              <BoltIcon className="h-3 w-3 text-emerald-600" />
              <span>Smart WebP Compressor</span>
            </span>
          </div>
          <p className="text-[11px] text-[#222a1d]/50 mt-0.5">
            Images are auto-compressed to lightweight WebP format for fast storefront load times
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* File Upload Input */}
          <label className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-full bg-[#283322] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#34422c] transition-all cursor-pointer disabled:opacity-50">
            {isUploading ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            <span>{isUploading ? "Optimizing..." : "Upload Photos"}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>

          {/* Add Image URL Button */}
          <button
            type="button"
            onClick={() => setIsUrlModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2 text-xs font-bold text-[#222a1d] hover:bg-[#eef2ee] transition-colors cursor-pointer"
          >
            <LinkIcon className="h-3.5 w-3.5 text-[#222a1d]/60" />
            <span>Add URL</span>
          </button>
        </div>
      </div>

      {/* Live Upload Status Message */}
      {uploadStatus && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#eff6ff] p-3 text-xs text-[#1e40af] border border-[#dbeafe] animate-fade-in">
          <LoaderCircle className="h-4 w-4 animate-spin shrink-0 text-[#2563eb]" />
          <span className="font-medium">{uploadStatus}</span>
        </div>
      )}

      {/* Compression Result Banner */}
      {compressionStats && (
        <div className="flex items-center justify-between rounded-2xl bg-[#ecfdf5] p-3.5 text-xs text-[#065f46] border border-[#a7f3d0] animate-fade-in">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Smart Optimization:</strong> Reduced from{" "}
              {formatFileSize(compressionStats.originalTotal)} down to{" "}
              <strong className="underline">{formatFileSize(compressionStats.compressedTotal)}</strong>{" "}
              ({compressionStats.savingsPct}% lighter file size)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCompressionStats(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* URL Ingestion Modal */}
      {isUrlModalOpen && (
        <div className="rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] p-4 animate-fade-in">
          <form onSubmit={handleAddUrl} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="url"
              required
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/candle-photo.jpg"
              className="flex-1 rounded-xl border border-[#e3e8e2] bg-white px-3.5 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-initial rounded-xl bg-[#283322] px-4 py-2 text-xs font-bold text-white hover:bg-[#34422c] cursor-pointer"
              >
                Add Image
              </button>
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="rounded-xl border border-[#e3e8e2] px-3 py-2 text-xs font-semibold text-[#222a1d]/60 hover:bg-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Grid */}
      {allImages.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
          {allImages.map((url, idx) => {
            const isPrimary = url === primaryImage;

            return (
              <div
                key={url + idx}
                className={`group relative aspect-square overflow-hidden rounded-2xl border bg-[#f1f4f1] transition-all shadow-sm ${
                  isPrimary
                    ? "border-[#283322] ring-2 ring-[#283322]/20"
                    : "border-[#e3e8e2] hover:border-[#283322]/40"
                }`}
              >
                <img
                  src={url}
                  alt={`Product Media ${idx + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Primary Tag */}
                {isPrimary && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[#283322] px-2 py-0.5 text-[9px] font-bold text-white shadow-md">
                    <StarSolid className="h-2.5 w-2.5 text-amber-300" />
                    <span>Primary</span>
                  </div>
                )}

                {/* Hover / Action Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => setAsPrimary(url)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#283322] hover:bg-amber-100 transition-colors shadow-md cursor-pointer"
                      title="Set as Primary Image"
                    >
                      <StarIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 hover:bg-red-50 transition-colors shadow-md cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d5ded4] bg-[#f8faf8] py-8 text-center">
          <ImagePlus className="h-8 w-8 text-[#222a1d]/30 mb-2" />
          <p className="text-xs font-bold text-[#222a1d]/60">No photos added yet</p>
          <p className="text-[10px] text-[#222a1d]/40 mt-0.5">Upload photos from device (auto-compressed) or add image URLs above</p>
        </div>
      )}
    </div>
  );
}
