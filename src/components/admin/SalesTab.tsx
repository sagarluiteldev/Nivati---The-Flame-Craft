"use client";

import { useState, useMemo } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  XMarkIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  PrinterIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronUpDownIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore, type Sale, type SaleItem } from "@/lib/dashboard-store";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  catalogProducts: AdminCatalogProduct[];
}

const CHANNEL_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  direct: { label: "Direct", bg: "bg-[#f1f4f1]", text: "text-[#222a1d]/80" },
  website: { label: "Website", bg: "bg-sky-100", text: "text-sky-800" },
  instagram: { label: "Instagram", bg: "bg-pink-100", text: "text-pink-800" },
  tiktok: { label: "TikTok", bg: "bg-zinc-200", text: "text-zinc-900" },
  facebook: { label: "Facebook", bg: "bg-indigo-100", text: "text-indigo-800" },
};

export default function SalesTab({ catalogProducts }: Props) {
  const { sales, addSale, updateSale, deleteSale } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  
  // Modals / Drawer state
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [saleChannel, setSaleChannel] = useState<string>("direct");
  const [saleDate, setSaleDate] = useState("");
  const [saleStatus, setSaleStatus] = useState<"pending" | "completed" | "cancelled">("completed");
  const [saleItems, setSaleItems] = useState<Omit<SaleItem, "productTitle">[]>([]);
  
  // Selected Product for item addition
  const [itemProductId, setItemProductId] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  // Filter sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        s.customerName.toLowerCase().includes(q) ||
        s.customerEmail.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.channel && s.channel.toLowerCase().includes(q)) ||
        s.items.some(
          (item) =>
            (item.productTitle && item.productTitle.toLowerCase().includes(q)) ||
            (item.productId && item.productId.toLowerCase().includes(q))
        );
        
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [sales, searchQuery, statusFilter]);

  // Sales Summary Metrics
  const summaryMetrics = useMemo(() => {
    const completed = sales.filter((s) => s.status === "completed");
    const totalGross = completed.reduce((sum, s) => sum + s.totalAmount, 0);
    const pendingCount = sales.filter((s) => s.status === "pending").length;
    const avgOrderVal = completed.length > 0 ? Math.round(totalGross / completed.length) : 0;

    return {
      totalGross,
      totalOrders: sales.length,
      pendingCount,
      avgOrderVal,
    };
  }, [sales]);

  const handleOpenNewForm = () => {
    setEditingSale(null);
    setCustomerName("");
    setCustomerEmail("");
    setSaleChannel("direct");
    setSaleDate(new Date().toISOString().split("T")[0]);
    setSaleStatus("completed");
    setSaleItems([]);
    
    if (catalogProducts.length > 0) {
      setItemProductId(catalogProducts[0].id);
      setItemPrice(Number(catalogProducts[0].price));
      setItemQuantity(1);
    }
    setIsEditorOpen(true);
  };

  const handleOpenEditForm = (sale: Sale) => {
    setEditingSale(sale);
    setCustomerName(sale.customerName);
    setCustomerEmail(sale.customerEmail);
    setSaleChannel(sale.channel || "direct");
    setSaleDate(sale.date);
    setSaleStatus(sale.status);
    setSaleItems(
      sale.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      }))
    );
    
    if (catalogProducts.length > 0) {
      setItemProductId(catalogProducts[0].id);
      setItemPrice(Number(catalogProducts[0].price));
      setItemQuantity(1);
    }
    setIsEditorOpen(true);
  };

  const handleProductChange = (id: string) => {
    setItemProductId(id);
    const prod = catalogProducts.find((p) => p.id === id);
    if (prod) {
      setItemPrice(Number(prod.price));
    }
  };

  const handleAddItem = () => {
    if (!itemProductId || itemQuantity <= 0) return;
    
    const existingIdx = saleItems.findIndex((i) => i.productId === itemProductId);
    if (existingIdx !== -1) {
      const updated = [...saleItems];
      updated[existingIdx].quantity += itemQuantity;
      setSaleItems(updated);
    } else {
      setSaleItems((prev) => [
        ...prev,
        {
          productId: itemProductId,
          quantity: itemQuantity,
          price: itemPrice,
        },
      ]);
    }
    
    setItemQuantity(1);
    if (catalogProducts.length > 0) {
      const firstProd = catalogProducts.find((p) => p.id === itemProductId) || catalogProducts[0];
      setItemPrice(Number(firstProd.price));
    }
  };

  const handleRemoveItem = (index: number) => {
    setSaleItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saleItems.length === 0) {
      alert("Please add at least one candle product to the order.");
      return;
    }

    const fullItems: SaleItem[] = saleItems.map((item) => {
      const catalogProd = catalogProducts.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productTitle: catalogProd?.title || item.productId,
        quantity: item.quantity,
        price: item.price,
      };
    });

    if (editingSale) {
      updateSale(editingSale.id, {
        customerName,
        customerEmail,
        channel: saleChannel,
        date: saleDate,
        status: saleStatus,
        items: fullItems,
      });
    } else {
      addSale({
        customerName,
        customerEmail,
        channel: saleChannel,
        date: saleDate,
        status: saleStatus,
        items: fullItems,
      });
    }
    
    setIsEditorOpen(false);
  };

  const handleDeleteSale = (id: string) => {
    if (confirm(`Move invoice ${id} to 30-Day Recycle Bin?`)) {
      deleteSale(id);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = "";
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. TOP HEADER & NEW ENTRY ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] tracking-tight">
            Sales & Invoicing Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#222a1d]/50 mt-0.5">
            Record customer orders, print authenticated receipts, and track order sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewForm}
            className="flex items-center gap-1.5 rounded-full bg-[#16a34a] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803d] shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Sale Entry</span>
          </button>
        </div>
      </div>

      {/* 2. SALES SUMMARY CARDS */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Gross Revenue */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">Gross Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-sm shadow-emerald-600/20">
              <CheckCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              Rs {summaryMetrics.totalGross.toLocaleString()}
            </span>
            <p className="mt-2 text-xs text-[#222a1d]/40">From all paid invoice settlements</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">Total Invoices</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#283322] text-white shadow-sm shadow-[#283322]/20">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              {summaryMetrics.totalOrders}
            </span>
            <p className="mt-2 text-xs text-[#222a1d]/40">Logged in live database</p>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">Pending Settlement</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97706] text-white shadow-sm shadow-amber-600/20">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              {summaryMetrics.pendingCount}
            </span>
            <p className="mt-2 text-xs text-[#222a1d]/40">Awaiting payment verification</p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">Avg Order Value</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-sm shadow-sky-600/20">
              <ShoppingBagIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              Rs {summaryMetrics.avgOrderVal.toLocaleString()}
            </span>
            <p className="mt-2 text-xs text-[#222a1d]/40">Per completed customer order</p>
          </div>
        </div>

      </div>

      {/* 3. FILTER BAR & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#e3e8e2] shadow-sm">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#222a1d]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, invoice ID, product, or channel..."
            className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
          {["all", "completed", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-[#283322] text-white shadow-xs"
                  : "bg-[#f1f4f1] text-[#222a1d]/60 hover:bg-[#e4ebe2] hover:text-[#222a1d]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* 4. SALES LEDGER: MOBILE SPACIOUS CARDS & DESKTOP TABLE */}
      <div className="rounded-3xl sm:rounded-[28px] bg-white p-4.5 sm:p-7 border border-[#e3e8e2] shadow-sm">
        
        {/* MOBILE CARD VIEW (< 768px): Click to Expand (1:1 details) / Click to Minimize (Flat 16:9) */}
        <div className="block md:hidden space-y-2.5">
          {filteredSales.map((sale) => {
            const channelInfo = CHANNEL_BADGES[sale.channel || "direct"] || CHANNEL_BADGES.direct;
            const totalUnits = sale.items.reduce((sum, item) => sum + item.quantity, 0);
            const isExpanded = expandedSaleId === sale.id;

            return (
              <div 
                key={sale.id}
                onClick={() => setExpandedSaleId(isExpanded ? null : sale.id)}
                className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isExpanded 
                    ? "border-[#283322]/40 bg-white p-4.5 space-y-4 shadow-md ring-1 ring-[#283322]/10" 
                    : "border-[#e3e8e2] bg-[#f8faf8] p-3.5 space-y-2 shadow-2xs hover:border-[#283322]/30"
                }`}
              >
                {/* 1. TOP SUMMARY BAR (Always visible, minimal flat view) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="font-mono font-bold text-xs text-[#283322] shrink-0">
                      {sale.id}
                    </span>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-bold whitespace-nowrap shrink-0 ${channelInfo.bg} ${channelInfo.text}`}>
                      {channelInfo.label}
                    </span>
                    <span className="text-xs font-bold text-[#222a1d] truncate">
                      • {sale.customerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#283322]">
                      Rs {sale.totalAmount.toLocaleString()}
                    </span>
                    <span className={`inline-block text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-2xs ${
                      sale.status === "completed"
                        ? "bg-[#15803d]"
                        : sale.status === "pending"
                        ? "bg-[#d97706]"
                        : "bg-[#dc2626]"
                    }`}>
                      {sale.status}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-white border border-[#e8ede7] flex items-center justify-center text-[#222a1d]/40">
                      <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#283322]" : ""}`} />
                    </div>
                  </div>
                </div>

                {/* 2. EXPANDED VIEW (~1:1 Full Detailed Mode) */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-[#eef2ee] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Customer & Timestamp Info */}
                    <div className="flex items-center justify-between gap-2 bg-[#f8faf8] p-3 rounded-xl border border-[#e8ede7]">
                      <div>
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Customer</span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#222a1d]">{sale.customerName}</h4>
                        <p className="text-[10px] text-[#222a1d]/50">{sale.customerEmail || "Walk-in / In-store"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Date</span>
                        <p className="font-mono text-xs text-[#222a1d] font-semibold">{sale.date}</p>
                        <span className={`inline-block rounded-full px-2 py-0.2 text-[8px] font-bold mt-0.5 ${channelInfo.bg} ${channelInfo.text}`}>
                          Via {channelInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Itemized Products List */}
                    <div className="bg-[#f8faf8] rounded-xl p-3 border border-[#e8ede7] space-y-2">
                      <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">
                        Ordered Items ({totalUnits} total)
                      </span>
                      <div className="space-y-2 divide-y divide-[#eef2ee]">
                        {sale.items.map((item, idx) => {
                          const catalogProd = catalogProducts.find((p) => p.id === item.productId);
                          const title = item.productTitle || catalogProd?.title || item.productId;
                          const img = catalogProd?.img || "";

                          return (
                            <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white border border-[#e8ede7]">
                                  {img ? (
                                    <img src={img} alt={title} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs">🕯️</div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-xs text-[#222a1d] truncate max-w-40">{title}</p>
                                  <p className="text-[10px] font-mono text-[#222a1d]/50">
                                    {item.quantity} × Rs {item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-xs text-[#222a1d] shrink-0">
                                Rs {(item.quantity * item.price).toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedSale(sale); setIsInvoiceOpen(true); }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#283322] py-2.5 text-xs font-bold text-white hover:bg-[#34422c] transition-colors cursor-pointer shadow-xs"
                      >
                        <DocumentTextIcon className="h-3.5 w-3.5" />
                        <span>View / Print Invoice</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditForm(sale); }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-white text-[#222a1d]/70 hover:bg-[#f1f4f1] transition-colors cursor-pointer shrink-0"
                        title="Edit Order"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSale(sale.id); }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Move to Recycle Bin"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSales.length === 0 && (
            <div className="py-12 text-center text-[#222a1d]/40 font-serif">
              No sales records found matching filter criteria.
            </div>
          )}
        </div>

        {/* DESKTOP DATA TABLE (>= 768px): Full wide spreadsheet table */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide -mx-5 sm:-mx-7 px-5 sm:px-7">
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                <th className="pb-3.5 pl-2">Invoice ID</th>
                <th className="pb-3.5">Customer Details</th>
                <th className="pb-3.5">Source</th>
                <th className="pb-3.5">Products Ordered</th>
                <th className="pb-3.5">Order Date</th>
                <th className="pb-3.5 text-center">Items</th>
                <th className="pb-3.5 text-right">Total Amount</th>
                <th className="pb-3.5 text-center">Status</th>
                <th className="pb-3.5 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f6f1] text-xs text-[#222a1d]">
              {filteredSales.map((sale) => {
                const channelInfo = CHANNEL_BADGES[sale.channel || "direct"] || CHANNEL_BADGES.direct;

                return (
                  <tr key={sale.id} className="hover:bg-[#f8faf8] transition-colors group">
                    
                    {/* Invoice ID */}
                    <td 
                      onClick={() => { setSelectedSale(sale); setIsInvoiceOpen(true); }}
                      className="py-4.5 sm:py-5 pl-2 font-mono font-bold text-xs cursor-pointer hover:underline text-[#283322]"
                    >
                      {sale.id}
                    </td>

                    {/* Customer */}
                    <td className="py-4.5 sm:py-5">
                      <div className="font-bold text-[#222a1d]">{sale.customerName}</div>
                      <div className="text-[10px] text-[#222a1d]/45">{sale.customerEmail || "Walk-in / In-store"}</div>
                    </td>

                    {/* Channel Source Badge */}
                    <td className="py-4.5 sm:py-5 whitespace-nowrap">
                      <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${channelInfo.bg} ${channelInfo.text}`}>
                        {channelInfo.label}
                      </span>
                    </td>

                    {/* Products Ordered (All items listed separately with thumbnails) */}
                    <td className="py-4.5 sm:py-5">
                      <div className="space-y-2 min-w-48 py-0.5">
                        {sale.items.map((item, idx) => {
                          const catalogProd = catalogProducts.find((p) => p.id === item.productId);
                          const title = item.productTitle || catalogProd?.title || item.productId;
                          const img = catalogProd?.img || "";

                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#f1f4f1] border border-[#e8ede7]">
                                {img ? (
                                  <img src={img} alt={title} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-[10px]">🕯️</div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-xs text-[#222a1d] truncate max-w-44">
                                  {title}
                                </p>
                                <p className="text-[10px] font-mono text-[#222a1d]/50">
                                  {item.quantity} × Rs {item.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4.5 sm:py-5 font-mono text-[11px] text-[#222a1d]/60">
                      {sale.date}
                    </td>

                    {/* Total Units */}
                    <td className="py-4.5 sm:py-5 text-center font-semibold">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                    </td>

                    {/* Total Amount */}
                    <td className="py-4.5 sm:py-5 text-right font-mono font-bold text-sm text-[#283322]">
                      Rs {sale.totalAmount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-4.5 sm:py-5 text-center">
                      <span className={`inline-block text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider text-white shadow-2xs ${
                        sale.status === "completed"
                          ? "bg-[#15803d]"
                          : sale.status === "pending"
                          ? "bg-[#d97706]"
                          : "bg-[#dc2626]"
                      }`}>
                        {sale.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 sm:py-5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setSelectedSale(sale); setIsInvoiceOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-[#f1f4f1] text-[#222a1d]/60 hover:text-[#222a1d] transition-colors cursor-pointer"
                          title="View Invoice"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditForm(sale)}
                          className="p-1.5 rounded-lg hover:bg-[#f1f4f1] text-[#222a1d]/60 hover:text-[#222a1d] transition-colors cursor-pointer"
                          title="Edit Order"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                          title="Move to Recycle Bin"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#222a1d]/40 font-serif">
                    No sales records found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. HIGH-FIDELITY PRINTABLE INVOICE MODAL (Matches Reference Layout) */}
      {isInvoiceOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 no-print" 
            onClick={() => setIsInvoiceOpen(false)} 
          />
          
          <div className="relative my-auto w-full max-w-2xl bg-white shadow-2xl rounded-3xl sm:rounded-[32px] border border-[#e3e8e2] overflow-hidden z-10 animate-scale-in">
            
            {/* Modal Control Bar (Screen-only, Hidden in Print) */}
            <div className="no-print flex items-center justify-between px-6 sm:px-8 py-3.5 bg-[#f8faf8] border-b border-[#eef2ee]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                <span className="font-mono text-xs font-bold text-[#283322]">
                  Invoice {selectedSale.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-full bg-[#283322] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#34422c] transition-colors cursor-pointer shadow-xs"
                >
                  <PrinterIcon className="h-3.5 w-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button 
                  onClick={() => setIsInvoiceOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#e3e8e2] text-[#222a1d]/60 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Canvas */}
            <div id="printable-invoice" className="bg-white p-7 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[700px]">
              
              <div>
                {/* 1. Header: Logo & Invoice Number */}
                <div className="flex items-start justify-between gap-4">
                  {/* Brand Logo from Original Website */}
                  <div className="flex items-center gap-3.5">
                    <img 
                      src="/images/logo.png" 
                      alt="Nivati Logo" 
                      className="h-14 w-14 sm:h-18 sm:w-18 object-contain" 
                    />
                    <div>
                      <span className="font-serif font-black tracking-widest text-xl sm:text-2xl text-[#222a1d] block leading-none">
                        NIVATI
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#222a1d]/60 block mt-1">
                        The Flame Craft
                      </span>
                    </div>
                  </div>

                  {/* Invoice Number */}
                  <div className="text-right pt-1">
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#222a1d]">
                      NO. {selectedSale.id.replace("#", "").padStart(6, "0")}
                    </span>
                  </div>
                </div>

                {/* 2. Main Title (Refined size) */}
                <h1 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#222a1d] uppercase mt-6 sm:mt-8 mb-2">
                  INVOICE
                </h1>

                {/* 3. Date */}
                <p className="text-xs sm:text-sm text-[#222a1d] mb-6 sm:mb-8 font-normal">
                  <span className="font-bold">Date:</span>{" "}
                  {selectedSale.date ? selectedSale.date : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                </p>

                {/* 4. Billed To & From Two-Column Section */}
                <div className="grid grid-cols-2 gap-6 sm:gap-12 text-xs text-[#222a1d] mb-8">
                  {/* Billed to */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-[#222a1d] uppercase tracking-wide">
                      Billed to:
                    </h4>
                    <p className="font-bold text-xs sm:text-sm text-[#222a1d] pt-0.5">
                      {selectedSale.customerName}
                    </p>
                    <p className="text-[#222a1d]/70 text-xs">
                      {selectedSale.channel ? `Order via ${CHANNEL_BADGES[selectedSale.channel]?.label || selectedSale.channel}` : "Direct Customer"}
                    </p>
                    <p className="text-[#222a1d]/60 text-xs font-mono">
                      {selectedSale.customerEmail || "walkin@customer.com"}
                    </p>
                  </div>

                  {/* From */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-[#222a1d] uppercase tracking-wide">
                      From:
                    </h4>
                    <p className="font-bold text-xs sm:text-sm text-[#222a1d] pt-0.5">
                      Nivati
                    </p>
                    <p className="text-[#222a1d]/70 text-xs">
                      Pokhara, Nepal
                    </p>
                    <p className="text-[#222a1d]/60 text-xs font-mono">
                      hello@nivaticandles.com
                    </p>
                  </div>
                </div>

                {/* 5. Items Ordered Table */}
                <div className="overflow-hidden rounded-md">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#eef2ee] text-[#222a1d] text-[11px] font-bold">
                        <th className="py-2.5 px-3.5 font-bold">Item</th>
                        <th className="py-2.5 px-3.5 text-center font-bold">Quantity</th>
                        <th className="py-2.5 px-3.5 text-right font-bold">Price</th>
                        <th className="py-2.5 px-3.5 text-right font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2f6f1]">
                      {selectedSale.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#fafbfa]">
                          <td className="py-3 px-3.5 font-semibold text-[#222a1d]">
                            {item.productTitle}
                          </td>
                          <td className="py-3 px-3.5 text-center font-mono font-medium text-[#222a1d]">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono text-[#222a1d]/70">
                            Rs {item.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-[#222a1d]">
                            Rs {(item.quantity * item.price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#e3e8e2]">
                        <td colSpan={2} className="py-3.5 px-3.5"></td>
                        <td className="py-3.5 px-3.5 text-right font-bold text-sm text-[#222a1d]">
                          Total
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono font-black text-base text-[#283322]">
                          Rs {selectedSale.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 6. Payment Method & Note */}
                <div className="mt-8 space-y-1.5 text-xs text-[#222a1d]">
                  <p>
                    <span className="font-bold">Payment method:</span>{" "}
                    <span className="capitalize">{selectedSale.status === "completed" ? "Cash / Card" : selectedSale.status === "pending" ? "Pending" : "Cancelled"}</span>
                  </p>
                  <p>
                    <span className="font-bold">Note:</span> Thank you for choosing us!
                  </p>
                </div>
              </div>

              {/* 7. Bottom Decorative Organic Wavy Curves (Website Green & Sage Theme) */}
              <div className="relative mt-12 sm:mt-16 -mx-7 sm:-mx-12 -mb-7 sm:-mb-12 overflow-hidden h-24 sm:h-32 pointer-events-none">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
                  <path 
                    d="M-20,60 C120,160 300,10 520,70 L520,150 L-20,150 Z" 
                    fill="#cad6c7" 
                    opacity="0.6"
                  />
                  <path 
                    d="M-20,95 C140,170 320,35 520,105 L520,150 L-20,150 Z" 
                    fill="#283322"
                  />
                </svg>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. CREATE / EDIT INVOICE RECORD MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#e3e8e2] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <h3 className="text-xl font-serif font-bold text-[#222a1d]">
                {editingSale ? `Edit Invoice ${editingSale.id}` : "New Sale Entry"}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              
              {/* Customer Inputs */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Customer Name *</span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                    placeholder="Aarav Sharma"
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Customer Email (Optional)</span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                    placeholder="aarav@example.com (optional)"
                  />
                </label>
              </div>

              {/* Order Date, Channel Source & Payment Status */}
              <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Order Date *</span>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full max-w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2.5 text-xs text-[#222a1d] font-mono outline-none focus:border-[#283322]/40 focus:bg-white box-border appearance-none"
                  />
                </label>
                
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Order Channel *</span>
                  <select
                    value={saleChannel}
                    onChange={(e) => setSaleChannel(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
                  >
                    <option value="direct">Direct / In-Person</option>
                    <option value="website">Website</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </label>

                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Payment Status</span>
                  <select
                    value={saleStatus}
                    onChange={(e) => setSaleStatus(e.target.value as "pending" | "completed" | "cancelled")}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
                  >
                    <option value="completed">Completed / Paid</option>
                    <option value="pending">Pending Payment</option>
                    <option value="cancelled">Cancelled / Void</option>
                  </select>
                </label>
              </div>

              {/* Items Picker and Listing */}
              <div className="border-t border-[#eef2ee] pt-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60 block">
                  Add Candle Products
                </span>
                
                {/* Item Adder Row */}
                <div className="grid gap-2 grid-cols-[1fr_70px_90px_60px] items-end">
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[9px] font-bold text-[#222a1d]/40">Product</span>
                    <select
                      value={itemProductId}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full rounded-xl border border-[#e3e8e2] bg-[#f8faf8] px-2.5 py-2 text-xs text-[#222a1d] outline-none cursor-pointer truncate"
                    >
                      {catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (Rs {Number(p.price).toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[9px] font-bold text-[#222a1d]/40">Qty</span>
                    <input
                      type="number"
                      min={1}
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#e3e8e2] bg-[#f8faf8] px-2 py-2 text-xs text-center font-mono font-bold text-[#222a1d] outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[9px] font-bold text-[#222a1d]/40">Price</span>
                    <input
                      type="number"
                      min={0}
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#e3e8e2] bg-[#f8faf8] px-2 py-2 text-xs font-mono text-[#222a1d] outline-none"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex h-9 w-full items-center justify-center rounded-xl bg-[#283322] text-xs font-bold text-white hover:bg-[#34422c] cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Items Added List */}
                <div className="rounded-2xl border border-[#e8ede7] bg-[#f8faf8] p-3 max-h-36 overflow-y-auto divide-y divide-[#e8ede7] scrollbar-hide">
                  {saleItems.map((item, idx) => {
                    const catalogItem = catalogProducts.find((p) => p.id === item.productId);
                    return (
                      <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#222a1d] truncate">{catalogItem?.title || item.productId}</p>
                          <p className="text-[9px] text-[#222a1d]/40 font-mono">ID: {item.productId}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-[#222a1d]/60">
                            {item.quantity} × Rs {item.price.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold font-mono text-[#222a1d] min-w-17.5 text-right">
                            Rs {(item.quantity * item.price).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {saleItems.length === 0 && (
                    <p className="text-center py-4 text-xs text-[#222a1d]/35 font-medium">
                      No products added to order yet.
                    </p>
                  )}
                </div>

                {/* Subtotal Preview */}
                {saleItems.length > 0 && (
                  <div className="flex justify-between items-center bg-[#f1f4f1] p-3.5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#222a1d]/60">Receipt Total</span>
                    <span className="text-base font-bold font-mono text-[#283322]">
                      Rs {saleItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#eef2ee] pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold text-[#222a1d]/50 hover:bg-[#f1f4f1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#16a34a] px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#15803d] transition-all cursor-pointer active:scale-95"
                >
                  {editingSale ? "Update Sale" : "Save Sale Entry"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
