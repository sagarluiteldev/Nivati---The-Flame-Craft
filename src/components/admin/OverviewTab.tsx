"use client";

import { useMemo } from "react";
import { 
  ArrowTrendingUpIcon, 
  BanknotesIcon, 
  ExclamationTriangleIcon, 
  ShoppingBagIcon, 
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/lib/dashboard-store";
import type { AdminCatalogProduct } from "@/lib/catalog";

interface Props {
  catalogProducts: AdminCatalogProduct[];
  setActiveTab: (tab: string) => void;
  setSelectedProductId?: (id: string | null) => void;
}

export default function OverviewTab({ catalogProducts, setActiveTab }: Props) {
  const { sales, expenses, stockLevels } = useDashboardStore();

  // 1. Calculate KPI Metrics
  const metrics = useMemo(() => {
    const completedSales = sales.filter((s) => s.status === "completed");
    
    // Revenue (completed sales)
    const totalRevenue = completedSales.reduce((sum, s) => sum + s.totalAmount, 0);

    // Total Expenses (paid + pending)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Net Profit
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Stock Valuation (cost basis & retail basis)
    let stockCostBasis = 0;
    let stockRetailValue = 0;

    stockLevels.forEach((s) => {
      const prod = catalogProducts.find((p) => p.id === s.productId);
      if (prod) {
        stockCostBasis += s.stockLevel * s.unitCost;
        stockRetailValue += s.stockLevel * Number(prod.price);
      }
    });

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      stockCostBasis,
      stockRetailValue,
    };
  }, [sales, expenses, stockLevels, catalogProducts]);

  // 2. Identify Low Stock Products
  const lowStockItems = useMemo(() => {
    return stockLevels
      .filter((s) => s.stockLevel <= s.safetyThreshold)
      .map((s) => {
        const prod = catalogProducts.find((p) => p.id === s.productId);
        return {
          productId: s.productId,
          title: prod?.title || s.productId,
          img: prod?.img || "",
          stockLevel: s.stockLevel,
          safetyThreshold: s.safetyThreshold,
        };
      });
  }, [stockLevels, catalogProducts]);

  // 3. Prepare Recent Activity Ledger
  const recentActivities = useMemo(() => {
    const saleActs = sales.map((s) => ({
      id: s.id,
      type: "sale" as const,
      title: `Order from ${s.customerName}`,
      detail: `${s.items.reduce((acc, item) => acc + item.quantity, 0)} candle(s)`,
      amount: s.totalAmount,
      date: s.date,
      status: s.status,
    }));

    const expenseActs = expenses.map((e) => ({
      id: e.id,
      type: "expense" as const,
      title: e.title,
      detail: e.category.charAt(0).toUpperCase() + e.category.slice(1),
      amount: e.amount,
      date: e.date,
      status: e.status,
    }));

    return [...saleActs, ...expenseActs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [sales, expenses]);

  // 4. Generate Monthly Chart Coordinates
  const chartData = useMemo(() => {
    // Generate data for the last 5 months
    const months = ["Feb", "Mar", "Apr", "May", "Jun"];
    const salesByMonth = [32000, 48000, 39000, 52000, 0]; // Seeded + mock
    const expensesByMonth = [15000, 22000, 18000, 25000, 0];

    // Calculate June 2026 actuals dynamically
    const juneSales = sales
      .filter((s) => s.status === "completed" && s.date.startsWith("2026-06"))
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const juneExpenses = expenses
      .filter((e) => e.date.startsWith("2026-06"))
      .reduce((sum, e) => sum + e.amount, 0);

    salesByMonth[4] = juneSales;
    expensesByMonth[4] = juneExpenses;

    const maxVal = Math.max(...salesByMonth, ...expensesByMonth, 50000);
    const height = 180;
    const width = 500;
    const padding = 30;

    // Convert value to Y coordinate
    const getY = (val: number) => {
      const scale = (height - padding * 2) / maxVal;
      return height - padding - val * scale;
    };

    // Convert index to X coordinate
    const getX = (idx: number) => {
      const step = (width - padding * 2) / (months.length - 1);
      return padding + idx * step;
    };

    // Build SVG Path strings
    let salesPath = "";
    let expensesPath = "";

    salesByMonth.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) salesPath += `M ${x} ${y}`;
      else salesPath += ` L ${x} ${y}`;
    });

    expensesByMonth.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) expensesPath += `M ${x} ${y}`;
      else expensesPath += ` L ${x} ${y}`;
    });

    // Areas under curves for premium gradients
    const salesAreaPath = `${salesPath} L ${getX(months.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
    const expensesAreaPath = `${expensesPath} L ${getX(months.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

    const points = months.map((label, idx) => ({
      label,
      x: getX(idx),
      salesY: getY(salesByMonth[idx]),
      salesVal: salesByMonth[idx],
      expY: getY(expensesByMonth[idx]),
      expVal: expensesByMonth[idx],
    }));

    return {
      points,
      salesPath,
      expensesPath,
      salesAreaPath,
      expensesAreaPath,
      width,
      height,
      maxVal,
      getY,
      getX,
    };
  }, [sales, expenses]);

  return (
    <div className="space-y-8">
      {/* 1. KPI grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-2xl border border-olive/10 bg-creme/50 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-olive/20 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-olive/40">Gross Revenue</span>
            <div className="rounded-xl bg-olive/5 p-3 text-olive">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl md:text-4xl font-sans text-olive font-bold tracking-tight">Rs {metrics.totalRevenue.toLocaleString()}</h3>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-olive/50">
              <span className="flex items-center font-bold text-sage">
                <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-0.5" /> +12.4%
              </span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="rounded-2xl border border-olive/10 bg-creme/50 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-olive/20 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-olive/40">Operating Costs</span>
            <div className="rounded-xl bg-terracotta/5 p-3 text-terracotta">
              <BanknotesIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl md:text-4xl font-sans text-olive font-bold tracking-tight">Rs {metrics.totalExpenses.toLocaleString()}</h3>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-olive/50">
              <span className="flex items-center font-bold text-terracotta/80">
                <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-0.5" /> +8.2%
              </span>
              <span>material costs up</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-2xl border border-olive/10 bg-creme/50 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-olive/20 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-olive/40">Net Profit</span>
            <div className={`rounded-xl p-3 ${metrics.netProfit >= 0 ? 'bg-olive/5 text-olive' : 'bg-terracotta/5 text-terracotta'}`}>
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl md:text-4xl font-sans text-olive font-bold tracking-tight">Rs {metrics.netProfit.toLocaleString()}</h3>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-olive/50 whitespace-nowrap">
              <span className="font-bold text-olive/80">
                {metrics.profitMargin.toFixed(1)}% margin
              </span>
              <span>profitability index</span>
            </div>
          </div>
        </div>

        {/* Asset Value */}
        <div className="rounded-2xl border border-olive/10 bg-creme/50 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-olive/20 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-olive/40">Stock Valuation</span>
            <div className="rounded-xl bg-olive/5 p-3 text-olive">
              <ArrowPathIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl md:text-4xl font-sans text-olive font-bold tracking-tight">Rs {metrics.stockCostBasis.toLocaleString()}</h3>
            <div className="mt-3 flex items-center justify-between text-xs text-olive/50">
              <span>Retail value:</span>
              <span className="font-bold text-olive">Rs {metrics.stockRetailValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* SVG Line Chart */}
        <div className="rounded-2xl border border-olive/10 bg-creme/40 p-6 shadow-sm backdrop-blur-md lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif text-olive">Performance Analysis</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-olive/30 mt-0.5">Sales vs Expenses Comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-olive"></span> Sales
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-terracotta"></span> Expenses
              </span>
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <svg 
              viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b4132" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b4132" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d3a795" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d3a795" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = chartData.height - 30 - p * (chartData.height - 60);
                const gridVal = Math.round(p * chartData.maxVal);
                return (
                  <g key={idx} className="opacity-10">
                    <line 
                      x1="30" 
                      y1={y} 
                      x2={chartData.width - 30} 
                      y2={y} 
                      stroke="#3b4132" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x="10" 
                      y={y + 4} 
                      fill="#3b4132" 
                      fontSize="9" 
                      className="font-sans text-[9px] font-semibold tracking-tight"
                    >
                      {gridVal >= 1000 ? `${(gridVal/1000).toFixed(0)}k` : gridVal}
                    </text>
                  </g>
                );
              })}

              {/* Area Gradients */}
              <path d={chartData.salesAreaPath} fill="url(#salesGrad)" />
              <path d={chartData.expensesAreaPath} fill="url(#expGrad)" />

              {/* Line Paths */}
              <path 
                d={chartData.salesPath} 
                fill="none" 
                stroke="#3b4132" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d={chartData.expensesPath} 
                fill="none" 
                stroke="#d3a795" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data points */}
              {chartData.points.map((pt, idx) => {
                const rectWidth = 132;
                const rectHeight = 44;
                const tooltipAbove = Math.min(pt.salesY, pt.expY) > 65;
                
                const rectX = Math.max(10, Math.min(chartData.width - rectWidth - 10, pt.x - rectWidth / 2));
                const rectY = tooltipAbove 
                  ? Math.min(pt.salesY, pt.expY) - (rectHeight + 10)
                  : Math.max(pt.salesY, pt.expY) + 16;
                  
                const textX = rectX + rectWidth / 2;
                const textY1 = rectY + 16;
                const textY2 = rectY + 30;

                return (
                  <g key={idx} className="group">
                    {/* Invisible wide hover sensor to prevent cursor jittering */}
                    <rect
                      x={pt.x - 40}
                      y={10}
                      width={80}
                      height={chartData.height - 20}
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    <line 
                      x1={pt.x} 
                      y1="30" 
                      x2={pt.x} 
                      y2={chartData.height - 30} 
                      stroke="#3b4132" 
                      strokeWidth="1" 
                      className="opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" 
                    />
                    
                    {/* Sales point */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.salesY} 
                      r="4.5" 
                      fill="#3b4132" 
                      stroke="#f9f7f2" 
                      strokeWidth="1.5" 
                      style={{ transformOrigin: `${pt.x}px ${pt.salesY}px` }}
                      className="transition-transform duration-200 group-hover:scale-125 shadow-sm pointer-events-none"
                    />
 
                    {/* Expense point */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.expY} 
                      r="4.5" 
                      fill="#d3a795" 
                      stroke="#f9f7f2" 
                      strokeWidth="1.5" 
                      style={{ transformOrigin: `${pt.x}px ${pt.expY}px` }}
                      className="transition-transform duration-200 group-hover:scale-125 shadow-sm pointer-events-none"
                    />

                    {/* Tooltip value */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect 
                        x={rectX} 
                        y={rectY} 
                        width={rectWidth} 
                        height={rectHeight} 
                        rx="6" 
                        fill="#3b4132" 
                      />
                      <text 
                        x={textX} 
                        y={textY1} 
                        fill="#f9f7f2" 
                        fontSize="9" 
                        textAnchor="middle" 
                        className="font-bold font-sans"
                      >
                        Sales: Rs {pt.salesVal.toLocaleString()}
                      </text>
                      <text 
                        x={textX} 
                        y={textY2} 
                        fill="#d3a795" 
                        fontSize="9" 
                        textAnchor="middle" 
                        className="font-bold font-sans"
                      >
                        Expenses: Rs {pt.expVal.toLocaleString()}
                      </text>
                    </g>

                    {/* Month Label */}
                    <text 
                      x={pt.x} 
                      y={chartData.height - 10} 
                      fill="#3b4132" 
                      fontSize="9" 
                      textAnchor="middle" 
                      className="font-bold opacity-40 font-sans pointer-events-none"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-olive/10 bg-creme/40 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif text-olive">Inventory Health</h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-olive/30 mt-0.5">Threshold Alerts</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-terracotta/5 flex items-center justify-center text-terracotta">
                <ExclamationTriangleIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-hide">
              {lowStockItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-2 rounded-xl bg-creme/50 border border-olive/5 hover:border-olive/15 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-olive/5">
                      {item.img ? (
                        <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-olive/20 font-serif text-xs">🕯️</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-olive truncate max-w-[120px]">{item.title}</h4>
                      <p className="text-[9px] text-olive/40 font-mono truncate">{item.productId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta uppercase">
                      Qty: {item.stockLevel}
                    </span>
                    <p className="text-[8px] text-olive/30 mt-0.5 font-bold">Safety: {item.safetyThreshold}</p>
                  </div>
                </div>
              ))}

              {lowStockItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-10 w-10 rounded-full bg-olive/5 flex items-center justify-center text-olive/30 mb-2">🌿</div>
                  <h4 className="text-xs text-olive font-bold">All products healthy</h4>
                  <p className="text-[9px] text-olive/40 mt-0.5">All items exceed safety stock margins.</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("stock")}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-olive py-2.5 text-[10px] font-bold uppercase tracking-widest text-creme transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Manage Inventory
          </button>
        </div>
      </div>

      {/* 3. Recent Activity Ledger */}
      <div className="rounded-2xl border border-olive/10 bg-creme/40 p-6 shadow-sm backdrop-blur-md">
        <div className="mb-6">
          <h3 className="text-lg font-serif text-olive">Recent Activity</h3>
          <p className="text-[10px] font-bold uppercase tracking-wider text-olive/30 mt-0.5">Latest Business Transactions</p>
        </div>

        <div className="divide-y divide-olive/5">
          {recentActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-olive/[0.01] px-1 transition-all rounded-lg">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                  act.type === "sale" ? "bg-olive/5 text-olive" : "bg-terracotta/5 text-terracotta"
                }`}>
                  {act.type === "sale" ? (
                    <ShoppingBagIcon className="h-5 w-5" />
                  ) : (
                    <BanknotesIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-olive truncate">{act.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-olive/40">
                    <span className="font-semibold">{act.detail}</span>
                    <span>•</span>
                    <span className="font-mono">{act.date}</span>
                    <span>•</span>
                    <span className="font-mono uppercase text-[8px]">{act.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-sm font-bold font-sans ${act.type === "sale" ? "text-olive" : "text-terracotta"}`}>
                  {act.type === "sale" ? "+" : "-"} Rs {act.amount.toLocaleString()}
                </span>
                <div className="mt-1">
                  <span className={`inline-block text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    act.status === "completed" || act.status === "paid"
                      ? "bg-olive/10 text-olive"
                      : act.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {act.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {recentActivities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-olive/30">
              <p className="text-xs">No transaction history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
