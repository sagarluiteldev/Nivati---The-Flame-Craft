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
  PlusIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/lib/dashboard-store";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  catalogProducts: AdminCatalogProduct[];
  setActiveTab: (tab: string) => void;
  timeRange?: string;
  setTimeRange?: (range: string) => void;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 21-step mathematically continuous chromatic power spectrum (0° Red -> 142° Lush Emerald Green)
const GAUGE_POWER_COLORS = [
  "hsl(0, 88%, 50%)",    // 0: Pure Crimson Red (0.0°)
  "hsl(7.1, 87%, 50%)",  // 1: Rose Crimson (7.1°)
  "hsl(14.2, 86%, 50%)", // 2: Coral Red (14.2°)
  "hsl(21.3, 85%, 50%)", // 3: Deep Orange-Red (21.3°)
  "hsl(28.4, 84%, 50%)", // 4: Vibrant Orange (28.4°)
  "hsl(35.5, 83%, 50%)", // 5: Warm Tangerine (35.5°)
  "hsl(42.6, 82%, 49%)", // 6: Deep Honey Amber (42.6°)
  "hsl(49.7, 81%, 48%)", // 7: Golden Amber (49.7°)
  "hsl(56.8, 80%, 47%)", // 8: Warm Sunflower Yellow (56.8°)
  "hsl(63.9, 79%, 46%)", // 9: Golden Lemon Yellow (63.9°)
  "hsl(71.0, 78%, 45%)", // 10: Chartreuse Apex (71.0°)
  "hsl(78.1, 77%, 45%)", // 11: Electric Lime (78.1°)
  "hsl(85.2, 76%, 45%)", // 12: Bright Leaf Lime (85.2°)
  "hsl(92.3, 75%, 45%)", // 13: Spring Lime (92.3°)
  "hsl(99.4, 74%, 44%)", // 14: Fresh Meadow Green (99.4°)
  "hsl(106.5, 73%, 43%)",// 15: Vibrant Spring Green (106.5°)
  "hsl(113.6, 72%, 42%)",// 16: Bright Leaf Green (113.6°)
  "hsl(120.7, 72%, 41%)",// 17: Vibrant Emerald (120.7°)
  "hsl(127.8, 71%, 40%)",// 18: Rich Emerald (127.8°)
  "hsl(134.9, 71%, 39%)",// 19: Deep Emerald Green (134.9°)
  "hsl(142.0, 72%, 38%)",// 20: Lush Forest Emerald (142.0°)
];

export default function OverviewTab({ 
  catalogProducts, 
  setActiveTab, 
  timeRange = "This Month",
  setTimeRange 
}: Props) {
  const { sales, expenses, rawMaterials } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "customer">("date");
  const [isPerfFilterOpen, setIsPerfFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleTimeRangeSelect = (newRange: string) => {
    if (setTimeRange) {
      setTimeRange(newRange);
    }
    setIsPerfFilterOpen(false);
  };

  // 1. Calculate Real KPI Metrics dynamically filtered by active timeRange
  const metrics = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0 to 11

    // Filter sales and expenses by timeRange
    const timeFilteredSales = sales.filter((s) => {
      if (!s.date) return true;
      const [sYear, sMonth, sDay] = s.date.split("-").map(Number);
      const sDate = new Date(s.date);

      if (timeRange === "This Week") {
        const dayOfWeek = today.getDay();
        const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const mon = new Date(today);
        mon.setDate(today.getDate() + diffToMon);
        mon.setHours(0, 0, 0, 0);

        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        sun.setHours(23, 59, 59, 999);

        return sDate >= mon && sDate <= sun;
      }
      if (timeRange === "This Month") {
        return sYear === currentYear && sMonth === currentMonth + 1;
      }
      if (timeRange === "This Quarter") {
        const quarterNum = Math.floor(currentMonth / 3) + 1;
        const qStart = (quarterNum - 1) * 3 + 1;
        const qEnd = qStart + 2;
        return sYear === currentYear && sMonth >= qStart && sMonth <= qEnd;
      }
      return true; // All Time
    });

    const timeFilteredExpenses = expenses.filter((e) => {
      if (!e.date) return true;
      const [eYear, eMonth, eDay] = e.date.split("-").map(Number);
      const eDate = new Date(e.date);

      if (timeRange === "This Week") {
        const dayOfWeek = today.getDay();
        const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const mon = new Date(today);
        mon.setDate(today.getDate() + diffToMon);
        mon.setHours(0, 0, 0, 0);

        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        sun.setHours(23, 59, 59, 999);

        return eDate >= mon && eDate <= sun;
      }
      if (timeRange === "This Month") {
        return eYear === currentYear && eMonth === currentMonth + 1;
      }
      if (timeRange === "This Quarter") {
        const quarterNum = Math.floor(currentMonth / 3) + 1;
        const qStart = (quarterNum - 1) * 3 + 1;
        const qEnd = qStart + 2;
        return eYear === currentYear && eMonth >= qStart && eMonth <= qEnd;
      }
      return true; // All Time
    });

    const completedSales = timeFilteredSales.filter((s) => s.status === "completed");
    const totalRevenue = completedSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = timeFilteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : (totalExpenses > 0 ? -100 : 0);
    const totalUnitsSold = completedSales.reduce(
      (sum, s) => sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0),
      0
    );
    const totalOrdersCount = timeFilteredSales.length;

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
  }, [sales, expenses, rawMaterials, timeRange]);

  // 2. Dynamic Synchronized Performance Bar Chart (Week / Month / Quarter / All Time)
  const { chartBars, yAxisLabels, chartSubtitle } = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0 to 11
    const todayDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    let bars: Array<{
      key: string;
      label: string;
      sublabel: string;
      sales: number;
      revenue: number;
      isCurrent: boolean;
      heightPct: number;
    }> = [];

    let subtitle = "Monthly revenue & shipment units trajectory";

    if (timeRange === "This Week") {
      subtitle = "Daily revenue & shipment units across the current week";
      
      const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
      const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMon);

      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      bars = dayNames.map((dName, idx) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + idx);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${day}`;

        const daySales = sales.filter(s => s.status === "completed" && s.date === dateStr);
        const revenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
        const units = daySales.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);

        return {
          key: dateStr,
          label: dName,
          sublabel: `${dName}, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          sales: units,
          revenue,
          isCurrent: dateStr === todayDateStr,
          heightPct: 0,
        };
      });

    } else if (timeRange === "This Month") {
      const monthName = MONTH_NAMES[currentMonth];
      subtitle = `Weekly breakdown for ${monthName} ${currentYear}`;
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const currentDay = today.getDate();

      const weekIntervals = [
        { label: "W1 (1-7)", start: 1, end: 7 },
        { label: "W2 (8-14)", start: 8, end: 14 },
        { label: "W3 (15-21)", start: 15, end: 21 },
        { label: "W4 (22-28)", start: 22, end: 28 },
      ];
      if (daysInMonth > 28) {
        weekIntervals.push({ label: `W5 (29-${daysInMonth})`, start: 29, end: daysInMonth });
      }

      bars = weekIntervals.map((interval) => {
        const intervalSales = sales.filter((s) => {
          if (s.status !== "completed") return false;
          const [sYear, sMonth, sDay] = s.date.split("-").map(Number);
          return sYear === currentYear && sMonth === currentMonth + 1 && sDay >= interval.start && sDay <= interval.end;
        });

        const revenue = intervalSales.reduce((sum, s) => sum + s.totalAmount, 0);
        const units = intervalSales.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);
        const isCurrent = currentDay >= interval.start && currentDay <= interval.end;

        return {
          key: interval.label,
          label: interval.label,
          sublabel: `${monthName} ${interval.start} - ${interval.end}`,
          sales: units,
          revenue,
          isCurrent,
          heightPct: 0,
        };
      });

    } else if (timeRange === "This Quarter") {
      const quarterNum = Math.floor(currentMonth / 3) + 1;
      const qStartMonth = (quarterNum - 1) * 3;
      subtitle = `Quarter ${quarterNum} (${MONTH_NAMES[qStartMonth]} – ${MONTH_NAMES[qStartMonth + 2]} ${currentYear})`;

      const periods = [
        { label: `${MONTH_NAMES[qStartMonth]} 1-15`, month: qStartMonth + 1, start: 1, end: 15 },
        { label: `${MONTH_NAMES[qStartMonth]} 16+`, month: qStartMonth + 1, start: 16, end: 31 },
        { label: `${MONTH_NAMES[qStartMonth + 1]} 1-15`, month: qStartMonth + 2, start: 1, end: 15 },
        { label: `${MONTH_NAMES[qStartMonth + 1]} 16+`, month: qStartMonth + 2, start: 16, end: 31 },
        { label: `${MONTH_NAMES[qStartMonth + 2]} 1-15`, month: qStartMonth + 3, start: 1, end: 15 },
        { label: `${MONTH_NAMES[qStartMonth + 2]} 16+`, month: qStartMonth + 3, start: 16, end: 31 },
      ];

      const curDay = today.getDate();

      bars = periods.map((period) => {
        const pSales = sales.filter((s) => {
          if (s.status !== "completed") return false;
          const [sYear, sMonth, sDay] = s.date.split("-").map(Number);
          return sYear === currentYear && sMonth === period.month && sDay >= period.start && sDay <= period.end;
        });

        const revenue = pSales.reduce((sum, s) => sum + s.totalAmount, 0);
        const units = pSales.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);
        const isCurrent = (currentMonth + 1 === period.month) && (period.start === 1 ? curDay <= 15 : curDay >= 16);

        return {
          key: period.label,
          label: period.label,
          sublabel: `${period.label}, ${currentYear}`,
          sales: units,
          revenue,
          isCurrent,
          heightPct: 0,
        };
      });

    } else {
      // "All Time" / "This Year": 12 Full Months
      subtitle = `12-Month full financial trajectory (${currentYear})`;

      bars = MONTH_NAMES.map((name, idx) => {
        const monthNum = idx + 1;
        const key = String(monthNum).padStart(2, "0");

        const mSales = sales.filter((s) => {
          if (s.status !== "completed") return false;
          const [sYear, sMonth] = s.date.split("-");
          return Number(sMonth) === monthNum;
        });

        const revenue = mSales.reduce((sum, s) => sum + s.totalAmount, 0);
        const units = mSales.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);

        return {
          key,
          label: name,
          sublabel: `${name} ${currentYear}`,
          sales: units,
          revenue,
          isCurrent: idx === currentMonth,
          heightPct: 0,
        };
      });
    }

    // Dynamic Y-axis scale calculation tailored to max value
    const maxRev = Math.max(...bars.map(b => b.revenue), 0);
    let ceiling = 5000;
    if (maxRev > 0) {
      if (maxRev <= 2000) ceiling = 2000;
      else if (maxRev <= 5000) ceiling = 5000;
      else if (maxRev <= 10000) ceiling = 10000;
      else if (maxRev <= 25000) ceiling = 25000;
      else if (maxRev <= 50000) ceiling = 50000;
      else if (maxRev <= 100000) ceiling = 100000;
      else ceiling = Math.ceil(maxRev / 50000) * 50000;
    }

    const formatK = (val: number) => (val >= 1000 ? `${Math.round(val / 1000)}k` : `${val}`);
    const labels = [
      formatK(ceiling),
      formatK(Math.round(ceiling * 0.75)),
      formatK(Math.round(ceiling * 0.5)),
      formatK(Math.round(ceiling * 0.25)),
      "0",
    ];

    const computedBars = bars.map(b => {
      let heightPct = 6;
      if (b.revenue > 0 && ceiling > 0) {
        heightPct = Math.min(95, Math.max(10, Math.round((b.revenue / ceiling) * 90)));
      }
      return { ...b, heightPct };
    });

    return {
      chartBars: computedBars,
      yAxisLabels: labels,
      chartSubtitle: subtitle,
    };
  }, [sales, timeRange]);

  // 3. Filtered & Sorted Recent Orders List from Database
  const recentOrders = useMemo(() => {
    const list = sales.map((s) => {
      // Find all category tags from all items
      const categories = new Set<string>();
      s.items.forEach((item) => {
        const prod = catalogProducts.find((p) => p.id === item.productId);
        if (prod?.category) {
          if (Array.isArray(prod.category)) prod.category.forEach((c) => categories.add(c));
          else categories.add(prod.category);
        }
      });
      const categoryStr = categories.size > 0 ? Array.from(categories).join(", ") : "Candles";

      return {
        id: s.id,
        customerName: s.customerName,
        customerEmail: s.customerEmail,
        date: s.date,
        totalAmount: s.totalAmount,
        status: s.status,
        items: s.items,
        itemCount: s.items.reduce((sum, item) => sum + item.quantity, 0),
        category: categoryStr,
      };
    });

    // Search filter
    const filtered = list.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesMeta =
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q);
      const matchesItems = order.items.some(
        (i) =>
          (i.productTitle && i.productTitle.toLowerCase().includes(q)) ||
          (i.productId && i.productId.toLowerCase().includes(q))
      );
      return matchesMeta || matchesItems;
    });

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

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] tracking-tight">
              Sales Overview
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#283322]/10 text-[#283322]">
              {timeRange}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#222a1d]/50 mt-0.5">
            Real-time analytics for {timeRange.toLowerCase()} aggregated directly from database
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("sales")}
            className="flex items-center gap-1.5 rounded-full bg-[#16a34a] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803d] shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Sale Entry</span>
          </button>
        </div>
      </div>

      {/* 1. KEY METRIC CARDS ROW (Synchronized with Time Range) */}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97706] text-white shadow-sm shadow-amber-600/20">
              <UserGroupIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222a1d] font-sans">
                {metrics.totalOrdersCount}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#d97706] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                Invoices
              </span>
            </div>
            <p className="mt-3 text-xs text-[#222a1d]/40 font-medium">
              {metrics.totalOrdersCount} order transactions in {timeRange.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Card 3: Operating Costs / Expenses */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Operating Costs
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-sm shadow-sky-600/20">
              <ReceiptPercentIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222a1d] font-sans">
                Rs {metrics.totalExpenses.toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#222a1d]/40 font-medium">
              Expenses recorded for {timeRange.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 border border-[#e3e8e2] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#222a1d]/60 tracking-wide">
              Net Profit
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-sm shadow-emerald-600/20">
              <BanknotesIcon className="h-5 w-5 text-white" />
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
        
        {/* Left: Dynamic Multi-View Performance Bar Chart */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 sm:p-7 border border-[#e3e8e2] shadow-sm flex flex-col justify-between">
          
          {/* Chart Header with Synchronized Dropdown */}
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-xl font-serif font-bold text-[#222a1d] truncate">
                  Performance Overview
                </h2>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f1f4f1] text-[#222a1d]/70">
                  {timeRange}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#222a1d]/40 truncate mt-0.5">
                {chartSubtitle}
              </p>
            </div>

            {/* Time Filter Pill (Wider & aligned on same line on mobile) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsPerfFilterOpen(!isPerfFilterOpen)}
                className="flex items-center justify-between gap-1.5 sm:gap-2 rounded-full border border-[#e3e8e2] bg-[#f8faf8] px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-[#222a1d] hover:border-[#283322]/30 transition-all cursor-pointer min-w-26 sm:min-w-28 shadow-xs"
              >
                <span className="truncate">{timeRange}</span>
                <ChevronUpDownIcon className="h-3.5 w-3.5 text-[#222a1d]/50 shrink-0" />
              </button>

              {isPerfFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsPerfFilterOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 z-30 w-36 rounded-2xl bg-white p-1 shadow-xl border border-[#e3e8e2] text-xs">
                    {["This Week", "This Month", "This Quarter", "All Time"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleTimeRangeSelect(opt)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                          timeRange === opt
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
            
            {/* Horizontal Dashed Gridlines & Dynamic Y-Axis Scale */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pr-2">
              {yAxisLabels.map((label, i) => (
                <div key={i} className="flex items-center w-full gap-3 text-[10px] text-[#222a1d]/30 font-medium">
                  <span className="w-6 text-right shrink-0 font-mono">{label}</span>
                  <div className="w-full border-b border-dashed border-[#e4eae3]" />
                </div>
              ))}
            </div>

            {/* Dynamic Grid Rounded Bars Container */}
            <div 
              style={{ gridTemplateColumns: `repeat(${chartBars.length}, minmax(0, 1fr))` }}
              className="relative z-10 grid gap-1.5 sm:gap-3 h-60 items-end pl-9 pr-2 pb-8"
            >
              {chartBars.map((item) => (
                <div 
                  key={item.key} 
                  className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Compact Desktop-Only Hover Tooltip (Hidden on Mobile) */}
                  <div className="hidden md:group-hover:flex flex-col gap-1 absolute bottom-[90%] z-30 mb-2 w-max min-w-32 rounded-xl bg-white px-3 py-2 shadow-xl border border-[#e3e8e2] text-left pointer-events-none transition-opacity duration-150 animate-fade-in -translate-x-1/2 left-1/2">
                    <p className="text-[10px] font-extrabold text-[#222a1d] border-b border-[#f0f4ef] pb-1">
                      {item.sublabel || item.label}
                    </p>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex items-center justify-between gap-3 text-[#222a1d]/60">
                        <span>Units Sold:</span>
                        <span className="font-bold text-[#222a1d]">{item.sales}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[#222a1d]/60">
                        <span>Revenue:</span>
                        <span className="font-bold text-[#283322]">
                          Rs {item.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bar Pillar */}
                  <div className="w-full flex justify-center items-end h-full">
                    <div
                      style={{ height: `${item.heightPct}%` }}
                      className={`w-full max-w-12 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-y-[1.03] ${
                        item.isCurrent
                          ? "bg-linear-to-t from-[#242c1e] to-[#45573b] shadow-lg shadow-[#283322]/20 ring-2 ring-[#283322]/30"
                          : "bg-[#e8ede7] hover:bg-[#dbe2da]"
                      }`}
                    />
                  </div>

                  {/* X-Axis Dynamic Label */}
                  <span className={`absolute -bottom-6 text-[10px] sm:text-xs font-semibold transition-colors truncate max-w-full text-center ${
                    item.isCurrent ? "text-[#283322] font-bold" : "text-[#222a1d]/40 group-hover:text-[#283322]"
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Legend Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#f0f4ef] text-xs text-[#222a1d]/50">
            <span className="font-medium hidden sm:inline">
              Hover over any period to view performance
            </span>
            <div className="flex items-center gap-4 ml-auto sm:ml-0">
              <span className="flex items-center gap-1.5 font-semibold text-[#283322]">
                <span className="h-2 w-2 rounded-full bg-[#283322]" /> Current
              </span>
              <span className="flex items-center gap-1.5 text-[#222a1d]/50">
                <span className="h-2 w-2 rounded-full bg-[#e8ede7]" /> Other
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sales Overview Radial Arc Gauge */}
        <div className="rounded-3xl sm:rounded-[28px] bg-white p-6 sm:p-7 border border-[#e3e8e2] shadow-sm flex flex-col justify-between">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#222a1d]">
                  Margin Health
                </h2>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f1f4f1] text-[#222a1d]/70">
                  {timeRange}
                </span>
              </div>
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
              viewBox="0 0 240 145" 
              className="w-full max-w-60 overflow-visible"
            >
              {/* Subtle Dashed Base Arc Rail */}
              <path
                d="M 42 125 A 78 78 0 0 1 198 125"
                fill="none"
                stroke="#eef2ee"
                strokeWidth="1.5"
                strokeDasharray="2 4"
                className="opacity-70"
              />

              {Array.from({ length: 21 }).map((_, i) => {
                // Exact 9-degree integer angles: 180° to 360°
                const angle = 180 + i * 9;
                const rad = (angle * Math.PI) / 180;
                const rInner = 80;
                const rOuter = 99;
                const cx = 120;
                const cy = 125;

                const x1 = +(cx + rInner * Math.cos(rad)).toFixed(2);
                const y1 = +(cy + rInner * Math.sin(rad)).toFixed(2);
                const x2 = +(cx + rOuter * Math.cos(rad)).toFixed(2);
                const y2 = +(cy + rOuter * Math.sin(rad)).toFixed(2);

                const isLoss = metrics.profitMargin < 0;
                const clampedMargin = Math.max(0, Math.min(100, metrics.profitMargin));
                const activeSegments = isLoss ? 1 : Math.round((clampedMargin / 100) * 21);
                const isActive = i < activeSegments;

                const tickColor = isActive 
                  ? (isLoss && i === 0 ? "#ef4444" : GAUGE_POWER_COLORS[i])
                  : "#e8ede7";

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={tickColor}
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    className="transition-colors duration-300"
                  />
                );
              })}
            </svg>

            {/* Gauge Center Text */}
            <div className="text-center -mt-8">
              <span className={`text-2xl sm:text-[28px] font-bold tracking-tight font-sans ${
                metrics.profitMargin < 0 ? "text-red-600" : metrics.profitMargin < 20 ? "text-orange-600" : metrics.profitMargin < 45 ? "text-amber-600" : "text-[#222a1d]"
              }`}>
                {metrics.profitMargin.toFixed(1)}%
              </span>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-2xs ${
                  metrics.profitMargin < 0
                    ? "bg-[#dc2626] text-white"
                    : metrics.profitMargin < 20
                    ? "bg-[#ea580c] text-white"
                    : metrics.profitMargin < 45
                    ? "bg-[#d97706] text-white"
                    : "bg-[#15803d] text-white"
                }`}>
                  {metrics.profitMargin < 0 ? "Loss" : metrics.profitMargin < 20 ? "Low Margin" : metrics.profitMargin < 45 ? "Moderate Margin" : "Optimal Profit"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Split Sub-Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-2xl bg-[#f8faf8] p-3.5 border border-[#eef2ee]">
              <span className="text-[10px] font-semibold text-[#222a1d]/50 block">
                Gross Revenue
              </span>
              <span className="mt-1 block font-mono text-xs sm:text-sm font-bold text-[#222a1d]">
                Rs {metrics.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="rounded-2xl bg-[#f8faf8] p-3.5 border border-[#eef2ee]">
              <span className="text-[10px] font-semibold text-[#222a1d]/50 block">
                Total Expenses
              </span>
              <span className="mt-1 block font-mono text-xs sm:text-sm font-bold text-[#0284c7]">
                Rs {metrics.totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. RECENT ORDERS: MOBILE SPACIOUS CARDS & DESKTOP TABLE */}
      <div className="rounded-3xl sm:rounded-[28px] bg-white p-4.5 sm:p-7 border border-[#e3e8e2] shadow-sm">
        
          {/* Table Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eef2ee]">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#222a1d]">
                Recent Orders Ledger
              </h3>
              <p className="text-xs text-[#222a1d]/45 mt-0.5">
                Live customer transactions recorded in database
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#222a1d]/40" />
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

          {/* MOBILE CARD VIEW (< 768px): Click to Expand (1:1 details) / Click to Minimize (Flat 16:9) */}
          <div className="block md:hidden space-y-2.5 pt-3">
            {recentOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isExpanded 
                      ? "border-[#283322]/40 bg-white p-4.5 space-y-4 shadow-md ring-1 ring-[#283322]/10" 
                      : "border-[#e3e8e2] bg-[#f8faf8] p-3.5 space-y-2 shadow-2xs hover:border-[#283322]/30"
                  }`}
                >
                  {/* 1. TOP SUMMARY BAR (Always visible, minimal flat view) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="font-mono font-bold text-xs text-[#283322] shrink-0">{order.id}</span>
                      <span className="rounded-full bg-white border border-[#e8ede7] px-2 py-0.5 text-[8px] font-semibold text-[#222a1d]/70 whitespace-nowrap shrink-0">
                        {order.category}
                      </span>
                      <span className="text-xs font-bold text-[#222a1d] truncate">
                        • {order.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#283322]">
                        Rs {order.totalAmount.toLocaleString()}
                      </span>
                      <span className={`inline-block text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-2xs ${
                        order.status === "completed"
                          ? "bg-[#15803d]"
                          : order.status === "pending"
                          ? "bg-[#d97706]"
                          : "bg-[#dc2626]"
                      }`}>
                        {order.status}
                      </span>
                      <div className="h-6 w-6 rounded-full bg-white border border-[#e8ede7] flex items-center justify-center text-[#222a1d]/40">
                        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#283322]" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* 2. EXPANDED VIEW (~1:1 Full Detailed Mode) */}
                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t border-[#eef2ee] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                      
                      {/* Customer & Timestamp */}
                      <div className="flex items-center justify-between gap-2 bg-[#f8faf8] p-3 rounded-xl border border-[#e8ede7]">
                        <div>
                          <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Customer</span>
                          <h4 className="font-bold text-xs sm:text-sm text-[#222a1d]">{order.customerName}</h4>
                          <p className="text-[10px] text-[#222a1d]/50">{order.customerEmail || "Walk-in Customer"}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">Order Date</span>
                          <p className="font-mono text-xs text-[#222a1d] font-semibold">{order.date}</p>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="bg-[#f8faf8] rounded-xl p-3 border border-[#e8ede7] space-y-2">
                        <span className="text-[9px] font-bold text-[#222a1d]/40 uppercase tracking-wider block">
                          Items Breakdown ({order.itemCount} units)
                        </span>
                        <div className="space-y-2 divide-y divide-[#eef2ee]">
                          {order.items.map((item, idx) => {
                            const prod = catalogProducts.find((p) => p.id === item.productId);
                            const img = prod?.img || "";
                            const title = item.productTitle || prod?.title || item.productId;

                            return (
                              <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white border border-[#e8ede7]">
                                    {img ? (
                                      <img 
                                        src={img} 
                                        alt={title} 
                                        className="h-full w-full object-cover" 
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center text-xs">
                                        🕯️
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-xs text-[#222a1d] truncate max-w-40">
                                      {title}
                                    </p>
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

                      {/* Action to Jump to Sales Ledger */}
                      <div className="pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveTab("sales"); }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#283322] py-2.5 text-xs font-bold text-white hover:bg-[#34422c] transition-colors cursor-pointer shadow-xs"
                        >
                          <DocumentTextIcon className="h-3.5 w-3.5" />
                          <span>View Full Transaction in Sales Ledger</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {recentOrders.length === 0 && (
              <div className="py-12 text-center text-[#222a1d]/40 font-serif">
                No transactions recorded in database.
              </div>
            )}
          </div>

          {/* DESKTOP DATA TABLE (>= 768px): Full wide spreadsheet table */}
          <div className="hidden md:block overflow-x-auto scrollbar-hide -mx-6 sm:-mx-7 px-6 sm:px-7 pt-2">
            <table className="w-full text-left border-collapse min-w-220">
              <thead>
                <tr className="border-b border-[#eef2ee] text-[11px] font-bold uppercase tracking-wider text-[#222a1d]/40">
                  <th className="pb-3.5 pl-2 w-8">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length > 0 && selectedOrders.length === recentOrders.length}
                      onChange={toggleSelectAllOrders}
                      className="h-4 w-4 rounded border-[#d4ded3] text-[#283322] focus:ring-[#283322]"
                    />
                  </th>
                  <th className="pb-3.5">Product info</th>
                  <th className="pb-3.5">Order Id</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5">Customer</th>
                  <th className="pb-3.5 text-center">Category</th>
                  <th className="pb-3.5 text-center">Status</th>
                  <th className="pb-3.5 text-center">Items</th>
                  <th className="pb-3.5 text-right">Total</th>
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
                      <td className="py-4.5 sm:py-5 pl-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="h-4 w-4 rounded border-[#d4ded3] text-[#283322] focus:ring-[#283322]"
                        />
                      </td>

                      <td className="py-4.5 sm:py-5">
                        <div className="space-y-2 py-0.5">
                          {order.items.map((item, idx) => {
                            const prod = catalogProducts.find((p) => p.id === item.productId);
                            const img = prod?.img || "";
                            const title = item.productTitle || prod?.title || item.productId;

                            return (
                              <div key={idx} className="flex items-center gap-2.5">
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[#f1f4f1] border border-[#e8ede7]">
                                  {img ? (
                                    <img 
                                      src={img} 
                                      alt={title} 
                                      className="h-full w-full object-cover" 
                                      />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-[#283322]/30 font-serif text-xs">
                                      🕯️
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-[#222a1d] truncate max-w-44">
                                    {title}
                                  </p>
                                  <p className="text-[10px] text-[#222a1d]/50 font-mono">
                                    {item.quantity} × Rs {item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Order ID */}
                      <td className="py-4.5 sm:py-5 font-mono font-bold text-xs text-[#283322]">
                        {order.id}
                      </td>

                      {/* Date */}
                      <td className="py-4.5 sm:py-5 text-[#222a1d]/60 font-mono text-[11px]">
                        {order.date}
                      </td>

                      {/* Customer Details */}
                      <td className="py-4.5 sm:py-5">
                        <p className="font-bold text-[#222a1d]">{order.customerName}</p>
                        <p className="text-[10px] text-[#222a1d]/40 truncate max-w-35">{order.customerEmail || "Walk-in"}</p>
                      </td>

                      {/* Category (Two lines centered) */}
                      <td className="py-4.5 sm:py-5 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="inline-flex flex-col items-center justify-center text-center rounded-xl bg-[#f1f4f1] px-3 py-1 text-[10px] font-bold text-[#222a1d]/75 leading-tight">
                            {order.category.includes(" ") ? (
                              <>
                                <span>{order.category.split(" ")[0]}</span>
                                <span>{order.category.split(" ").slice(1).join(" ")}</span>
                              </>
                            ) : (
                              <span>{order.category}</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4.5 sm:py-5 text-center">
                        <span className={`inline-block text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider text-white shadow-2xs ${
                          order.status === "completed"
                            ? "bg-[#15803d]"
                            : order.status === "pending"
                            ? "bg-[#d97706]"
                            : "bg-[#dc2626]"
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-4.5 sm:py-5 text-center font-bold text-xs">
                        {order.itemCount}
                      </td>

                      {/* Total */}
                      <td className="py-4.5 sm:py-5 text-right font-mono font-bold text-xs sm:text-sm text-[#283322]">
                        Rs {order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#222a1d]/40 font-serif">
                      No transactions recorded in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

    </div>
  );
}
