"use client";

import { useState, useMemo } from "react";
import { 
  ArrowTrendingUpIcon, 
  BanknotesIcon, 
  ShoppingBagIcon, 
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  UserGroupIcon,
  ReceiptPercentIcon,
  DocumentTextIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/lib/dashboard-store";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  catalogProducts: AdminCatalogProduct[];
  setActiveTab: (tab: string) => void;
  timeRange?: string;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function OverviewTab({ catalogProducts, setActiveTab, timeRange = "This Month" }: Props) {
  const { sales, expenses, rawMaterials } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "customer">("date");
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(7); // Default to August (idx 7)
  const [performanceFilter, setPerformanceFilter] = useState("This Year");
  const [isPerfFilterOpen, setIsPerfFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // 1. Calculate Real KPI Metrics from Database
  const metrics = useMemo(() => {
    const completedSales = sales.filter((s) => s.status === "completed");
    
    // Gross Revenue (completed sales)
    const totalRevenue = completedSales.reduce((sum, s) => sum + s.totalAmount, 0);

    // Total Operating Expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Net Profit & Margin
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Total units sold across all completed orders
    const totalUnitsSold = completedSales.reduce(
      (sum, s) => sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0),
      0
    );

    // Total Orders count
    const totalOrdersCount = sales.length;

    // Raw Materials Valuation
    const rawMaterialsValuation = rawMaterials.reduce(
      (sum, m) => sum + (m.stockLevel * m.unitCost), 
      0
    );

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      totalUnitsSold,
      totalOrdersCount,
      rawMaterialsValuation,
    };
  }, [sales, expenses, rawMaterials]);

  // 2. Real Monthly Performance Calculation (May - Dec)
  const currentMonthKey = useMemo(() => {
    const currentMonthNum = new Date().getMonth() + 1;
    return currentMonthNum < 10 ? `0${currentMonthNum}` : `${currentMonthNum}`;
  }, []);

  const monthsData = useMemo(() => {
    // Generate 8 active tracking months (May to Dec)
    const months = [
      { key: "05", name: "May", defaultPct: 45 },
      { key: "06", name: "Jun", defaultPct: 35 },
      { key: "07", name: "Jul", defaultPct: 40 },
      { key: "08", name: "Aug", defaultPct: 82 },
      { key: "09", name: "Sep", defaultPct: 30 },
      { key: "10", name: "Oct", defaultPct: 52 },
      { key: "11", name: "Nov", defaultPct: 68 },
      { key: "12", name: "Dec", defaultPct: 38 },
    ];

    // Compute monthly actuals from database sales
    const monthlyStats = months.map((m) => {
      const monthSales = sales.filter((s) => {
        if (s.status !== "completed") return false;
        const sMonth = s.date.split("-")[1];
        return sMonth === m.key;
      });

      const revenue = monthSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const units = monthSales.reduce((sum, s) => sum + s.items.reduce((acc, i) => acc + i.quantity, 0), 0);

      return {
        month: m.name,
        key: m.key,
        sales: units,
        revenue,
        defaultPct: m.defaultPct,
        isCurrent: m.key === currentMonthKey,
      };
    });

    const maxRevenue = Math.max(...monthlyStats.map((m) => m.revenue), 0);

    return monthlyStats.map((item) => {
      const heightPct = maxRevenue > 0 && item.revenue > 0
        ? Math.max(20, Math.round((item.revenue / maxRevenue) * 90))
        : (item.revenue > 0 ? 82 : item.defaultPct);

      return {
        ...item,
        heightPct,
      };
    });
  }, [sales, currentMonthKey]);

  // 3. Filtered & Sorted Recent Orders List from Database
  const recentOrders = useMemo(() => {
    const list = sales.map((s) => {
      const firstItem = s.items[0];
      const product = firstItem ? catalogProducts.find((p) => p.id === firstItem.productId) : null;
      const categoryStr = product?.category ? (Array.isArray(product.category) ? product.category[0] : product.category) : "Candles";
      
      return {
        id: s.id,
        customerName: s.customerName,
        customerEmail: s.customerEmail,
        date: s.date,
        totalAmount: s.totalAmount,
        status: s.status,
        itemCount: s.items.reduce((sum, item) => sum + item.quantity, 0),
        firstProductTitle: product?.title || firstItem?.productTitle || "Custom Candle Order",
        firstProductImg: product?.img || "",
        category: categoryStr,
      };
    });

    // Search filter
    const filtered = list.filter((order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.firstProductTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "amount") return b.totalAmount - a.totalAmount;
      if (sortBy === "customer") return a.customerName.localeCompare(b.customerName);
      return b.date.localeCompare(a.date);
    });
  }, [sales, catalogProducts, searchQuery, sortBy]);

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllOrders = () => {
    if (selectedOrders.length === recentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(recentOrders.map((o) => o.id));
    }
  };

  const selectedMonth = monthsData[selectedMonthIdx] || monthsData[3];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] tracking-tight">
            Sales Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#222a1d]/50 mt-0.5">
            Live metrics aggregated directly from your Supabase database
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("sales")}
            className="flex items-center gap-1.5 rounded-full bg-[#283322] px-4 py-2 text-xs font-bold text-white hover:bg-[#34422c] shadow-sm transition-all cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Sale Entry</span>
          </button>
        </div>
      </div>

      {/* 1. KEY METRIC CARDS ROW (Live Database Driven) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Primary Dark Green Highlight Card */}
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[28px] bg-linear-to-br from-[#242c1e] via-[#2c3725] to-[#384630] p-6 text-white shadow-xl shadow-[#283322]/15 transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80 tracking-wide">
              Total Units Sold
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#283322] shadow-sm">
              <ShoppingBagIcon className="h-5 w-5 text-[#283322]" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
                {metrics.totalUnitsSold.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold text-[#d4e5ce]">
                <ArrowTrendingUpIcon className="h-3 w-3" /> Live
              </span>
            </div>
            <p className="mt-3 text-xs text-white/60 font-medium">
              Gross Volume: Rs {metrics.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Total Orders Logged
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7] text-[#d97706]">
              <UserGroupIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222a1d] font-sans">
                {metrics.totalOrdersCount}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-bold text-[#2563eb]">
                Invoices
              </span>
            </div>
            <p className="mt-3 text-xs text-[#222a1d]/40 font-medium">
              {sales.filter((s) => s.status === "completed").length} paid & completed
            </p>
          </div>
        </div>

        {/* Card 3: Operating Costs / Expenses */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Operating Costs
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f2fe] text-[#0284c7]">
              <ReceiptPercentIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222a1d] font-sans">
                Rs {metrics.totalExpenses.toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#222a1d]/40 font-medium">
              Across {expenses.length} ledgered entries
            </p>
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Net Profit
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
              <BanknotesIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className={`text-3xl sm:text-4xl font-bold tracking-tight font-sans ${metrics.netProfit >= 0 ? "text-[#222a1d]" : "text-red-600"}`}>
                Rs {metrics.netProfit.toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#222a1d]/40 font-medium">
              Profit Margin: {metrics.profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: PERFORMANCE OVERVIEW + SALES OVERVIEW GAUGE */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
        
        {/* Left: Performance Overview Bar Chart */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 sm:p-7 border border-[#e3e8e2] shadow-sm flex flex-col justify-between">
          
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#222a1d]">
                Performance Overview
              </h2>
              <p className="text-xs text-[#222a1d]/40 mt-0.5">
                Monthly revenue & shipment units trajectory
              </p>
            </div>

            {/* Time Filter Pill */}
            <div className="relative">
              <button
                onClick={() => setIsPerfFilterOpen(!isPerfFilterOpen)}
                className="flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3.5 py-1.5 text-xs font-semibold text-[#222a1d] hover:border-[#283322]/30 transition-all cursor-pointer"
              >
                <span>{performanceFilter}</span>
                <ChevronUpDownIcon className="h-3.5 w-3.5 text-[#222a1d]/50" />
              </button>

              {isPerfFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsPerfFilterOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 z-30 w-32 rounded-2xl bg-white p-1 shadow-xl border border-[#e3e8e2] text-xs">
                    {["This Year", "All Time"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setPerformanceFilter(opt);
                          setIsPerfFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                          performanceFilter === opt
                            ? "bg-[#283322] text-white"
                            : "text-[#222a1d]/70 hover:bg-[#f1f4f1] hover:text-[#222a1d]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bar Chart Visualization Container */}
          <div className="relative w-full pt-4 pb-2">
            
            {/* Horizontal Dashed Gridlines & Y-Axis Scale */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pr-2">
              {["50k", "30k", "20k", "10k", "5k", "0k"].map((label, i) => (
                <div key={i} className="flex items-center w-full gap-3 text-[10px] text-[#222a1d]/30 font-medium">
                  <span className="w-6 text-right shrink-0">{label}</span>
                  <div className="w-full border-b border-dashed border-[#e4eae3]" />
                </div>
              ))}
            </div>

            {/* Vertical Rounded Bars Container */}
            <div className="relative z-10 grid grid-cols-8 gap-2 sm:gap-4 h-60 items-end pl-9 pr-2 pb-8">
              {monthsData.map((item, idx) => {
                const isSelected = selectedMonthIdx === idx;
                const hasData = item.revenue > 0 || item.sales > 0;

                return (
                  <div 
                    key={item.month} 
                    className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                    onClick={() => setSelectedMonthIdx(idx)}
                  >
                    {/* Interactive Floating Tooltip Card */}
                    {isSelected && (
                      <div className="absolute bottom-[85%] z-30 mb-2 w-36 sm:w-40 rounded-2xl bg-white p-3 shadow-xl border border-[#e3e8e2] text-left animate-fade-in pointer-events-none">
                        <p className="text-[11px] font-bold text-[#222a1d]">
                          {item.month} 2026
                        </p>
                        <div className="mt-2 space-y-1 text-[10px]">
                          <div className="flex items-center justify-between text-[#222a1d]/60">
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8]" />
                              Units Sold
                            </span>
                            <span className="font-bold text-[#222a1d]">{item.sales}</span>
                          </div>
                          <div className="flex items-center justify-between text-[#222a1d]/60">
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#283322]" />
                              Revenue
                            </span>
                            <span className="font-bold text-[#283322]">
                              Rs {item.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bar Pillar */}
                    <div className="w-full flex justify-center items-end h-full">
                      <div
                        style={{ height: `${item.heightPct}%` }}
                        className={`w-full max-w-12 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-y-[1.03] ${
                          item.isCurrent
                            ? "bg-linear-to-t from-[#242c1e] to-[#45573b] shadow-lg shadow-[#283322]/20"
                            : isSelected
                            ? "bg-[#283322]/25 ring-2 ring-[#283322]/40"
                            : "bg-[#e8ede7] hover:bg-[#dbe2da]"
                        }`}
                      />
                    </div>

                    {/* X-Axis Month Label */}
                    <span className={`absolute -bottom-6 text-xs font-semibold transition-colors ${
                      item.isCurrent ? "text-[#283322] font-bold" : isSelected ? "text-[#283322]" : "text-[#222a1d]/40"
                    }`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Legend Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#f0f4ef] text-xs text-[#222a1d]/50">
            <span className="font-medium">
              Click any bar to preview month metrics
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-[#283322]">
                <span className="h-2 w-2 rounded-full bg-[#283322]" /> Current Month
              </span>
              <span className="flex items-center gap-1.5 text-[#222a1d]/50">
                <span className="h-2 w-2 rounded-full bg-[#e8ede7]" /> Other Months
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sales Overview Radial Arc Gauge */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 sm:p-7 border border-[#e3e8e2] shadow-sm flex flex-col justify-between">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#222a1d]">
                Margin Health
              </h2>
              <p className="text-xs text-[#222a1d]/40 mt-0.5">
                Profit margin & cost efficiency index
              </p>
            </div>
            <button 
              onClick={() => setActiveTab("sales")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#222a1d]/40 hover:bg-[#f1f4f1] hover:text-[#222a1d] transition-colors"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Semi-Circular Radial Gauge Graphic */}
          <div className="relative flex flex-col items-center justify-center my-4">
            <svg 
              viewBox="0 0 240 140" 
              className="w-full max-w-60 overflow-visible"
            >
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = 180 + (i * (180 / 17));
                const rad = (angle * Math.PI) / 180;
                const rInner = 82;
                const rOuter = 104;
                const cx = 120;
                const cy = 125;

                const x1 = cx + rInner * Math.cos(rad);
                const y1 = cy + rInner * Math.sin(rad);
                const x2 = cx + rOuter * Math.cos(rad);
                const y2 = cy + rOuter * Math.sin(rad);

                const activeSegments = Math.round((Math.max(0, Math.min(100, metrics.profitMargin)) / 100) * 18);
                const isActive = i <= activeSegments;

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isActive ? (i > 13 ? "#f59e0b" : "#283322") : "#e8ede7"}
                    strokeWidth="7"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Gauge Center Text */}
            <div className="text-center -mt-8">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222a1d] font-sans">
                {metrics.profitMargin.toFixed(1)}%
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#222a1d]/40 mt-1">
                Net Margin
              </p>
            </div>
          </div>

          {/* Bottom Split Sub-Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            
            {/* Number of Sales */}
            <div className="rounded-2xl bg-[#f8faf8] p-3.5 border border-[#e8ede7]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#222a1d]/45 block">
                Total Orders
              </span>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-base sm:text-lg font-bold font-sans text-[#222a1d]">
                  {metrics.totalOrdersCount}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-1.5 py-0.5 text-[10px] font-bold text-[#d97706]">
                  Live
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="rounded-2xl bg-[#f8faf8] p-3.5 border border-[#e8ede7]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#222a1d]/45 block">
                Gross Revenue
              </span>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-base sm:text-lg font-bold font-sans text-[#222a1d] truncate">
                  Rs {metrics.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. BOTTOM SECTION: RECENT ORDERS TABLE */}
      <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 sm:p-7 border border-[#e3e8e2] shadow-sm">
        
        {/* Table Top Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#222a1d]">
              Recent Orders
            </h2>
            <p className="text-xs text-[#222a1d]/40 mt-0.5">
              Live customer transactions and invoice records in database
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#222a1d]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full rounded-full border border-[#e3e8e2] bg-[#f8faf8] pl-10 pr-4 py-2 text-xs text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none focus:border-[#283322]/40 focus:bg-white transition-all"
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-[#e3e8e2] bg-white px-3.5 py-2 text-xs font-semibold text-[#222a1d] hover:border-[#283322]/30 transition-all cursor-pointer"
              >
                <ChevronUpDownIcon className="h-3.5 w-3.5 text-[#222a1d]/50" />
                <span>Sort by</span>
              </button>

              {isSortDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsSortDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 z-30 w-36 rounded-2xl bg-white p-1 shadow-xl border border-[#e3e8e2] text-xs">
                    <button
                      onClick={() => { setSortBy("date"); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl font-medium ${sortBy === "date" ? "bg-[#283322] text-white" : "hover:bg-[#f1f4f1]"}`}
                    >
                      Latest Date
                    </button>
                    <button
                      onClick={() => { setSortBy("amount"); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl font-medium ${sortBy === "amount" ? "bg-[#283322] text-white" : "hover:bg-[#f1f4f1]"}`}
                    >
                      Highest Amount
                    </button>
                    <button
                      onClick={() => { setSortBy("customer"); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl font-medium ${sortBy === "customer" ? "bg-[#283322] text-white" : "hover:bg-[#f1f4f1]"}`}
                    >
                      Customer Name
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto scrollbar-hide -mx-6 sm:-mx-7 px-6 sm:px-7">
          <table className="w-full text-left border-collapse min-w-190">
            <thead>
              <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                <th className="pb-3 pl-2 w-8">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length > 0 && selectedOrders.length === recentOrders.length}
                    onChange={toggleSelectAllOrders}
                    className="h-4 w-4 rounded border-[#d4ded3] text-[#283322] focus:ring-[#283322]"
                  />
                </th>
                <th className="pb-3">Product info</th>
                <th className="pb-3">Order Id</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-center">Items</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f6f1] text-xs text-[#222a1d]">
              {recentOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id);

                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-[#f8faf8] transition-colors group cursor-pointer"
                    onClick={() => setActiveTab("sales")}
                  >
                    <td className="py-4 pl-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="h-4 w-4 rounded border-[#d4ded3] text-[#283322] focus:ring-[#283322]"
                      />
                    </td>

                    {/* Product Info */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#f1f4f1] border border-[#e8ede7]">
                          {order.firstProductImg ? (
                            <img 
                              src={order.firstProductImg} 
                              alt={order.firstProductTitle} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[#283322]/30 font-serif text-sm">
                              🕯️
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#222a1d] line-clamp-1 max-w-40">
                            {order.firstProductTitle}
                          </p>
                          <p className="text-[10px] text-[#222a1d]/40">
                            Handcrafted candle
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="py-4 font-mono font-bold text-xs text-[#283322]">
                      {order.id}
                    </td>

                    {/* Date */}
                    <td className="py-4 text-[#222a1d]/60 font-mono text-[11px]">
                      {order.date}
                    </td>

                    {/* Customer Details */}
                    <td className="py-4">
                      <p className="font-bold text-[#222a1d]">{order.customerName}</p>
                      <p className="text-[10px] text-[#222a1d]/40 truncate max-w-35">{order.customerEmail || "Walk-in"}</p>
                    </td>

                    {/* Category */}
                    <td className="py-4">
                      <span className="inline-block rounded-full bg-[#f1f4f1] px-2.5 py-0.5 text-[10px] font-semibold text-[#222a1d]/70">
                        {order.category}
                      </span>
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-4 text-center">
                      <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        order.status === "completed"
                          ? "bg-[#dcfce7] text-[#15803d]"
                          : order.status === "pending"
                          ? "bg-[#fef3c7] text-[#b45309]"
                          : "bg-[#fee2e2] text-[#b91c1c]"
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Items count */}
                    <td className="py-4 text-center font-bold font-mono">
                      {order.itemCount}
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 text-right font-bold font-mono text-sm text-[#222a1d]">
                      Rs {order.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#222a1d]/40 font-serif">
                    No orders entered yet. Create an invoice in the Sales Ledger to log your first order!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Action */}
        <div className="flex items-center justify-between pt-6 border-t border-[#f0f4ef] text-xs">
          <span className="text-[#222a1d]/50">
            Showing {recentOrders.length} database entries
          </span>
          <button
            onClick={() => setActiveTab("sales")}
            className="font-bold text-[#283322] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Sales Ledger</span>
            <span>→</span>
          </button>
        </div>
      </div>

    </div>
  );
}
