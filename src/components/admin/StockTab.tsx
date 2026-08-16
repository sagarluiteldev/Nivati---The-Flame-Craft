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
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { 
  useDashboardStore, 
  type RawMaterialStock, 
  type MaterialCategory 
} from "@/lib/dashboard-store";

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: "all", label: "All Materials" },
  { id: "wax", label: "Waxes & Dyes" },
  { id: "wicks", label: "Wicks & Stickers" },
  { id: "fragrance", label: "Fragrance Oils" },
  { id: "moulding", label: "Plaster & Moulds" },
  { id: "packaging", label: "Labels & Packaging" },
  { id: "vessels", label: "Jars & Lids" },
  { id: "tools", label: "Studio Tools" },
];

export default function StockTab() {
  const { 
    rawMaterials, 
    stockLogs, 
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    adjustMaterialStock, 
    restockMaterial 
  } = useDashboardStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modals state
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // Form State - Add New Material
  const [newMatName, setNewMatName] = useState("");
  const [newMatCategory, setNewMatCategory] = useState<MaterialCategory>("wax");
  const [newMatUnit, setNewMatUnit] = useState("kg");
  const [newMatStock, setNewMatStock] = useState(10);
  const [newMatSafety, setNewMatSafety] = useState(5);
  const [newMatCost, setNewMatCost] = useState(500);

  // Form State - Restock
  const [restockQty, setRestockQty] = useState(10);
  const [restockCost, setRestockCost] = useState(0);
  const [restockNote, setRestockNote] = useState("Raw material batch received");

  // Form State - Profile Config
  const [profileName, setProfileName] = useState("");
  const [profileCategory, setProfileCategory] = useState<MaterialCategory>("wax");
  const [profileUnit, setProfileUnit] = useState("kg");
  const [profileStock, setProfileStock] = useState(0);
  const [profileSafety, setProfileSafety] = useState(5);
  const [profileCost, setProfileCost] = useState(0);

  // Table items mapping
  const materialItems = useMemo(() => {
    return rawMaterials.map((m) => {
      let status: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
      if (m.stockLevel === 0) status = "out-of-stock";
      else if (m.stockLevel <= m.safetyThreshold) status = "low-stock";

      return {
        ...m,
        status,
        assetValue: m.stockLevel * m.unitCost,
      };
    });
  }, [rawMaterials]);

  // Inventory KPI Summary
  const inventoryMetrics = useMemo(() => {
    let totalValuation = 0;
    let healthyCount = 0;
    let lowCount = 0;
    let outCount = 0;

    materialItems.forEach((item) => {
      totalValuation += item.assetValue;
      if (item.status === "in-stock") healthyCount++;
      else if (item.status === "low-stock") lowCount++;
      else if (item.status === "out-of-stock") outCount++;
    });

    return { totalValuation, healthyCount, lowCount, outCount };
  }, [materialItems]);

  // Filtered Stock Items
  const filteredStock = useMemo(() => {
    return materialItems.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [materialItems, searchQuery, categoryFilter, statusFilter]);

  // Modal Triggers
  const handleOpenRestock = (material: RawMaterialStock) => {
    setSelectedMaterialId(material.id);
    setRestockQty(material.unit === "kg" ? 10 : material.unit === "pcs" ? 100 : 5);
    setRestockCost(material.unitCost);
    setRestockNote(`Restock: ${material.name}`);
    setIsRestockOpen(true);
  };

  const handleOpenProfile = (material: RawMaterialStock) => {
    setSelectedMaterialId(material.id);
    setProfileName(material.name);
    setProfileCategory(material.category);
    setProfileUnit(material.unit);
    setProfileStock(material.stockLevel);
    setProfileSafety(material.safetyThreshold);
    setProfileCost(material.unitCost);
    setIsProfileOpen(true);
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    await addRawMaterial({
      name: newMatName.trim(),
      category: newMatCategory,
      unit: newMatUnit.trim(),
      stockLevel: Number(newMatStock),
      safetyThreshold: Number(newMatSafety),
      unitCost: Number(newMatCost),
      img: "",
    });

    setIsAddMaterialOpen(false);
    setNewMatName("");
  };

  const handleSaveRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) return;

    await restockMaterial(
      selectedMaterialId, 
      Number(restockQty), 
      Number(restockCost), 
      restockNote
    );
    setIsRestockOpen(false);
    setSelectedMaterialId(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) return;

    await updateRawMaterial(selectedMaterialId, {
      name: profileName,
      category: profileCategory,
      unit: profileUnit,
      stockLevel: Number(profileStock),
      safetyThreshold: Number(profileSafety),
      unitCost: Number(profileCost),
    });
    setIsProfileOpen(false);
    setSelectedMaterialId(null);
  };

  const handleDeleteMaterial = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from raw materials stock?`)) return;
    await deleteRawMaterial(id);
  };

  const activeMaterial = rawMaterials.find((m) => m.id === selectedMaterialId);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Asset Valuation */}
        <div className="rounded-3xl sm:rounded-[28px] bg-linear-to-br from-[#242c1e] via-[#2c3725] to-[#384630] p-6 text-white shadow-xl shadow-[#283322]/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80 tracking-wide">
              Raw Materials Valuation
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#283322]">
              <CircleStackIcon className="h-5 w-5 text-[#283322]" />
            </div>
          </div>
          <div className="mt-5">
            <div className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-white">
              Rs {inventoryMetrics.totalValuation.toLocaleString()}
            </div>
            <p className="mt-2 text-xs text-white/60 font-medium">
              Total studio supplies on hand ({rawMaterials.length} items)
            </p>
          </div>
        </div>

        {/* Card 2: Healthy Stock Count */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Optimal Stock Supplies
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-sm shadow-emerald-600/20">
              <CheckCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-5">
            <div className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#222a1d]">
              {inventoryMetrics.healthyCount}
            </div>
            <p className="mt-2 text-xs text-[#222a1d]/40 font-medium">
              Above safety inventory threshold
            </p>
          </div>
        </div>

        {/* Card 3: Low Stock Warnings */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Low Stock Warnings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97706] text-white shadow-sm shadow-amber-600/20">
              <ExclamationTriangleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-5">
            <div className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#d97706]">
              {inventoryMetrics.lowCount}
            </div>
            <p className="mt-2 text-xs text-[#222a1d]/40 font-medium">
              Needs restock soon
            </p>
          </div>
        </div>

        {/* Card 4: Depleted / Out of Stock */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Depleted Materials
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dc2626] text-white shadow-sm shadow-red-600/20">
              <XCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-5">
            <div className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#dc2626]">
              {inventoryMetrics.outCount}
            </div>
            <p className="mt-2 text-xs text-[#222a1d]/40 font-medium">
              Requires immediate ordering
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === tab.id
                ? "bg-[#283322] text-white shadow-sm"
                : "bg-white border border-[#e3e8e2] text-[#222a1d]/70 hover:bg-[#f1f4f1]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl sm:rounded-[28px] border border-[#e3e8e2] shadow-sm">
        
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/35 transition-colors group-focus-within:text-[#283322]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search raw materials (wax, wicks, plaster, oils)..."
              className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2.5 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
          >
            <option value="all">All Inventory Statuses</option>
            <option value="in-stock">Healthy Stock (Optimal)</option>
            <option value="low-stock">Low Stock (Alert)</option>
            <option value="out-of-stock">Depleted (0 left)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsAddMaterialOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-full bg-[#283322] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Material</span>
          </button>

          <button
            onClick={() => setIsLogsOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-full border border-[#e3e8e2] bg-white px-4 py-2.5 text-xs font-bold text-[#222a1d] shadow-sm hover:border-[#283322]/30 hover:bg-[#f1f4f1] transition-all cursor-pointer"
          >
            <ClockIcon className="h-4 w-4 text-[#222a1d]/60" />
            <span>Audit Logs ({stockLogs.length})</span>
          </button>
        </div>
      </div>

      {/* 3. STOCK MATRIX DATA TABLE */}
      <div className="rounded-3xl sm:rounded-[28px] bg-white p-5 sm:p-7 border border-[#e3e8e2] shadow-sm">
        <div className="overflow-x-auto scrollbar-hide -mx-5 sm:-mx-7 px-5 sm:px-7">
          <table className="w-full text-left border-collapse min-w-195">
            <thead>
              <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                <th className="pb-3 pl-2">Raw Material</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-center">Current Quantity</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-center">Safety Alert</th>
                <th className="pb-3 text-right">Unit Cost</th>
                <th className="pb-3 text-right">Asset Valuation</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f6f1] text-xs text-[#222a1d]">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8faf8] transition-colors group">
                  
                  {/* Material Info */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#f1f4f1] border border-[#e8ede7]">
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[#283322]/40 font-serif text-sm">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#222a1d] truncate max-w-40">{item.name}</div>
                        <div className="text-[10px] text-[#222a1d]/45 font-mono truncate max-w-40">{item.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4">
                    <span className="inline-block rounded-full bg-[#f1f4f1] px-2.5 py-0.5 text-[10px] font-semibold text-[#222a1d]/70 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>

                  {/* Inline +/- Stock Counter */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => adjustMaterialStock(item.id, -1, "Manual deduction")}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e3e8e2] bg-white text-[#222a1d]/70 hover:border-[#283322] hover:bg-[#283322] hover:text-white transition-colors cursor-pointer active:scale-90"
                        title={`Deduct 1 ${item.unit}`}
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <div className="min-w-16 text-center font-mono font-bold text-sm text-[#222a1d]">
                        {item.stockLevel} <span className="text-[10px] font-normal text-[#222a1d]/50">{item.unit}</span>
                      </div>
                      <button 
                        onClick={() => adjustMaterialStock(item.id, 1, "Manual addition")}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e3e8e2] bg-white text-[#222a1d]/70 hover:border-[#283322] hover:bg-[#283322] hover:text-white transition-colors cursor-pointer active:scale-90"
                        title={`Add 1 ${item.unit}`}
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 text-center">
                    <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-xs ${
                      item.status === "in-stock"
                        ? "bg-[#15803d]"
                        : item.status === "low-stock"
                        ? "bg-[#d97706]"
                        : "bg-[#dc2626]"
                    }`}>
                      {item.status === "in-stock" ? "Healthy" : item.status === "low-stock" ? "Low Stock" : "Depleted"}
                    </span>
                  </td>

                  {/* Safety Alert Threshold */}
                  <td className="py-4 text-center font-mono text-[11px] text-[#222a1d]/60">
                    &lt; {item.safetyThreshold} {item.unit}
                  </td>

                  {/* Unit Cost */}
                  <td className="py-4 text-right font-mono font-semibold text-xs text-[#222a1d]">
                    Rs {item.unitCost} <span className="text-[10px] text-[#222a1d]/40">/{item.unit}</span>
                  </td>

                  {/* Total Asset Valuation */}
                  <td className="py-4 text-right font-mono font-bold text-xs text-[#283322]">
                    Rs {item.assetValue.toLocaleString()}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenRestock(item)}
                        className="rounded-full bg-[#283322] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[#34422c] transition-colors cursor-pointer"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleOpenProfile(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e3e8e2] text-[#222a1d]/60 hover:bg-[#f1f4f1] hover:text-[#222a1d] transition-colors cursor-pointer"
                        title="Edit Material Profile"
                      >
                        <PencilSquareIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(item.id, item.name)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                        title="Delete Material"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#222a1d]/40 font-serif">
                    No raw materials match your filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD NEW RAW MATERIAL                                         */}
      {/* ===================================================================== */}
      {isAddMaterialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#e3e8e2]">
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#283322] px-2 py-0.5 rounded bg-[#283322]/10">
                  New Raw Material
                </span>
                <h3 className="text-xl font-serif font-bold text-[#222a1d] mt-1">
                  Add Supply to Warehouse
                </h3>
              </div>
              <button 
                onClick={() => setIsAddMaterialOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Material Name *</span>
                <input
                  type="text"
                  required
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  placeholder="e.g. Coconut Wax Flakes, Wooden Wicks, Ceramic Jar"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Category</span>
                  <select
                    value={newMatCategory}
                    onChange={(e) => setNewMatCategory(e.target.value as MaterialCategory)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
                  >
                    <option value="wax">Waxes & Dyes</option>
                    <option value="wicks">Wicks & Accessories</option>
                    <option value="fragrance">Fragrance Oils</option>
                    <option value="moulding">Plaster & Moulds</option>
                    <option value="packaging">Labels & Packaging</option>
                    <option value="vessels">Jars & Vessels</option>
                    <option value="tools">Studio Tools</option>
                    <option value="other">Other Supplies</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Unit of Measure</span>
                  <input
                    type="text"
                    required
                    value={newMatUnit}
                    onChange={(e) => setNewMatUnit(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                    placeholder="kg, pcs, packs, bottles, rolls"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Initial Stock</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newMatStock}
                    onChange={(e) => setNewMatStock(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Safety Threshold</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newMatSafety}
                    onChange={(e) => setNewMatSafety(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Unit Cost (Rs)</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newMatCost}
                    onChange={(e) => setNewMatCost(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#eef2ee]">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialOpen(false)}
                  className="flex-1 rounded-full border border-[#e3e8e2] py-2.5 text-xs font-semibold text-[#222a1d] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#283322] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: RESTOCK SHIPMENT                                             */}
      {/* ===================================================================== */}
      {isRestockOpen && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#e3e8e2]">
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a] px-2 py-0.5 rounded bg-[#dcfce7]">
                  Receive Supply
                </span>
                <h3 className="text-xl font-serif font-bold text-[#222a1d] mt-1">
                  Restock {activeMaterial.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsRestockOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRestock} className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#f8faf8] p-3.5 border border-[#e8ede7] text-xs space-y-1.5">
                <div className="flex justify-between text-[#222a1d]/60">
                  <span>Current On-Hand:</span>
                  <span className="font-bold text-[#222a1d]">{activeMaterial.stockLevel} {activeMaterial.unit}</span>
                </div>
                <div className="flex justify-between text-[#222a1d]/60">
                  <span>Current Unit Cost:</span>
                  <span className="font-bold text-[#222a1d]">Rs {activeMaterial.unitCost} /{activeMaterial.unit}</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Quantity Received ({activeMaterial.unit}) *</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Purchase Cost / Unit (Rs) *</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={restockCost}
                    onChange={(e) => setRestockCost(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Batch Note / Supplier</span>
                <input
                  type="text"
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  placeholder="e.g. Batch #402, Supplier XYZ"
                />
              </label>

              <div className="rounded-2xl bg-[#eff6ff] p-3.5 text-xs text-[#1e40af] border border-[#dbeafe]">
                <div className="flex justify-between font-bold">
                  <span>Total Expense to Log:</span>
                  <span>Rs {(restockQty * restockCost).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#1e40af]/70 mt-0.5">
                  This purchase will automatically be recorded in your Operating Expenses ledger.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#eef2ee]">
                <button
                  type="button"
                  onClick={() => setIsRestockOpen(false)}
                  className="flex-1 rounded-full border border-[#e3e8e2] py-2.5 text-xs font-semibold text-[#222a1d] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#283322] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: EDIT MATERIAL PROFILE                                        */}
      {/* ===================================================================== */}
      {isProfileOpen && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#e3e8e2]">
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#283322] px-2 py-0.5 rounded bg-[#283322]/10">
                  Settings
                </span>
                <h3 className="text-xl font-serif font-bold text-[#222a1d] mt-1">
                  Configure Material Profile
                </h3>
              </div>
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Material Name</span>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Category</span>
                  <select
                    value={profileCategory}
                    onChange={(e) => setProfileCategory(e.target.value as MaterialCategory)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
                  >
                    <option value="wax">Waxes & Dyes</option>
                    <option value="wicks">Wicks & Accessories</option>
                    <option value="fragrance">Fragrance Oils</option>
                    <option value="moulding">Plaster & Moulds</option>
                    <option value="packaging">Labels & Packaging</option>
                    <option value="vessels">Jars & Vessels</option>
                    <option value="tools">Studio Tools</option>
                    <option value="other">Other Supplies</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Unit of Measure</span>
                  <input
                    type="text"
                    required
                    value={profileUnit}
                    onChange={(e) => setProfileUnit(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Stock Level</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileStock}
                    onChange={(e) => setProfileStock(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Safety Alert</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileSafety}
                    onChange={(e) => setProfileSafety(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Unit Cost (Rs)</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={profileCost}
                    onChange={(e) => setProfileCost(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#eef2ee]">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex-1 rounded-full border border-[#e3e8e2] py-2.5 text-xs font-semibold text-[#222a1d] hover:bg-[#f1f4f1] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#283322] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DRAWER: AUDIT LOGS TRAIL                                              */}
      {/* ===================================================================== */}
      {isLogsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative h-full w-full max-w-lg bg-white p-6 sm:p-8 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#283322] px-2 py-0.5 rounded bg-[#283322]/10">
                  Warehouse Audit
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#222a1d] mt-1">
                  Raw Materials Activity Trail
                </h3>
              </div>
              <button 
                onClick={() => setIsLogsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {stockLogs.map((log) => (
                <div key={log.id} className="rounded-2xl bg-[#f8faf8] p-4 border border-[#e8ede7] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#222a1d]">{log.materialName}</span>
                    <span className="font-mono text-[10px] text-[#222a1d]/40">{log.date}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      log.type === "restock"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : log.type === "usage"
                        ? "bg-[#fef3c7] text-[#b45309]"
                        : "bg-[#eff6ff] text-[#2563eb]"
                    }`}>
                      {log.type} ({log.quantity > 0 ? `+${log.quantity}` : log.quantity} {log.unit})
                    </span>
                    <span className="font-mono text-[10px] text-[#222a1d]/40">ID: {log.id}</span>
                  </div>
                  {log.note && (
                    <p className="mt-2 text-[11px] text-[#222a1d]/60 bg-white p-2 rounded-xl border border-[#e8ede7]">
                      {log.note}
                    </p>
                  )}
                </div>
              ))}

              {stockLogs.length === 0 && (
                <div className="py-12 text-center text-[#222a1d]/40 font-serif">
                  No stock adjustments or restock events logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
