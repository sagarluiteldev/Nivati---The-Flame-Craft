"use client";

import { useState, useMemo } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon 
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
    let logistics = 0; // shipping + packaging

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
      alert("Title is required and amount must be positive.");
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
    <div className="space-y-6">
      {/* Metrics Summary Card */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-xl border border-olive/5 bg-creme/50 p-4 shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-wider text-olive/40">Total Ledgered</span>
          <h4 className="mt-1 text-lg font-sans font-bold text-olive">Rs {summaryMetrics.total.toLocaleString()}</h4>
        </div>
        <div className="rounded-xl border border-olive/5 bg-creme/50 p-4 shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-wider text-olive/40">Wax & Ingredients</span>
          <h4 className="mt-1 text-lg font-sans font-bold text-olive">Rs {summaryMetrics.materials.toLocaleString()}</h4>
        </div>
        <div className="rounded-xl border border-olive/5 bg-creme/50 p-4 shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-wider text-olive/40">Marketing & Ads</span>
          <h4 className="mt-1 text-lg font-sans font-bold text-olive">Rs {summaryMetrics.marketing.toLocaleString()}</h4>
        </div>
        <div className="rounded-xl border border-olive/5 bg-creme/50 p-4 shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-wider text-olive/40">Logistics & Freight</span>
          <h4 className="mt-1 text-lg font-sans font-bold text-olive">Rs {summaryMetrics.logistics.toLocaleString()}</h4>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative group max-w-md flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-olive/30 transition-colors group-focus-within:text-olive/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses..."
              className="w-full rounded-xl border border-olive/10 bg-creme/50 px-11 py-2.5 text-sm text-olive placeholder:text-olive/20 outline-none transition-all focus:border-olive/30 focus:bg-creme"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-olive/10 bg-creme/50 px-4 py-2.5 text-sm text-olive/80 outline-none focus:border-olive/30 focus:bg-creme cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-olive/10 bg-creme/50 px-4 py-2.5 text-sm text-olive/80 outline-none focus:border-olive/30 focus:bg-creme cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          onClick={handleOpenNewForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-olive px-6 py-3 text-xs font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusIcon className="h-4 w-4" />
          Log Expense
        </button>
      </div>

      {/* Expenses Grid / Table */}
      <div className="overflow-hidden rounded-2xl border border-olive/10 bg-creme/40 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-olive/10 bg-olive/[0.02] text-[10px] font-bold uppercase tracking-[0.15em] text-olive/40">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Expense Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date logged</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive/5 text-sm text-olive">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-olive/[0.01] transition-colors group">
                  <td className="p-4 pl-6 font-mono text-xs text-olive/50">{exp.id}</td>
                  <td className="p-4 font-bold">{exp.title}</td>
                  <td className="p-4 text-xs font-semibold text-olive/70">
                    <span className="rounded-md border border-olive/10 bg-creme/50 px-2.5 py-1">
                      {CATEGORY_LABELS[exp.category]}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">{exp.date}</td>
                  <td className="p-4 text-right font-mono font-bold text-terracotta">
                    Rs {exp.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      exp.status === "paid"
                        ? "bg-olive/10 text-olive"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditForm(exp)}
                        className="p-2 rounded-lg hover:bg-olive/5 text-olive/60 hover:text-olive"
                        title="Edit Expense"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-2 rounded-lg hover:bg-terracotta/10 text-terracotta"
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
                  <td colSpan={7} className="p-16 text-center text-olive/40 font-serif">
                    No expense items logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT EXPENSE FORM MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-olive/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-creme p-6 shadow-2xl border border-olive/10">
            <div className="flex items-center justify-between border-b border-olive/5 pb-4">
              <h3 className="text-xl font-serif text-olive">
                {editingExpense ? `Edit Expense ${editingExpense.id}` : "Log Expense Details"}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/5 text-olive/40 hover:text-olive"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Expense Title</span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30"
                  placeholder="e.g. Amber jars batch buy"
                />
              </label>

              <div className="grid gap-4 grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Amount (Rs)</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                    placeholder="e.g. 5000"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Date Logged</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 font-mono"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 cursor-pointer"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-olive/40">Payment Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "paid" | "pending")}
                  className="w-full rounded-lg border border-olive/10 bg-creme px-4 py-2.5 text-sm text-olive outline-none focus:border-olive/30 cursor-pointer"
                >
                  <option value="paid">Paid & Cleared</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </label>

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
                  {editingExpense ? "Update Expense" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
