"use client";

import { useState, useEffect, createContext, useContext } from "react";
import type { AdminCatalogProduct } from "@/lib/catalog";

export interface SaleItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number; // Unit price at checkout
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
  quantity: number; // Positive or negative
  date: string;
  note: string;
}

interface DashboardContextType {
  sales: Sale[];
  expenses: Expense[];
  stockLevels: StockLevel[];
  stockLogs: StockLog[];
  
  // Sales CRUD
  addSale: (sale: Omit<Sale, "id" | "totalAmount">) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  // Expenses CRUD
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Stock Actions
  updateStockProfile: (productId: string, stockLevel: number, safetyThreshold: number, unitCost: number, logNote?: string) => void;
  adjustStockLevel: (productId: string, delta: number, note?: string) => void;
  logRestock: (productId: string, quantity: number, unitCost: number, note?: string) => void;
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
  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("nivati_sales");
    if (saved) return JSON.parse(saved);

    // Seed data if empty
    if (catalogProducts.length > 0) {
      const p1 = catalogProducts[0];
      const p2 = catalogProducts[1] || p1;
      const p3 = catalogProducts[2] || p1;

      return [
        {
          id: "SAL-1001",
          customerName: "Aarav Sharma",
          customerEmail: "aarav@example.com",
          items: [
            { productId: p1.id, productTitle: p1.title, quantity: 2, price: p1.price }
          ],
          totalAmount: p1.price * 2,
          date: "2026-06-22",
          status: "completed",
        },
        {
          id: "SAL-1002",
          customerName: "Priya Patel",
          customerEmail: "priya@example.com",
          items: [
            { productId: p2.id, productTitle: p2.title, quantity: 1, price: p2.price }
          ],
          totalAmount: p2.price,
          date: "2026-06-25",
          status: "completed",
        },
        {
          id: "SAL-1003",
          customerName: "Kabir Joshi",
          customerEmail: "kabir@example.com",
          items: [
            { productId: p1.id, productTitle: p1.title, quantity: 1, price: p1.price },
            { productId: p3.id, productTitle: p3.title, quantity: 1, price: p3.price }
          ],
          totalAmount: p1.price + p3.price,
          date: "2026-06-27",
          status: "pending",
        },
        {
          id: "SAL-1004",
          customerName: "Neha Rao",
          customerEmail: "neha@example.com",
          items: [
            { productId: p2.id, productTitle: p2.title, quantity: 3, price: p2.price }
          ],
          totalAmount: p2.price * 3,
          date: "2026-06-28",
          status: "completed",
        }
      ];
    }
    return [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("nivati_expenses");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "EXP-101",
        title: "Organic Soy Wax (50kg Bag)",
        amount: 12500,
        category: "materials",
        date: "2026-06-10",
        status: "paid",
      },
      {
        id: "EXP-102",
        title: "Amber Glass Jars & Lids (200 pcs)",
        amount: 8000,
        category: "packaging",
        date: "2026-06-12",
        status: "paid",
      },
      {
        id: "EXP-103",
        title: "Premium Lavender Essential Oil",
        amount: 4500,
        category: "materials",
        date: "2026-06-18",
        status: "paid",
      },
      {
        id: "EXP-104",
        title: "DHL Shipping to Customers (Batch)",
        amount: 3500,
        category: "shipping",
        date: "2026-06-24",
        status: "paid",
      },
      {
        id: "EXP-105",
        title: "Instagram Ads Campaign",
        amount: 6000,
        category: "marketing",
        date: "2026-06-26",
        status: "paid",
      },
      {
        id: "EXP-106",
        title: "Showroom Utilities",
        amount: 5000,
        category: "rent-utilities",
        date: "2026-06-28",
        status: "pending",
      }
    ];
  });

  const [stockLevels, setStockLevels] = useState<StockLevel[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("nivati_stock_levels");
    if (saved) return JSON.parse(saved);

    // Seed stock levels
    return catalogProducts.map((p) => ({
      productId: p.id,
      stockLevel: 35,
      safetyThreshold: 8,
      unitCost: Math.round(Number(p.price) * 0.35),
    }));
  });

  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("nivati_stock_logs");
    if (saved) return JSON.parse(saved);

    // Seed stock logs
    const initialStock = catalogProducts.map((p) => ({
      productId: p.id,
      stockLevel: 35,
      safetyThreshold: 8,
      unitCost: Math.round(Number(p.price) * 0.35),
    }));

    return initialStock.map((item) => {
      const prod = catalogProducts.find((p) => p.id === item.productId);
      return {
        id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        productId: item.productId,
        productTitle: prod?.title || item.productId,
        type: "adjustment" as const,
        quantity: item.stockLevel,
        date: "2026-06-01",
        note: "Initial warehouse count synchronization",
      };
    });
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Mark load on mount using async defer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync new products if catalog updates (using render-time state adjustment pattern)
  const [prevCatalog, setPrevCatalog] = useState(catalogProducts);
  if (catalogProducts !== prevCatalog) {
    setPrevCatalog(catalogProducts);
    const stockMap = new Map(stockLevels.map((s) => [s.productId, s]));
    const hasNewProducts = catalogProducts.some((p) => !stockMap.has(p.id));
    
    if (hasNewProducts) {
      const synchronized = catalogProducts.map((p) => {
        const existing = stockMap.get(p.id);
        if (existing) return existing;
        return {
          productId: p.id,
          stockLevel: 35,
          safetyThreshold: 8,
          unitCost: Math.round(Number(p.price) * 0.35),
        };
      });
      setStockLevels(synchronized);
    }
  }

  // Sync state back to local storage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("nivati_sales", JSON.stringify(sales));
  }, [sales, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("nivati_expenses", JSON.stringify(expenses));
  }, [expenses, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("nivati_stock_levels", JSON.stringify(stockLevels));
  }, [stockLevels, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("nivati_stock_logs", JSON.stringify(stockLogs));
  }, [stockLogs, isLoaded]);


  // SALES CRUD
  const addSale = (saleData: Omit<Sale, "id" | "totalAmount">) => {
    const totalAmount = saleData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const saleId = `SAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSale: Sale = {
      ...saleData,
      id: saleId,
      totalAmount,
    };

    setSales((prev) => [newSale, ...prev]);

    // Automatically deduct stock levels for this sale
    setStockLevels((prevStock) => {
      const updated = prevStock.map((s) => {
        const itemInSale = saleData.items.find((i) => i.productId === s.productId);
        if (itemInSale) {
          // Add a stock log
          const newLog: StockLog = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            productId: s.productId,
            productTitle: itemInSale.productTitle,
            type: "sale",
            quantity: -itemInSale.quantity,
            date: saleData.date,
            note: `Sold in order ${saleId} to ${saleData.customerName}`,
          };
          setStockLogs((logs) => [newLog, ...logs]);
          return {
            ...s,
            stockLevel: Math.max(0, s.stockLevel - itemInSale.quantity),
          };
        }
        return s;
      });
      return updated;
    });
  };

  const updateSale = (id: string, updatedFields: Partial<Sale>) => {
    setSales((prev) =>
      prev.map((sale) => {
        if (sale.id === id) {
          const merged = { ...sale, ...updatedFields };
          if (updatedFields.items) {
            merged.totalAmount = updatedFields.items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0,
            );
          }
          return merged;
        }
        return sale;
      })
    );
  };

  const deleteSale = (id: string) => {
    // Find sale first to restore stock
    const saleToDelete = sales.find((s) => s.id === id);
    if (!saleToDelete) return;

    setSales((prev) => prev.filter((s) => s.id !== id));

    // Restore stock levels
    setStockLevels((prevStock) =>
      prevStock.map((s) => {
        const itemInSale = saleToDelete.items.find((i) => i.productId === s.productId);
        if (itemInSale) {
          const newLog: StockLog = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            productId: s.productId,
            productTitle: itemInSale.productTitle,
            type: "adjustment",
            quantity: itemInSale.quantity,
            date: new Date().toISOString().split("T")[0],
            note: `Restored stock from deleted order ${id}`,
          };
          setStockLogs((logs) => [newLog, ...logs]);
          return {
            ...s,
            stockLevel: s.stockLevel + itemInSale.quantity,
          };
        }
        return s;
      })
    );
  };


  // EXPENSES CRUD
  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const expenseId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
    const newExpense: Expense = {
      ...expenseData,
      id: expenseId,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updatedFields } : exp))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };


  // STOCK ACTIONS
  const updateStockProfile = (
    productId: string,
    stockLevel: number,
    safetyThreshold: number,
    unitCost: number,
    logNote = "Manual inventory settings profile update"
  ) => {
    setStockLevels((prev) =>
      prev.map((s) => {
        if (s.productId === productId) {
          const diff = stockLevel - s.stockLevel;
          if (diff !== 0) {
            const prod = catalogProducts.find((p) => p.id === productId);
            const newLog: StockLog = {
              id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              productId,
              productTitle: prod?.title || productId,
              type: "adjustment",
              quantity: diff,
              date: new Date().toISOString().split("T")[0],
              note: logNote,
            };
            setStockLogs((logs) => [newLog, ...logs]);
          }
          return { productId, stockLevel, safetyThreshold, unitCost };
        }
        return s;
      })
    );
  };

  const adjustStockLevel = (productId: string, delta: number, note = "Inline manual count adjustment") => {
    setStockLevels((prev) =>
      prev.map((s) => {
        if (s.productId === productId) {
          const prod = catalogProducts.find((p) => p.id === productId);
          const newLevel = Math.max(0, s.stockLevel + delta);
          const actualChange = newLevel - s.stockLevel;
          
          if (actualChange !== 0) {
            const newLog: StockLog = {
              id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              productId,
              productTitle: prod?.title || productId,
              type: "adjustment",
              quantity: actualChange,
              date: new Date().toISOString().split("T")[0],
              note,
            };
            setStockLogs((logs) => [newLog, ...logs]);
          }

          return { ...s, stockLevel: newLevel };
        }
        return s;
      })
    );
  };

  const logRestock = (productId: string, quantity: number, unitCost: number, note = "Restock shipment received") => {
    setStockLevels((prev) =>
      prev.map((s) => {
        if (s.productId === productId) {
          const prod = catalogProducts.find((p) => p.id === productId);
          
          const newLog: StockLog = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            productId,
            productTitle: prod?.title || productId,
            type: "restock",
            quantity,
            date: new Date().toISOString().split("T")[0],
            note,
          };
          setStockLogs((logs) => [newLog, ...logs]);

          // Calculate weighted cost average if cost changed
          const totalCost = (s.stockLevel * s.unitCost) + (quantity * unitCost);
          const totalQty = s.stockLevel + quantity;
          const averageCost = totalQty > 0 ? Math.round(totalCost / totalQty) : unitCost;

          // Automatically record cost as an expense
          addExpense({
            title: `Restock Material: ${prod?.title || productId} (x${quantity})`,
            amount: quantity * unitCost,
            category: "materials",
            date: new Date().toISOString().split("T")[0],
            status: "paid",
          });

          return {
            ...s,
            stockLevel: totalQty,
            unitCost: averageCost,
          };
        }
        return s;
      })
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        sales,
        expenses,
        stockLevels,
        stockLogs,
        addSale,
        updateSale,
        deleteSale,
        addExpense,
        updateExpense,
        deleteExpense,
        updateStockProfile,
        adjustStockLevel,
        logRestock,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
