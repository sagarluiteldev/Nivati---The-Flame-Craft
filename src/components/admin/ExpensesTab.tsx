"use client";

import { useState, useMemo } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CircleStackIcon,
  MegaphoneIcon,
  TruckIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore, type Expense, type ExpenseCategory } from "@/lib/dashboard-store";

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  materials: "Wax & Ingredients",
  packaging: "Jars & Box Craft",
  shipping: "Shipping & Freight",
  marketing: "Advertising & Ads",
  "rent-utilities": "Rent & Utilities",
  other: "Other Expense",
};

export default function ExpensesTab() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(null);

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<ExpenseCategory>("materials");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"pending" | "paid">("paid");

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [expenses, searchQuery, categoryFilter, statusFilter]);

  // Expenses Metrics Summary
  const summaryMetrics = useMemo(() => {
    let total = 0;
    let materials = 0;
    let marketing = 0;
    let logistics = 0;

    filteredExpenses.forEach((e) => {
      total += e.amount;
      if (e.category === "materials") materials += e.amount;
      else if (e.category === "marketing") marketing += e.amount;
      else if (e.category === "shipping" || e.category === "packaging") logistics += e.amount;
    });

    return { total, materials, marketing, logistics };
  }, [filteredExpenses]);

  const handleOpenNewForm = () => {
    setEditingExpense(null);
    setTitle("");
    setAmount(0);
    setCategory("materials");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("paid");
    setIsEditorOpen(true);
  };

  const handleOpenEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setStatus(expense.status);
    setIsEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) {
      alert("Title is required and amount must be greater than zero.");
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, { title, amount, category, date, status });
    } else {
      addExpense({ title, amount, category, date, status });
    }

    setIsEditorOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm(`Are you sure you want to delete expense record ${id}?`)) {
      deleteExpense(id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. TOP HEADER & NEW ENTRY ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] tracking-tight">
            Operating Expenses Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#222a1d]/50 mt-0.5">
            Track workshop supplies, marketing spend, packaging materials, and studio overhead
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewForm}
            className="flex items-center gap-1.5 rounded-full bg-[#16a34a] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803d] shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Expense Entry</span>
          </button>
        </div>
      </div>

      {/* 2. EXPENSE SUMMARY CARDS */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Operational Costs */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Total Operating Costs
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#283322] text-white shadow-sm shadow-[#283322]/20">
              <ReceiptPercentIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              Rs {summaryMetrics.total.toLocaleString()}
            </span>
            <p className="mt-2 text-xs text-[#222a1d]/40">
              Across {filteredExpenses.length} expense entries
            </p>
          </div>
        </div>

        {/* Wax & Fragrance */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Wax & Ingredients
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-sm shadow-emerald-600/20">
              <CircleStackIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              Rs {summaryMetrics.materials.toLocaleString()}
            </span>
            <p className="mt-2 text-xs text-emerald-600 font-semibold">
              Core raw materials
            </p>
          </div>
        </div>

        {/* Marketing & Outreach */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Marketing & Outreach
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-sm shadow-blue-600/20">
              <MegaphoneIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              Rs {summaryMetrics.marketing.toLocaleString()}
            </span>
            <p className="mt-2 text-xs text-blue-600 font-semibold">
              Growth & advertising
            </p>
          </div>
        </div>

        {/* Packaging & Logistics */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Packaging & Logistics
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97706] text-white shadow-sm shadow-amber-600/20">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-[#222a1d]">
              Rs {summaryMetrics.logistics.toLocaleString()}
            </span>
            <p className="mt-2 text-xs text-amber-600 font-semibold">
              Jars, boxes & freight
            </p>
          </div>
        </div>

      </div>

      {/* 2. FILTER AND ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl sm:rounded-[28px] border border-[#e3e8e2] shadow-sm">
        
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/35 transition-colors group-focus-within:text-[#283322]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses by title or ID..."
              className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2.5 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/40 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid & Cleared</option>
            <option value="pending">Pending Payment</option>
          </select>
        </div>

        {/* Log Expense Primary Button */}
        <button
          onClick={handleOpenNewForm}
          className="flex items-center justify-center gap-2 rounded-full bg-[#283322] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#34422c] transition-all cursor-pointer w-full sm:w-auto active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* 3. EXPENSES: MOBILE SPACIOUS FLAT CARDS & DESKTOP TABLE */}
      <div className="rounded-3xl sm:rounded-[28px] bg-white p-4.5 sm:p-7 border border-[#e3e8e2] shadow-sm">
        
        {/* MOBILE CARD VIEW (< 768px): Click to Expand (1:1 details) / Click to Minimize (Flat 16:9) */}
        <div className="block md:hidden space-y-2.5">
          {filteredExpenses.map((exp) => {
            const isExpanded = expandedExpenseId === exp.id;

            return (
              <div 
                key={exp.id}
                onClick={() => setExpandedExpenseId(isExpanded ? null : exp.id)}
                className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isExpanded 
                    ? "border-[#283322]/40 bg-white p-4.5 space-y-4 shadow-md ring-1 ring-[#283322]/10" 
                    : "border-[#e3e8e2] bg-[#f8faf8] p-3.5 space-y-2 shadow-2xs hover:border-[#283322]/30"
                }`}
              >
                {/* 1. TOP SUMMARY BAR (Always visible, minimal flat view) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-xl bg-white border border-[#e8ede7] flex items-center justify-center text-xs">
                      {exp.category === "materials" ? "🕯️" : exp.category === "packaging" ? "📦" : exp.category === "shipping" ? "🚚" : exp.category === "marketing" ? "📣" : exp.category === "rent-utilities" ? "⚡" : "🧾"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#283322]">{exp.id}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#222a1d] truncate max-w-32 sm:max-w-40">{exp.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#283322]">
                      Rs {exp.amount.toLocaleString()}
                    </span>
                    <span className={`inline-block text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-2xs ${
                      exp.status === "paid"
                        ? "bg-[#15803d]"
                        : "bg-[#d97706]"
                    }`}>
                      {exp.status}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-white border border-[#e8ede7] flex items-center justify-center text-[#222a1d]/40">
                      <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#283322]" : ""}`} />
                    </div>
                  </div>
                </div>

                {/* 2. EXPANDED VIEW (~1:1 Full Detailed Mode) */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-[#eef2ee] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Expense Header Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-[#f8faf8] p-3 rounded-xl border border-[#e8ede7]">
                      <div>
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Category</span>
                        <span className="inline-block rounded-full bg-white border border-[#e8ede7] px-2.5 py-0.5 text-[9px] font-semibold text-[#222a1d]/80 mt-1">
                          {CATEGORY_LABELS[exp.category]}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Logged Date</span>
                        <span className="font-mono text-xs font-semibold text-[#222a1d] mt-1 block">
                          {exp.date}
                        </span>
                      </div>
                    </div>

                    {/* Expense Title & Big Amount Display */}
                    <div className="bg-[#f8faf8] p-3.5 rounded-xl border border-[#e8ede7] flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Operational Title</span>
                        <p className="font-bold text-sm text-[#222a1d] mt-0.5">{exp.title}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Total Cost</span>
                        <p className="font-mono font-bold text-base text-[#222a1d] mt-0.5">Rs {exp.amount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditForm(exp); }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#283322] py-2.5 text-xs font-bold text-white hover:bg-[#34422c] transition-colors cursor-pointer shadow-xs"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        <span>Edit Expense</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteExpense(exp.id); }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Delete Record"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredExpenses.length === 0 && (
            <div className="py-12 text-center text-[#222a1d]/40 font-serif">
              No operating expenses match current filters.
            </div>
          )}
        </div>

        {/* DESKTOP DATA TABLE (>= 768px): Full wide spreadsheet table */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide -mx-5 sm:-mx-7 px-5 sm:px-7">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                <th className="pb-3 pl-2">ID</th>
                <th className="pb-3">Expense Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Date Logged</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f6f1] text-xs text-[#222a1d]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#f8faf8] transition-colors group">
                  <td className="py-4 pl-2 font-mono font-bold text-xs text-[#283322]">
                    {exp.id}
                  </td>
                  <td className="py-4 font-bold text-[#222a1d]">
                    {exp.title}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    <span className="inline-block whitespace-nowrap rounded-full bg-[#f1f4f1] px-2.5 py-0.5 text-[10px] font-semibold text-[#222a1d]/70">
                      {CATEGORY_LABELS[exp.category]}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-[11px] text-[#222a1d]/60">
                    {exp.date}
                  </td>
                  <td className="py-4 text-right font-mono font-bold text-sm text-[#222a1d]">
                    Rs {exp.amount.toLocaleString()}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`inline-block text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider text-white shadow-2xs ${
                      exp.status === "paid"
                        ? "bg-[#15803d]"
                        : "bg-[#d97706]"
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditForm(exp)}
                        className="p-1.5 rounded-lg hover:bg-[#f1f4f1] text-[#222a1d]/60 hover:text-[#222a1d] transition-colors cursor-pointer"
                        title="Edit Expense"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#222a1d]/40 font-serif">
                    No operating expenses match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CREATE / EDIT EXPENSE MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#e3e8e2]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eef2ee] pb-4">
              <h3 className="text-xl font-serif font-bold text-[#222a1d]">
                {editingExpense ? `Edit Expense ${editingExpense.id}` : "Log Operating Expense"}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8faf8] text-[#222a1d]/50 hover:bg-[#283322] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Expense Title *</span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  placeholder="e.g. 50kg Organic Soy Wax Pellets"
                />
              </label>

              <div className="grid gap-4 grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Amount (Rs) *</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono font-bold text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                    placeholder="e.g. 12500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Date Logged *</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-mono text-[#222a1d] outline-none focus:border-[#283322]/40 focus:bg-white"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Expense Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#222a1d]/60">Payment Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "paid" | "pending")}
                  className="w-full rounded-2xl border border-[#e3e8e2] bg-[#f8faf8] px-4 py-2.5 text-xs font-semibold text-[#222a1d] outline-none focus:border-[#283322]/40 cursor-pointer"
                >
                  <option value="paid">Paid & Cleared</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </label>

              {/* Modal Buttons */}
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
                  {editingExpense ? "Update Expense" : "Save to Ledger"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
