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
  ChevronUpDownIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore, type Sale, type SaleItem } from "@/lib/dashboard-store";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  catalogProducts: AdminCatalogProduct[];
}

export default function SalesTab({ catalogProducts }: Props) {
  const { sales, addSale, updateSale, deleteSale } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modals / Drawer state
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
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
      const matchesSearch = 
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
        
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
    if (!itemProductId) return;
    
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
        date: saleDate,
        status: saleStatus,
        items: fullItems,
      });
    } else {
      addSale({
        customerName,
        customerEmail,
        date: saleDate,
        status: saleStatus,
        items: fullItems,
      });
    }
    
    setIsEditorOpen(false);
  };

  const handleDeleteSale = (id: string) => {
    if (confirm(`Are you sure you want to void order ${id}? Stock quantities will be automatically restored.`)) {
      deleteSale(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. SALES METRIC CARDS ROW */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Total Revenue
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#222a1d]">
            Rs {summaryMetrics.totalGross.toLocaleString()}
          </h4>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            ✓ Cleared Invoices
          </span>
        </div>

        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Total Invoices
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#222a1d]">
            {summaryMetrics.totalOrders}
          </h4>
          <span className="text-[10px] text-[#222a1d]/40 font-medium mt-1 block">
            All time ledger count
          </span>
        </div>

        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Pending Orders
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#d97706]">
            {summaryMetrics.pendingCount}
          </h4>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
            Awaiting settlement
          </span>
        </div>

        <div className="rounded-[22px] sm:rounded-[26px] bg-white p-5 border border-[#e3e8e2] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/45">
            Avg. Order Value
          </span>
          <h4 className="mt-2 text-xl sm:text-2xl font-sans font-bold text-[#222a1d]">
            Rs {summaryMetrics.avgOrderVal.toLocaleString()}
          </h4>
          <span className="text-[10px] text-[#222a1d]/40 font-medium mt-1 block">
            Per customer ticket
          </span>
        </div>
      </div>

      {/* 2. SEARCH & ACTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl sm:rounded-[28px] border border-[#e3e8e2] shadow-sm">
        
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/35 transition-colors group-focus-within:text-[#283322]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, email, or invoice ID..."
              className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2.5 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed / Paid</option>
            <option value="pending">Pending Payment</option>
            <option value="cancelled">Cancelled / Void</option>
          </select>
        </div>

        {/* Create Invoice Primary Button */}
        <button
          onClick={handleOpenNewForm}
          className="flex items-center justify-center gap-2 rounded-full bg-[#283322] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer w-full sm:w-auto active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* 3. ORDERS DATA TABLE */}
      <div className="rounded-3xl sm:rounded-[28px] bg-white p-5 sm:p-7 border border-[#e3e8e2] shadow-sm">
        <div className="overflow-x-auto scrollbar-hide -mx-5 sm:-mx-7 px-5 sm:px-7">
          <table className="w-full text-left border-collapse min-w-180">
            <thead>
              <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                <th className="pb-3 pl-2">Invoice ID</th>
                <th className="pb-3">Customer Details</th>
                <th className="pb-3">Order Date</th>
                <th className="pb-3 text-center">Items</th>
                <th className="pb-3 text-right">Total Amount</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f6f1] text-xs text-[#222a1d]">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#f8faf8] transition-colors group">
                  
                  {/* Invoice ID */}
                  <td 
                    onClick={() => { setSelectedSale(sale); setIsInvoiceOpen(true); }}
                    className="py-4 pl-2 font-mono font-bold text-xs cursor-pointer hover:underline text-[#283322]"
                  >
                    {sale.id}
                  </td>

                  {/* Customer */}
                  <td className="py-4">
                    <div className="font-bold text-[#222a1d]">{sale.customerName}</div>
                    <div className="text-[10px] text-[#222a1d]/45">{sale.customerEmail || "Walk-in / In-store"}</div>
                  </td>

                  {/* Date */}
                  <td className="py-4 font-mono text-[11px] text-[#222a1d]/60">
                    {sale.date}
                  </td>

                  {/* Items */}
                  <td className="py-4 text-center font-semibold">
                    {sale.items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                  </td>

                  {/* Total */}
                  <td className="py-4 text-right font-mono font-bold text-sm text-[#222a1d]">
                    Rs {sale.totalAmount.toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="py-4 text-center">
                    <span className={`inline-block text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                      sale.status === "completed"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : sale.status === "pending"
                        ? "bg-[#fef3c7] text-[#b45309]"
                        : "bg-[#fee2e2] text-[#b91c1c]"
                    }`}>
                      {sale.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-2 text-right">
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
                        title="Void / Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#222a1d]/40 font-serif">
                    No matching sales transactions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. LUXURY INVOICE STATEMENT DRAWER VIEW */}
      {isInvoiceOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm p-0 sm:p-4">
          <div className="h-full w-full max-w-xl bg-white p-6 sm:p-8 shadow-2xl flex flex-col justify-between border-l border-[#e3e8e2] sm:rounded-3xl animate-slide-in overflow-y-auto">
            <div>
              
              {/* Drawer Top Controls */}
              <div className="flex items-center justify-between border-b border-[#eef2ee] pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#283322] px-2 py-0.5 rounded bg-[#283322]/10">
                    Official Receipt
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] mt-1">
                    {selectedSale.id}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrint}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/70 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
                    title="Print Invoice"
                  >
                    <PrinterIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setIsInvoiceOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e8e2] bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Section */}
              <div id="printable-invoice" className="mt-6 space-y-6">
                
                {/* Brand Banner */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-serif font-bold tracking-tight text-[#222a1d]">
                      NIVATI
                    </h1>
                    <p className="text-[10px] font-semibold text-[#222a1d]/40 uppercase tracking-widest mt-0.5">
                      The Flame Craft Studio
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#222a1d]">Invoice Date</p>
                    <p className="text-xs font-mono text-[#222a1d]/60 mt-0.5">{selectedSale.date}</p>
                  </div>
                </div>

                {/* Billed To & Status */}
                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#f8faf8] p-4 border border-[#e8ede7]">
                  <div>
                    <h4 className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider">Billed To</h4>
                    <p className="mt-1 text-sm font-bold text-[#222a1d]">{selectedSale.customerName}</p>
                    <p className="text-xs text-[#222a1d]/60">{selectedSale.customerEmail || "No email provided (Walk-in)"}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider">Payment Status</h4>
                    <span className={`inline-block mt-1 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                      selectedSale.status === "completed"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : selectedSale.status === "pending"
                        ? "bg-[#fef3c7] text-[#b45309]"
                        : "bg-[#fee2e2] text-[#b91c1c]"
                    }`}>
                      {selectedSale.status}
                    </span>
                  </div>
                </div>

                {/* Items Ordered List */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-[#222a1d]/40 uppercase tracking-wider">
                    Order Items Breakdown
                  </h4>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#eef2ee] text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2f6f1]">
                      {selectedSale.items.map((item, idx) => (
                        <tr key={idx} className="py-2.5">
                          <td className="py-2.5 font-semibold text-[#222a1d]">{item.productTitle}</td>
                          <td className="py-2.5 text-center font-bold font-mono">{item.quantity}</td>
                          <td className="py-2.5 text-right font-mono text-[#222a1d]/60">Rs {item.price.toLocaleString()}</td>
                          <td className="py-2.5 text-right font-bold font-mono text-[#222a1d]">
                            Rs {(item.quantity * item.price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Calculation Card */}
                <div className="flex justify-end pt-3 border-t border-[#eef2ee]">
                  <div className="w-56 space-y-2">
                    <div className="flex justify-between text-xs text-[#222a1d]/60">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold">Rs {selectedSale.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#222a1d]/60">
                      <span>Taxes & Duties:</span>
                      <span className="font-mono font-semibold">Rs 0.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#222a1d] border-t border-[#eef2ee] pt-2">
                      <span>Grand Total:</span>
                      <span className="font-mono text-base text-[#283322]">
                        Rs {selectedSale.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 border-t border-[#eef2ee] pt-4 text-center">
              <p className="text-[10px] text-[#222a1d]/35 font-medium">
                Nivati Organic Candleworks • Authenticated Sales Record
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE / EDIT INVOICE RECORD MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#e3e8e2]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <h3 className="text-xl font-serif font-bold text-[#222a1d]">
                {editingSale ? `Edit Invoice ${editingSale.id}` : "Create New Invoice"}
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
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
                <label className="block">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Order Date *</span>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] font-mono outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Payment Status</span>
                  <select
                    value={saleStatus}
                    onChange={(e) => setSaleStatus(e.target.value as "pending" | "completed" | "cancelled")}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
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
                  <label className="block">
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
                  className="rounded-full px-5 py-2 text-xs font-semibold text-[#222a1d]/50 hover:bg-[#f1f4f1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#283322] px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer active:scale-95"
                >
                  {editingSale ? "Update Invoice" : "Save & Deduct Stock"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
