"use client";

import { useState, useMemo } from "react";
import { 
  TrashIcon, 
  XMarkIcon, 
  ArrowUturnLeftIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore, type TrashItem, type TrashEntityType } from "@/lib/dashboard-store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProductRestored?: () => void;
}

export default function RecycleBinDrawer({ isOpen, onClose, onProductRestored }: Props) {
  const { trashItems, restoreFromTrash, permanentlyDelete, emptyTrash } = useDashboardStore();
  const [selectedType, setSelectedType] = useState<"all" | TrashEntityType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      all: trashItems.length,
      product: trashItems.filter((t) => t.entityType === "product").length,
      sale: trashItems.filter((t) => t.entityType === "sale").length,
      expense: trashItems.filter((t) => t.entityType === "expense").length,
      material: trashItems.filter((t) => t.entityType === "material").length,
    };
  }, [trashItems]);

  const filteredItems = useMemo(() => {
    return trashItems.filter((item) => {
      const matchesType = selectedType === "all" || item.entityType === selectedType;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.entityId.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [trashItems, selectedType, searchQuery]);

  const getDaysLeft = (expiresAt: string) => {
    const msLeft = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

  const handleRestore = async (item: TrashItem) => {
    await restoreFromTrash(item.id);
    if (item.entityType === "product" && onProductRestored) {
      onProductRestored();
    }
    setActionSuccessMsg(`Restored "${item.title}" to active records.`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handlePermanentDelete = async (id: string) => {
    await permanentlyDelete(id);
    setItemToDelete(null);
    setActionSuccessMsg("Item permanently deleted.");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleEmptyTrash = async () => {
    await emptyTrash();
    setConfirmEmpty(false);
    setActionSuccessMsg("Recycle bin emptied successfully.");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative h-full w-full max-w-2xl bg-white p-5 sm:p-7 shadow-2xl flex flex-col justify-between border-l border-[#e3e8e2] sm:rounded-3xl animate-slide-in overflow-hidden z-10">
        
        {/* TOP HEADER */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ef]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dc2626] text-white shadow-md shadow-red-600/20">
                <TrashIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#222a1d] flex items-center gap-2">
                  <span>Recycle Bin</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#f1f4f1] text-[#222a1d]/70 font-sans font-bold">
                    {trashItems.length}
                  </span>
                </h2>
                <p className="text-xs text-[#222a1d]/50">
                  Items stay in the bin for 30 days before being permanently deleted
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {trashItems.length > 0 && (
                <button
                  onClick={() => setConfirmEmpty(true)}
                  className="rounded-full bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  Empty Bin
                </button>
              )}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#222a1d]/50 hover:bg-[#f1f4f1] hover:text-[#222a1d] transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* SUCCESS TOAST BANNER */}
          {actionSuccessMsg && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] px-4 py-2 text-xs font-semibold text-[#15803d] animate-fade-in">
              <span>✓</span>
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* SEARCH & CATEGORY FILTER BAR */}
          <div className="mt-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#222a1d]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deleted items..."
                className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none focus:border-[#283322]/40 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
              {[
                { key: "all", label: "All Items", count: counts.all },
                { key: "product", label: "Products", count: counts.product },
                { key: "sale", label: "Sales Orders", count: counts.sale },
                { key: "expense", label: "Expenses", count: counts.expense },
                { key: "material", label: "Raw Materials", count: counts.material },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedType(tab.key as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedType === tab.key
                      ? "bg-[#283322] text-white shadow-sm"
                      : "bg-[#f1f4f1] text-[#222a1d]/70 hover:bg-[#e8ede7] hover:text-[#222a1d]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedType === tab.key ? "bg-white/20 text-white" : "bg-black/5 text-[#222a1d]/60"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ITEMS LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 my-2 pr-1">
          {filteredItems.map((item) => {
            const daysLeft = getDaysLeft(item.expiresAt);
            const isExpiringSoon = daysLeft <= 3;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#fbfdfa] p-4 border border-[#e8ede7] hover:border-[#283322]/20 hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Entity Icon / Image */}
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white border border-[#e8ede7] flex items-center justify-center">
                    {item.entityType === "product" ? (
                      item.data?.img ? (
                        <img src={item.data.img} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm">🕯️</span>
                      )
                    ) : item.entityType === "sale" ? (
                      <span className="text-sm font-bold text-[#16a34a]">🧾</span>
                    ) : item.entityType === "expense" ? (
                      <span className="text-sm font-bold text-[#0284c7]">💸</span>
                    ) : (
                      <span className="text-sm font-bold text-[#d97706]">📦</span>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.entityType === "product"
                          ? "bg-purple-100 text-purple-700"
                          : item.entityType === "sale"
                          ? "bg-green-100 text-green-700"
                          : item.entityType === "expense"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.entityType}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-[#222a1d] truncate">
                        {item.title}
                      </h3>
                    </div>

                    {item.subtitle && (
                      <p className="text-[11px] text-[#222a1d]/60 mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-1 text-[10px] text-[#222a1d]/40">
                      <span>Deleted: {new Date(item.deletedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 font-semibold ${
                        isExpiringSoon ? "text-red-600 font-bold" : "text-amber-700"
                      }`}>
                        <ClockIcon className="h-3 w-3" />
                        <span>{daysLeft} {daysLeft === 1 ? "day" : "days"} left</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Restore & Permanent Delete */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f4ef] justify-end">
                  <button
                    onClick={() => handleRestore(item)}
                    className="flex items-center gap-1.5 rounded-full bg-[#283322] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#384830] transition-all cursor-pointer shadow-2xs"
                    title="Restore item back to active ledger"
                  >
                    <ArrowUturnLeftIcon className="h-3.5 w-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => setItemToDelete(item.id)}
                    className="flex items-center justify-center h-8 w-8 rounded-full text-[#222a1d]/40 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    title="Permanently Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#f1f4f1] text-[#222a1d]/30 mb-3">
                <ArchiveBoxIcon className="h-7 w-7" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#222a1d]">
                {searchQuery ? "No matching trashed items found" : "Recycle Bin is Empty"}
              </h3>
              <p className="text-xs text-[#222a1d]/40 mt-1 max-w-xs mx-auto">
                Deleted products, sales, expenses, and materials will be stored here for 30 days before permanent deletion.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER NOTICE */}
        <div className="pt-3 border-t border-[#f0f4ef] flex items-center justify-between text-[11px] text-[#222a1d]/50">
          <span>Items are excluded from live sales metrics & catalog</span>
          <button
            onClick={onClose}
            className="font-bold text-[#283322] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* MODAL: CONFIRM EMPTY BIN */}
        {confirmEmpty && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#e3e8e2] text-center animate-scale-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dc2626] text-white shadow-md shadow-red-600/20 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#222a1d]">
                Empty Recycle Bin?
              </h3>
              <p className="text-xs text-[#222a1d]/60 mt-1">
                All {trashItems.length} items in the bin will be permanently deleted immediately. This action cannot be undone.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => setConfirmEmpty(false)}
                  className="flex-1 rounded-full border border-[#e3e8e2] py-2.5 text-xs font-semibold text-[#222a1d] hover:bg-[#f8faf8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmptyTrash}
                  className="flex-1 rounded-full bg-[#dc2626] py-2.5 text-xs font-bold text-white hover:bg-[#b91c1c] transition-colors cursor-pointer shadow-sm"
                >
                  Empty Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM SINGLE PERMANENT DELETE */}
        {itemToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#e3e8e2] text-center animate-scale-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dc2626] text-white shadow-md shadow-red-600/20 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#222a1d]">
                Permanently Delete Item?
              </h3>
              <p className="text-xs text-[#222a1d]/60 mt-1">
                This item will be completely removed from the database and cannot be recovered.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 rounded-full border border-[#e3e8e2] py-2.5 text-xs font-semibold text-[#222a1d] hover:bg-[#f8faf8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePermanentDelete(itemToDelete)}
                  className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
