"use client";

import { useState, useMemo } from "react";
import { 
  PlusIcon, 
  MinusIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  ClockIcon
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

  // Filtered Stock Items
  const filteredStock = stockItems.filter((item) => {
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
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative group max-w-md flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-olive/30 transition-colors group-focus-within:text-olive/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in warehouse..."
              className="w-full rounded-xl border border-olive/10 bg-creme/50 px-11 py-2.5 text-sm text-olive placeholder:text-olive/20 outline-none transition-all focus:border-olive/30 focus:bg-creme"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-olive/10 bg-creme/50 px-4 py-2.5 text-sm text-olive/80 outline-none focus:border-olive/30 focus:bg-creme cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="good">Healthy Stock</option>
            <option value="low">Low Stock Alerts</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <button
          onClick={() => setIsLogsOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg border border-olive/10 bg-creme px-6 py-3 text-xs font-bold uppercase tracking-widest text-olive hover:bg-olive hover:text-creme transition-all"
        >
          <ClockIcon className="h-4 w-4" />
          Audit Logs
        </button>
      </div>

      {/* Stock Matrix Table */}
      <div className="overflow-hidden rounded-2xl border border-olive/10 bg-creme/40 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-olive/10 bg-olive/[0.02] text-[10px] font-bold uppercase tracking-[0.15em] text-olive/40">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Safety margin</th>
                <th className="p-4 text-right">Wholesale Cost</th>
                <th className="p-4 text-right">Retail Price</th>
                <th className="p-4 text-right">Profit Margin</th>
                <th className="p-4 text-right">Stock Valuation</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/5 text-sm text-olive">
              {filteredStock.map((item) => (
                <tr key={item.productId} className="hover:bg-olive/[0.01] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-olive/5 border border-olive/5">
                        {item.img ? (
                          <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-olive/20 font-serif text-xs">🕯️</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate max-w-[150px]">{item.title}</div>
                        <div className="text-xs text-olive/50 font-mono truncate max-w-[150px]">{item.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2.5">
                      <button 
                        onClick={() => adjustStockLevel(item.productId, -1, "Manual inline subtraction")}
                        className="p-1 rounded border border-olive/10 bg-creme text-olive/40 hover:text-olive hover:bg-olive/5 transition-colors"
                        title="Deduct 1"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="font-bold font-mono text-base text-center w-8">{item.stockLevel}</span>
                      <button 
                        onClick={() => adjustStockLevel(item.productId, 1, "Manual inline addition")}
                        className="p-1 rounded border border-olive/10 bg-creme text-olive/40 hover:text-olive hover:bg-olive/5 transition-colors"
                        title="Add 1"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.status === "in-stock"
                        ? "bg-olive/10 text-olive"
                        : item.status === "low-stock"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono font-medium text-olive/60">
                    {item.safetyThreshold} pcs
                  </td>
                  <td className="p-4 text-right font-mono text-olive/60">
                    Rs {item.unitCost.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono font-medium">
                    Rs {item.retailPrice.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-bold text-xs ${item.margin > 50 ? 'text-olive' : 'text-olive/70'}`}>
                      {item.margin.toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold">
                    Rs {item.assetValue.toLocaleString()}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenRestock(item.productId)}
                        className="rounded bg-olive px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-creme hover:opacity-90 transition-opacity"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleOpenProfile(item.productId)}
                        className="rounded border border-olive/15 px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-olive/60 hover:text-olive hover:bg-olive/5 transition-all"
                        title="Configure Profile"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-olive/40 font-serif">
                    No items in inventory matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESTOCK DIALOG MODAL */}
      {isRestockOpen && selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-olive/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-creme p-6 shadow-2xl border border-olive/10 animate-fade-in">
            <div className="flex items-center justify-between border-b border-olive/5 pb-4">
              <div>
                <h3 className="text-xl font-serif text-olive">Restock Shipment</h3>
                <p className="text-[9px] font-mono text-olive/40 mt-0.5">Product ID: {selectedProductId}</p>
              </div>
              <button 
                onClick={() => setIsRestockOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/5 text-olive/40 hover:text-olive"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRestock} className="mt-6 space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Refill Quantity</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Unit Cost (Rs)</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={restockCost}
                    onChange={(e) => setRestockCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Shipment Notes / Log Entry</span>
                <input
                  type="text"
                  required
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30"
                  placeholder="e.g. Received bulk jar batch"
                />
              </label>

              <div className="rounded-lg bg-olive/5 p-4 border border-olive/10 text-xs text-olive/70 space-y-1.5">
                <p className="font-bold uppercase tracking-wider text-[8px] text-olive/40">Linked Billing Notice</p>
                <p>This action will automatically register a paid expense under **Wax & Ingredients** category in your ledger for a total of **Rs {(restockQty * restockCost).toLocaleString()}**.</p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-olive/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRestockOpen(false)}
                  className="rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-olive/40 hover:text-olive hover:bg-olive/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-olive px-8 py-3 text-xs font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVENTORY PROFILE EDIT CONFIG MODAL */}
      {isProfileOpen && selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-olive/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-creme p-6 shadow-2xl border border-olive/10 animate-fade-in">
            <div className="flex items-center justify-between border-b border-olive/5 pb-4">
              <div>
                <h3 className="text-xl font-serif text-olive">Configure Stock Profile</h3>
                <p className="text-[9px] font-mono text-olive/40 mt-0.5">Product ID: {selectedProductId}</p>
              </div>
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/5 text-olive/40 hover:text-olive"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Physical Stock Count</span>
                <input
                  type="number"
                  required
                  min={0}
                  value={profileStock}
                  onChange={(e) => setProfileStock(Number(e.target.value))}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                />
              </label>

              <div className="grid gap-4 grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Safety Stock Threshold</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileSafety}
                    onChange={(e) => setProfileSafety(Number(e.target.value))}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Unit Cost (Wholesale Basis)</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileCost}
                    onChange={(e) => setProfileCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Reason for audit adjustment</span>
                <input
                  type="text"
                  required
                  value={profileNote}
                  onChange={(e) => setProfileNote(e.target.value)}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30"
                  placeholder="e.g. End of month physical inventory count"
                />
              </label>

              <div className="flex items-center justify-end gap-3 border-t border-olive/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-olive/40 hover:text-olive hover:bg-olive/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-olive px-8 py-3 text-xs font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOGS MODAL DRAWER */}
      {isLogsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-olive/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl bg-creme p-8 shadow-2xl flex flex-col justify-between border-l border-olive/10 animate-slide-in">
            <div>
              <div className="flex items-center justify-between border-b border-olive/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">Audit Trail</p>
                  <h2 className="text-3xl font-serif text-olive mt-1">Warehouse Stock Logs</h2>
                </div>
                <button 
                  onClick={() => setIsLogsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/10 bg-creme text-olive/40 hover:text-olive transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Logs Table */}
              <div className="mt-8 space-y-4 overflow-y-auto max-h-[70vh] pr-2 scrollbar-hide">
                {stockLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-olive/5 bg-creme/50 hover:border-olive/15 transition-all text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-olive">{log.productTitle}</span>
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        log.type === "restock"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.type === "sale"
                          ? "bg-olive/10 text-olive"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {log.type}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-olive/60">{log.note}</span>
                      <span className={`font-mono font-bold ${log.quantity > 0 ? "text-emerald-700" : "text-terracotta"}`}>
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity} pcs
                      </span>
                    </div>
                    <div className="mt-2.5 flex justify-between text-[9px] text-olive/30 font-semibold font-mono">
                      <span>ID: {log.id}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}

                {stockLogs.length === 0 && (
                  <p className="text-center py-12 text-xs text-olive/40 font-serif">No inventory adjustments logged yet.</p>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-olive/5 pt-4 text-center">
              <button 
                onClick={() => setIsLogsOpen(false)}
                className="rounded-lg border border-olive/15 px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-olive/60 hover:text-olive hover:bg-olive/5 transition-all"
              >
                Close Audit logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
