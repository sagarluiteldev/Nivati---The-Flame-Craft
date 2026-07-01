"use client";

import { useState } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  XMarkIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  PrinterIcon 
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
  const filteredSales = sales.filter((s) => {
    const matchesSearch = 
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    
    // Check if already in list
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
    
    // Reset inputs
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
      alert("Please add at least one item to the sale.");
      return;
    }

    // Resolve product titles for store
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
      // Update
      updateSale(editingSale.id, {
        customerName,
        customerEmail,
        date: saleDate,
        status: saleStatus,
        items: fullItems,
      });
    } else {
      // Create
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
    if (confirm(`Are you sure you want to void order ${id}? This will restore its items to the stock manager.`)) {
      deleteSale(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative group max-w-md flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-olive/30 transition-colors group-focus-within:text-olive/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, clients, or invoice ID..."
              className="w-full rounded-xl border border-olive/10 bg-creme/50 px-11 py-2.5 text-sm text-olive placeholder:text-olive/20 outline-none transition-all focus:border-olive/30 focus:bg-creme"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-olive/10 bg-creme/50 px-4 py-2.5 text-sm text-olive/80 outline-none focus:border-olive/30 focus:bg-creme cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={handleOpenNewForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-olive px-6 py-3 text-xs font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusIcon className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* Orders Table List */}
      <div className="overflow-hidden rounded-2xl border border-olive/10 bg-creme/40 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-olive/10 bg-olive/[0.02] text-[10px] font-bold uppercase tracking-[0.15em] text-olive/40">
                <th className="p-4 pl-6">Invoice ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Items count</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/5 text-sm text-olive">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-olive/[0.01] transition-colors group">
                  <td 
                    onClick={() => { setSelectedSale(sale); setIsInvoiceOpen(true); }}
                    className="p-4 pl-6 font-mono font-bold text-xs cursor-pointer hover:underline text-olive/70"
                  >
                    {sale.id}
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{sale.customerName}</div>
                    <div className="text-xs text-olive/50">{sale.customerEmail}</div>
                  </td>
                  <td className="p-4 font-mono text-xs">{sale.date}</td>
                  <td className="p-4 font-medium">
                    {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </td>
                  <td className="p-4 text-right font-mono font-bold">
                    Rs {sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      sale.status === "completed"
                        ? "bg-olive/10 text-olive"
                        : sale.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setSelectedSale(sale); setIsInvoiceOpen(true); }}
                        className="p-2 rounded-lg hover:bg-olive/5 text-olive/60 hover:text-olive"
                        title="View Invoice"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditForm(sale)}
                        className="p-2 rounded-lg hover:bg-olive/5 text-olive/60 hover:text-olive"
                        title="Edit Order"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="p-2 rounded-lg hover:bg-terracotta/10 text-terracotta"
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
                  <td colSpan={7} className="p-16 text-center text-olive/40 font-serif">
                    No matching sales transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE DRAWER DETAIL VIEW */}
      {isInvoiceOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-olive/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl bg-creme p-8 shadow-2xl flex flex-col justify-between border-l border-olive/10 animate-slide-in">
            <div>
              <div className="flex items-center justify-between border-b border-olive/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-olive/40">Invoice Statement</p>
                  <h2 className="text-3xl font-serif text-olive mt-1">{selectedSale.id}</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrint}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/10 bg-creme text-olive/60 hover:text-olive transition-colors"
                    title="Print Invoice"
                  >
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setIsInvoiceOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/10 bg-creme text-olive/40 hover:text-olive transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Retail Invoice Layout */}
              <div id="printable-invoice" className="mt-8 space-y-8 font-sans">
                {/* Brand */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-serif text-olive tracking-wider uppercase">NIVATI</h1>
                    <p className="text-[9px] font-bold text-olive/30 uppercase tracking-widest mt-0.5">Organic Candles & Fragrances</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-olive">Invoice Date</p>
                    <p className="text-sm font-mono text-olive/60 mt-0.5">{selectedSale.date}</p>
                  </div>
                </div>

                {/* Bill to */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-olive/10 py-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-olive/40 uppercase tracking-widest">Billed To</h4>
                    <p className="mt-2 text-sm font-bold text-olive">{selectedSale.customerName}</p>
                    <p className="text-xs text-olive/60">{selectedSale.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] font-bold text-olive/40 uppercase tracking-widest">Payment Status</h4>
                    <span className={`inline-block mt-2 text-[9px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                      selectedSale.status === "completed"
                        ? "bg-olive/10 text-olive"
                        : selectedSale.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedSale.status}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-olive/40 uppercase tracking-widest">Order Summary</h4>
                  <table className="w-full text-left text-xs text-olive border-collapse">
                    <thead>
                      <tr className="border-b border-olive/10 text-[9px] font-bold uppercase tracking-wider text-olive/40">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Unit Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-olive/5">
                      {selectedSale.items.map((item, idx) => (
                        <tr key={idx} className="py-2">
                          <td className="py-2.5 font-medium">{item.productTitle}</td>
                          <td className="py-2.5 text-center font-bold font-mono">{item.quantity}</td>
                          <td className="py-2.5 text-right font-mono text-olive/60">Rs {item.price.toLocaleString()}</td>
                          <td className="py-2.5 text-right font-bold font-mono">Rs {(item.quantity * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Invoice Footer Total */}
                <div className="flex justify-end pt-4 border-t border-olive/10">
                  <div className="w-48 text-right space-y-1.5">
                    <div className="flex justify-between text-xs text-olive/50">
                      <span>Subtotal:</span>
                      <span className="font-mono">Rs {selectedSale.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-olive/50">
                      <span>Tax (0%):</span>
                      <span className="font-mono">Rs 0</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-olive border-t border-olive/5 pt-1.5">
                      <span>Invoice Total:</span>
                      <span className="font-mono text-base">Rs {selectedSale.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-olive/5 pt-4">
              <p className="text-[9px] text-center text-olive/30 font-medium tracking-wide">
                Thank you for supporting Nivati craft collections.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT INVOICE MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-olive/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-creme p-6 shadow-2xl border border-olive/10">
            <div className="flex items-center justify-between border-b border-olive/5 pb-4">
              <h3 className="text-xl font-serif text-olive">
                {editingSale ? `Edit Invoice ${editingSale.id}` : "Create Invoice Record"}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/5 text-olive/40 hover:text-olive"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Customer Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Customer Name</span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30"
                    placeholder="Aarav Sharma"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Customer Email</span>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30"
                    placeholder="aarav@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Order Date</span>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Payment Status</span>
                  <select
                    value={saleStatus}
                    onChange={(e) => setSaleStatus(e.target.value as "pending" | "completed" | "cancelled")}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 cursor-pointer"
                  >
                    <option value="completed">Completed / Paid</option>
                    <option value="pending">Pending Payment</option>
                    <option value="cancelled">Cancelled / Void</option>
                  </select>
                </label>
              </div>

              {/* Items Picker and Listing */}
              <div className="border-t border-olive/5 pt-4 space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-olive/40">Select Items</h4>
                
                {/* Item Adder Inputs */}
                <div className="grid gap-4 grid-cols-[1fr_80px_100px_50px] items-end">
                  <label className="block">
                    <span className="mb-1 block text-[8px] font-bold uppercase text-olive/30">Product</span>
                    <select
                      value={itemProductId}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full rounded-lg border border-olive/10 bg-creme px-3 py-2 text-xs text-olive outline-none focus:border-olive/30 cursor-pointer truncate"
                    >
                      {catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (Rs {p.price.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[8px] font-bold uppercase text-olive/30">Qty</span>
                    <input
                      type="number"
                      min={1}
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      className="w-full rounded-lg border border-olive/10 bg-creme px-3 py-2 text-xs text-olive outline-none focus:border-olive/30"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[8px] font-bold uppercase text-olive/30">Unit Price</span>
                    <input
                      type="number"
                      min={0}
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full rounded-lg border border-olive/10 bg-creme px-3 py-2 text-xs text-olive outline-none focus:border-olive/30"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex h-9 w-full items-center justify-center rounded-lg bg-olive text-creme hover:opacity-90 active:scale-95"
                  >
                    Add
                  </button>
                </div>

                {/* Items Added List */}
                <div className="rounded-xl border border-olive/5 bg-olive/[0.01] p-4 max-h-[160px] overflow-y-auto divide-y divide-olive/5 scrollbar-hide">
                  {saleItems.map((item, idx) => {
                    const catalogItem = catalogProducts.find((p) => p.id === item.productId);
                    return (
                      <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-olive truncate">{catalogItem?.title || item.productId}</p>
                          <p className="text-[9px] text-olive/40 font-mono mt-0.5">ID: {item.productId}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-olive/70 font-mono">
                            {item.quantity} x Rs {item.price.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold font-mono min-w-[70px] text-right">
                            Rs {(item.quantity * item.price).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded bg-terracotta/5 text-terracotta hover:bg-terracotta/10 transition-colors"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {saleItems.length === 0 && (
                    <p className="text-center py-6 text-xs text-olive/30 font-medium">
                      No products added to the receipt yet.
                    </p>
                  )}
                </div>

                {/* Total Preview */}
                {saleItems.length > 0 && (
                  <div className="flex justify-between items-center bg-olive/5 p-4 rounded-xl border border-olive/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-olive/50">Receipt Subtotal</span>
                    <span className="text-lg font-bold font-mono text-olive">
                      Rs {saleItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-olive/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-olive/40 hover:text-olive hover:bg-olive/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-olive px-8 py-3 text-xs font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {editingSale ? "Update Record" : "Save Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
