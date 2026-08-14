"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AdminCatalogProduct } from "@/lib/catalog";

export interface SaleItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customerName: string;
  customerEmail: string;
  items: SaleItem[];
  totalAmount: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

export type ExpenseCategory = "materials" | "packaging" | "shipping" | "marketing" | "rent-utilities" | "other";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  status: "pending" | "paid";
}

export interface StockLevel {
  productId: string;
  stockLevel: number;
  safetyThreshold: number;
  unitCost: number;
}

export interface StockLog {
  id: string;
  productId: string;
  productTitle: string;
  type: "restock" | "sale" | "adjustment";
  quantity: number;
  date: string;
  note: string;
}

interface DashboardContextType {
  sales: Sale[];
  expenses: Expense[];
  stockLevels: StockLevel[];
  stockLogs: StockLog[];
  isLoading: boolean;
  
  // Sales CRUD
  addSale: (sale: Omit<Sale, "id" | "totalAmount">) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  
  // Expenses CRUD
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Stock Actions
  updateStockProfile: (productId: string, stockLevel: number, safetyThreshold: number, unitCost: number, logNote?: string) => Promise<void>;
  adjustStockLevel: (productId: string, delta: number, note?: string) => Promise<void>;
  logRestock: (productId: string, quantity: number, unitCost: number, note?: string) => Promise<void>;
  
  // Reload
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboardStore() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardStore must be used within a DashboardStoreProvider");
  }
  return context;
}

interface ProviderProps {
  children: React.ReactNode;
  catalogProducts: AdminCatalogProduct[];
}

export function DashboardStoreProvider({ children, catalogProducts }: ProviderProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all live records from Supabase on mount
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      // 1. Fetch Sales
      const { data: salesData, error: salesErr } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (!salesErr && salesData) {
        setSales(salesData.map((row) => ({
          id: row.id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          items: Array.isArray(row.items) ? row.items : [],
          totalAmount: Number(row.total_amount),
          date: row.sale_date,
          status: row.status,
        })));
      } else {
        // Fallback to local storage if table not yet created in Supabase
        const saved = localStorage.getItem("nivati_real_sales");
        if (saved) setSales(JSON.parse(saved));
      }

      // 2. Fetch Expenses
      const { data: expensesData, error: expErr } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!expErr && expensesData) {
        setExpenses(expensesData.map((row) => ({
          id: row.id,
          title: row.title,
          amount: Number(row.amount),
          category: row.category,
          date: row.expense_date,
          status: row.status,
        })));
      } else {
        const saved = localStorage.getItem("nivati_real_expenses");
        if (saved) setExpenses(JSON.parse(saved));
      }

      // 3. Fetch Stock Levels
      const { data: stockData, error: stockErr } = await supabase
        .from("stock_levels")
        .select("*");

      if (!stockErr && stockData && stockData.length > 0) {
        const dbStockMap = new Map(stockData.map((s) => [s.product_id, s]));
        const combined = catalogProducts.map((p) => {
          const existing = dbStockMap.get(p.id);
          if (existing) {
            return {
              productId: existing.product_id,
              stockLevel: Number(existing.stock_level),
              safetyThreshold: Number(existing.safety_threshold),
              unitCost: Number(existing.unit_cost),
            };
          }
          return {
            productId: p.id,
            stockLevel: 0,
            safetyThreshold: 5,
            unitCost: Math.round(Number(p.price) * 0.35),
          };
        });
        setStockLevels(combined);
      } else {
        // Initialize stock from catalog products with 0 initial inventory
        const saved = localStorage.getItem("nivati_real_stock_levels");
        if (saved) {
          const parsed: StockLevel[] = JSON.parse(saved);
          const map = new Map(parsed.map((s) => [s.productId, s]));
          setStockLevels(catalogProducts.map((p) => map.get(p.id) || ({
            productId: p.id,
            stockLevel: 0,
            safetyThreshold: 5,
            unitCost: Math.round(Number(p.price) * 0.35),
          })));
        } else {
          setStockLevels(catalogProducts.map((p) => ({
            productId: p.id,
            stockLevel: 0,
            safetyThreshold: 5,
            unitCost: Math.round(Number(p.price) * 0.35),
          })));
        }
      }

      // 4. Fetch Stock Logs
      const { data: logsData, error: logsErr } = await supabase
        .from("stock_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!logsErr && logsData) {
        setStockLogs(logsData.map((row) => ({
          id: row.id,
          productId: row.product_id,
          productTitle: row.product_title,
          type: row.type,
          quantity: row.quantity,
          date: row.log_date,
          note: row.note,
        })));
      } else {
        const saved = localStorage.getItem("nivati_real_stock_logs");
        if (saved) setStockLogs(JSON.parse(saved));
      }

    } catch (err) {
      console.warn("Using persistent local store fallback:", err);
    } finally {
      setIsLoading(false);
    }
  }, [catalogProducts]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Sync to local storage backup
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("nivati_real_sales", JSON.stringify(sales));
    }
  }, [sales, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("nivati_real_expenses", JSON.stringify(expenses));
    }
  }, [expenses, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("nivati_real_stock_levels", JSON.stringify(stockLevels));
    }
  }, [stockLevels, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("nivati_real_stock_logs", JSON.stringify(stockLogs));
    }
  }, [stockLogs, isLoading]);


  // ==============================================================================
  // SALES ACTIONS (Database Synchronized)
  // ==============================================================================
  const addSale = async (saleData: Omit<Sale, "id" | "totalAmount">) => {
    const totalAmount = saleData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const saleId = `SAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSale: Sale = {
      ...saleData,
      id: saleId,
      totalAmount,
    };

    // Optimistic UI update
    setSales((prev) => [newSale, ...prev]);

    // Database Insert
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("sales").insert([{
        id: saleId,
        customer_name: saleData.customerName,
        customer_email: saleData.customerEmail,
        items: saleData.items,
        total_amount: totalAmount,
        status: saleData.status,
        sale_date: saleData.date,
      }]);
    } catch (e) {
      console.error("Error saving sale to database:", e);
    }

    // Automatically deduct stock levels for this sale
    for (const item of saleData.items) {
      await adjustStockLevel(
        item.productId, 
        -item.quantity, 
        `Sold in invoice ${saleId} to ${saleData.customerName}`,
        "sale"
      );
    }
  };

  const updateSale = async (id: string, updatedFields: Partial<Sale>) => {
    setSales((prev) =>
      prev.map((sale) => {
        if (sale.id === id) {
          const merged = { ...sale, ...updatedFields };
          if (updatedFields.items) {
            merged.totalAmount = updatedFields.items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0
            );
          }
          return merged;
        }
        return sale;
      })
    );

    try {
      const supabase = createSupabaseBrowserClient();
      const payload: Record<string, unknown> = {};
      if (updatedFields.customerName !== undefined) payload.customer_name = updatedFields.customerName;
      if (updatedFields.customerEmail !== undefined) payload.customer_email = updatedFields.customerEmail;
      if (updatedFields.items !== undefined) {
        payload.items = updatedFields.items;
        payload.total_amount = updatedFields.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      }
      if (updatedFields.status !== undefined) payload.status = updatedFields.status;
      if (updatedFields.date !== undefined) payload.sale_date = updatedFields.date;

      await supabase.from("sales").update(payload).eq("id", id);
    } catch (e) {
      console.error("Error updating sale in database:", e);
    }
  };

  const deleteSale = async (id: string) => {
    const saleToDelete = sales.find((s) => s.id === id);
    if (!saleToDelete) return;

    setSales((prev) => prev.filter((s) => s.id !== id));

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("sales").delete().eq("id", id);
    } catch (e) {
      console.error("Error deleting sale in database:", e);
    }

    // Restore stock levels
    for (const item of saleToDelete.items) {
      await adjustStockLevel(
        item.productId,
        item.quantity,
        `Restored stock from cancelled order ${id}`,
        "adjustment"
      );
    }
  };


  // ==============================================================================
  // EXPENSES ACTIONS (Database Synchronized)
  // ==============================================================================
  const addExpense = async (expenseData: Omit<Expense, "id">) => {
    const expenseId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
    const newExpense: Expense = {
      ...expenseData,
      id: expenseId,
    };
    setExpenses((prev) => [newExpense, ...prev]);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("expenses").insert([{
        id: expenseId,
        title: expenseData.title,
        amount: expenseData.amount,
        category: expenseData.category,
        status: expenseData.status,
        expense_date: expenseData.date,
      }]);
    } catch (e) {
      console.error("Error saving expense to database:", e);
    }
  };

  const updateExpense = async (id: string, updatedFields: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updatedFields } : exp))
    );

    try {
      const supabase = createSupabaseBrowserClient();
      const payload: Record<string, unknown> = {};
      if (updatedFields.title !== undefined) payload.title = updatedFields.title;
      if (updatedFields.amount !== undefined) payload.amount = updatedFields.amount;
      if (updatedFields.category !== undefined) payload.category = updatedFields.category;
      if (updatedFields.status !== undefined) payload.status = updatedFields.status;
      if (updatedFields.date !== undefined) payload.expense_date = updatedFields.date;

      await supabase.from("expenses").update(payload).eq("id", id);
    } catch (e) {
      console.error("Error updating expense in database:", e);
    }
  };

  const deleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("expenses").delete().eq("id", id);
    } catch (e) {
      console.error("Error deleting expense in database:", e);
    }
  };


  // ==============================================================================
  // STOCK ACTIONS (Database Synchronized)
  // ==============================================================================
  const updateStockProfile = async (
    productId: string,
    stockLevel: number,
    safetyThreshold: number,
    unitCost: number,
    logNote = "Manual inventory settings profile update"
  ) => {
    const existing = stockLevels.find((s) => s.productId === productId);
    const diff = existing ? stockLevel - existing.stockLevel : stockLevel;

    setStockLevels((prev) =>
      prev.map((s) => (s.productId === productId ? { productId, stockLevel, safetyThreshold, unitCost } : s))
    );

    if (diff !== 0) {
      const prod = catalogProducts.find((p) => p.id === productId);
      const logId = `LOG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const newLog: StockLog = {
        id: logId,
        productId,
        productTitle: prod?.title || productId,
        type: "adjustment",
        quantity: diff,
        date: new Date().toISOString().split("T")[0],
        note: logNote,
      };
      setStockLogs((logs) => [newLog, ...logs]);

      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.from("stock_logs").insert([{
          id: logId,
          product_id: productId,
          product_title: prod?.title || productId,
          type: "adjustment",
          quantity: diff,
          log_date: new Date().toISOString().split("T")[0],
          note: logNote,
        }]);
      } catch (e) {
        console.error("Error saving stock log to database:", e);
      }
    }

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_levels").upsert({
        product_id: productId,
        stock_level: stockLevel,
        safety_threshold: safetyThreshold,
        unit_cost: unitCost,
      });
    } catch (e) {
      console.error("Error updating stock profile in database:", e);
    }
  };

  const adjustStockLevel = async (
    productId: string, 
    delta: number, 
    note = "Manual count adjustment",
    type: "restock" | "sale" | "adjustment" = "adjustment"
  ) => {
    let finalLevel = 0;

    setStockLevels((prev) =>
      prev.map((s) => {
        if (s.productId === productId) {
          finalLevel = Math.max(0, s.stockLevel + delta);
          return { ...s, stockLevel: finalLevel };
        }
        return s;
      })
    );

    const prod = catalogProducts.find((p) => p.id === productId);
    const logId = `LOG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newLog: StockLog = {
      id: logId,
      productId,
      productTitle: prod?.title || productId,
      type,
      quantity: delta,
      date: new Date().toISOString().split("T")[0],
      note,
    };
    setStockLogs((logs) => [newLog, ...logs]);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_logs").insert([{
        id: logId,
        product_id: productId,
        product_title: prod?.title || productId,
        type,
        quantity: delta,
        log_date: new Date().toISOString().split("T")[0],
        note,
      }]);

      await supabase.from("stock_levels").upsert({
        product_id: productId,
        stock_level: finalLevel,
      });
    } catch (e) {
      console.error("Error updating adjusted stock in database:", e);
    }
  };

  const logRestock = async (productId: string, quantity: number, unitCost: number, note = "Restock shipment received") => {
    const prod = catalogProducts.find((p) => p.id === productId);
    const existing = stockLevels.find((s) => s.productId === productId);
    const prevQty = existing?.stockLevel || 0;
    const prevCost = existing?.unitCost || unitCost;

    const totalCost = (prevQty * prevCost) + (quantity * unitCost);
    const totalQty = prevQty + quantity;
    const averageCost = totalQty > 0 ? Math.round(totalCost / totalQty) : unitCost;

    setStockLevels((prev) =>
      prev.map((s) => (s.productId === productId ? { ...s, stockLevel: totalQty, unitCost: averageCost } : s))
    );

    const logId = `LOG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newLog: StockLog = {
      id: logId,
      productId,
      productTitle: prod?.title || productId,
      type: "restock",
      quantity,
      date: new Date().toISOString().split("T")[0],
      note,
    };
    setStockLogs((logs) => [newLog, ...logs]);

    // Automatically record cost as an expense in database
    await addExpense({
      title: `Restock Material: ${prod?.title || productId} (x${quantity})`,
      amount: quantity * unitCost,
      category: "materials",
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    });

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_logs").insert([{
        id: logId,
        product_id: productId,
        product_title: prod?.title || productId,
        type: "restock",
        quantity,
        log_date: new Date().toISOString().split("T")[0],
        note,
      }]);

      await supabase.from("stock_levels").upsert({
        product_id: productId,
        stock_level: totalQty,
        unit_cost: averageCost,
      });
    } catch (e) {
      console.error("Error logging restock in database:", e);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        sales,
        expenses,
        stockLevels,
        stockLogs,
        isLoading,
        addSale,
        updateSale,
        deleteSale,
        addExpense,
        updateExpense,
        deleteExpense,
        updateStockProfile,
        adjustStockLevel,
        logRestock,
        refreshData: fetchAllData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
