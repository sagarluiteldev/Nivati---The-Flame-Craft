"use client";

import { useState, useMemo } from "react";
import { 
  PlusIcon, 
  MinusIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/lib/dashboard-store";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  catalogProducts: AdminCatalogProduct[];
}

export default function StockTab({ catalogProducts }: Props) {
  const { 
    stockLevels, 
    stockLogs, 
    updateStockProfile, 
    adjustStockLevel, 
    logRestock 
  } = useDashboardStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modals state
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form State - Restock
  const [restockQty, setRestockQty] = useState(10);
  const [restockCost, setRestockCost] = useState(0);
  const [restockNote, setRestockNote] = useState("Restock shipment received");

  // Form State - Profile Config
  const [profileStock, setProfileStock] = useState(0);
  const [profileSafety, setProfileSafety] = useState(5);
  const [profileCost, setProfileCost] = useState(0);
  const [profileNote, setProfileNote] = useState("Inventory audit adjustment");

  // Table items mapping
  const stockItems = useMemo(() => {
    return stockLevels.map((s) => {
      const prod = catalogProducts.find((p) => p.id === s.productId);
      const retailPrice = prod ? Number(prod.price) : 0;
      const marginVal = retailPrice > 0 ? ((retailPrice - s.unitCost) / retailPrice) * 100 : 0;
      
      let status: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
      if (s.stockLevel === 0) status = "out-of-stock";
      else if (s.stockLevel <= s.safetyThreshold) status = "low-stock";

      return {
        productId: s.productId,
        title: prod?.title || s.productId,
        img: prod?.img || "",
        retailPrice,
        stockLevel: s.stockLevel,
        safetyThreshold: s.safetyThreshold,
        unitCost: s.unitCost,
        margin: marginVal,
        status,
        assetValue: s.stockLevel * s.unitCost,
      };
    });
  }, [stockLevels, catalogProducts]);

  // Inventory KPI Summary
  const inventoryMetrics = useMemo(() => {
    let totalValuation = 0;
    let healthyCount = 0;
    let lowCount = 0;
    let outCount = 0;

    stockItems.forEach((item) => {
      totalValuation += item.assetValue;
      if (item.status === "in-stock") healthyCount++;
      else if (item.status === "low-stock") lowCount++;
      else if (item.status === "out-of-stock") outCount++;
    });

    return { totalValuation, healthyCount, lowCount, outCount };
  }, [stockItems]);

  // Filtered Stock Items
  const filteredStock = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productId.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "low" && item.status === "low-stock") ||
        (statusFilter === "out" && item.status === "out-of-stock") ||
        (statusFilter === "good" && item.status === "in-stock");

      return matchesSearch && matchesStatus;
    });
  }, [stockItems, searchQuery, statusFilter]);

  const handleOpenRestock = (productId: string) => {
    setSelectedProductId(productId);
    const item = stockLevels.find((s) => s.productId === productId);
    setRestockQty(15);
    setRestockCost(item ? item.unitCost : 0);
    setRestockNote("Restock shipment received");
    setIsRestockOpen(true);
  };

  const handleOpenProfile = (productId: string) => {
    setSelectedProductId(productId);
    const item = stockLevels.find((s) => s.productId === productId);
    if (item) {
      setProfileStock(item.stockLevel);
      setProfileSafety(item.safetyThreshold);
      setProfileCost(item.unitCost);
      setProfileNote("Inventory audit adjustment");
      setIsProfileOpen(true);
    }
  };

  const handleSaveRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || restockQty <= 0 || restockCost <= 0) return;
    logRestock(selectedProductId, restockQty, restockCost, restockNote);
    setIsRestockOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || profileStock < 0 || profileSafety < 0 || profileCost < 0) return;
    updateStockProfile(selectedProductId, profileStock, profileSafety, profileCost, profileNote);
    setIsProfileOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. STOCK SUMMARY CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Warehouse Valuation
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#283322]">
            Rs {inventoryMetrics.totalValuation.toLocaleString()}
          </h4>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            At wholesale cost basis
          </span>
        </div>

        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Healthy In-Stock
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#15803d]">
            {inventoryMetrics.healthyCount}
          </h4>
          <span className="text-[10px] text-[#222a1d]/40 font-medium mt-1 block">
            Above safety thresholds
          </span>
        </div>

        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Low Stock Alerts
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#d97706]">
            {inventoryMetrics.lowCount}
          </h4>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
            Refill recommended
          </span>
        </div>

        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Out of Stock
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#dc2626]">
            {inventoryMetrics.outCount}
          </h4>
          <span className="text-[10px] text-red-600 font-semibold mt-1 block">
            Action required
          </span>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] border border-[#e3e8e2] shadow-sm">
        
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/35 transition-colors group-focus-within:text-[#283322]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in warehouse..."
              className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2.5 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
          >
            <option value="all">All Stock Levels</option>
            <option value="good">Healthy Stock (Good)</option>
            <option value="low">Low Stock (Alert)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Audit Logs Button */}
        <button
          onClick={() => setIsLogsOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full border border-[#e3e8e2] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all cursor-pointer w-full sm:w-auto"
        >
          <ClockIcon className="h-4 w-4 text-[#222a1d]/60" />
          <span>Audit Logs ({stockLogs.length})</span>
        </button>
      </div>

      {/* 3. STOCK MATRIX DATA TABLE */}
      <div className="rounded-[24px] sm:rounded-[28px] bg-white p-5 sm:p-7 border border-[#e3e8e2] shadow-sm">
        <div className="overflow-x-auto scrollbar-hide -mx-5 sm:-mx-7 px-5 sm:px-7">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                <th className="pb-3 pl-2">Product</th>
                <th className="pb-3 text-center">In Stock</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-center">Safety</th>
                <th className="pb-3 text-right">Cost Price</th>
                <th className="pb-3 text-right">Retail</th>
                <th className="pb-3 text-right">Margin</th>
                <th className="pb-3 text-right">Valuation</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f6f1] text-xs text-[#222a1d]">
              {filteredStock.map((item) => (
                <tr key={item.productId} className="hover:bg-[#f8faf8] transition-colors group">
                  
                  {/* Product Info */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#f1f4f1] border border-[#e8ede7]">
                        {item.img ? (
                          <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[#283322]/20 font-serif text-xs">🕯️</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#222a1d] truncate max-w-[150px]">{item.title}</div>
                        <div className="text-[10px] text-[#222a1d]/45 font-mono truncate max-w-[150px]">{item.productId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Inline +/- Stock Counter */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => adjustStockLevel(item.productId, -1, "Manual inline subtraction")}
                        className="h-6 w-6 rounded-lg border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/60 hover:bg-[#283322] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Deduct 1"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="font-bold font-mono text-sm w-7 text-center">{item.stockLevel}</span>
                      <button 
                        onClick={() => adjustStockLevel(item.productId, 1, "Manual inline addition")}
                        className="h-6 w-6 rounded-lg border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/60 hover:bg-[#283322] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Add 1"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 text-center">
                    <span className={`inline-block text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                      item.status === "in-stock"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : item.status === "low-stock"
                        ? "bg-[#fef3c7] text-[#b45309]"
                        : "bg-[#fee2e2] text-[#b91c1c]"
                    }`}>
                      {item.status.replace("-", " ")}
                    </span>
                  </td>

                  {/* Safety */}
                  <td className="py-4 text-center font-mono font-medium text-[#222a1d]/60">
                    {item.safetyThreshold} pcs
                  </td>

                  {/* Unit Cost */}
                  <td className="py-4 text-right font-mono text-[#222a1d]/60">
                    Rs {item.unitCost.toLocaleString()}
                  </td>

                  {/* Retail Price */}
                  <td className="py-4 text-right font-mono font-medium text-[#222a1d]">
                    Rs {item.retailPrice.toLocaleString()}
                  </td>

                  {/* Margin */}
                  <td className="py-4 text-right">
                    <span className={`font-bold font-mono text-xs ${item.margin > 50 ? "text-emerald-700" : "text-[#222a1d]/70"}`}>
                      {item.margin.toFixed(0)}%
                    </span>
                  </td>

                  {/* Asset Value */}
                  <td className="py-4 text-right font-mono font-bold text-[#283322]">
                    Rs {item.assetValue.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenRestock(item.productId)}
                        className="rounded-full bg-[#283322] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#34422c] transition-all cursor-pointer"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleOpenProfile(item.productId)}
                        className="rounded-full border border-[#e3e8e2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/70 hover:bg-[#f1f4f1] transition-all cursor-pointer"
                        title="Configure Stock Profile"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#222a1d]/40 font-serif">
                    No items in inventory matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. RESTOCK SHIPMENT DIALOG */}
      {isRestockOpen && selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#e3e8e2] animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#222a1d]">Restock Inventory</h3>
                <p className="text-[10px] font-mono text-[#222a1d]/40 mt-0.5">Product ID: {selectedProductId}</p>
              </div>
              <button 
                onClick={() => setIsRestockOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRestock} className="mt-5 space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Refill Quantity *</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Unit Cost (Rs) *</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={restockCost}
                    onChange={(e) => setRestockCost(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Shipment Log Note</span>
                <input
                  type="text"
                  required
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  placeholder="e.g. Received bulk jar batch"
                />
              </label>

              {/* Automatic Linked Ledger Notice */}
              <div className="rounded-2xl bg-[#f8faf8] p-4 border border-[#e8ede7] text-xs text-[#222a1d]/70 space-y-1">
                <p className="font-bold uppercase tracking-wider text-[9px] text-[#283322]">
                  ✓ Automatic Ledger Sync
                </p>
                <p className="text-[11px] leading-relaxed">
                  This restock will automatically log a paid expense of <strong className="text-[#283322]">Rs {(restockQty * restockCost).toLocaleString()}</strong> under Materials in your Operating Expenses.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#eef2ee] pt-4">
                <button
                  type="button"
                  onClick={() => setIsRestockOpen(false)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-[#222a1d]/50 hover:bg-[#f1f4f1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#283322] px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer active:scale-95"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. INVENTORY PROFILE CONFIG MODAL */}
      {isProfileOpen && selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#e3e8e2] animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#222a1d]">Stock Profile Settings</h3>
                <p className="text-[10px] font-mono text-[#222a1d]/40 mt-0.5">Product ID: {selectedProductId}</p>
              </div>
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Physical Count Adjustment *</span>
                <input
                  type="number"
                  required
                  min={0}
                  value={profileStock}
                  onChange={(e) => setProfileStock(Number(e.target.value))}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                />
              </label>

              <div className="grid gap-4 grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Safety Stock (Threshold) *</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileSafety}
                    onChange={(e) => setProfileSafety(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Wholesale Unit Cost (Rs) *</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileCost}
                    onChange={(e) => setProfileCost(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Audit Log Reason</span>
                <input
                  type="text"
                  required
                  value={profileNote}
                  onChange={(e) => setProfileNote(e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  placeholder="e.g. End of month physical inventory count"
                />
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#eef2ee] pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-[#222a1d]/50 hover:bg-[#f1f4f1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#283322] px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer active:scale-95"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. AUDIT TRAIL LOGS DRAWER */}
      {isLogsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm p-0 sm:p-4">
          <div className="h-full w-full max-w-xl bg-white p-6 sm:p-8 shadow-2xl flex flex-col justify-between border-l border-[#e3e8e2] sm:rounded-3xl animate-slide-in overflow-y-auto">
            <div>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#eef2ee] pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#283322] px-2 py-0.5 rounded bg-[#283322]/10">
                    Warehouse History
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] mt-1">
                    Stock Audit Trail
                  </h2>
                </div>
                <button 
                  onClick={() => setIsLogsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Logs List */}
              <div className="mt-6 space-y-3 overflow-y-auto max-h-[70vh] pr-1 scrollbar-hide">
                {stockLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl border border-[#e8ede7] bg-[#f8faf8] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#222a1d]">{log.productTitle}</span>
                      <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        log.type === "restock"
                          ? "bg-[#dcfce7] text-[#15803d]"
                          : log.type === "sale"
                          ? "bg-[#283322]/10 text-[#283322]"
                          : "bg-[#fef3c7] text-[#b45309]"
                      }`}>
                        {log.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#222a1d]/70">
                      <span>{log.note}</span>
                      <span className={`font-mono font-bold text-sm ${log.quantity > 0 ? "text-emerald-700" : "text-red-600"}`}>
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity} pcs
                      </span>
                    </div>

                    <div className="flex justify-between text-[10px] text-[#222a1d]/40 font-mono pt-1 border-t border-[#eef2ee]">
                      <span>{log.id}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}

                {stockLogs.length === 0 && (
                  <p className="text-center py-12 text-xs text-[#222a1d]/40 font-serif">
                    No warehouse stock adjustments logged yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-[#eef2ee] pt-4 text-center">
              <button 
                onClick={() => setIsLogsOpen(false)}
                className="rounded-full border border-[#e3e8e2] px-7 py-2 text-xs font-bold uppercase tracking-wider text-[#222a1d]/70 hover:bg-[#f1f4f1] cursor-pointer"
              >
                Close Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
