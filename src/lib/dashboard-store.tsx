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
  channel?: "direct" | "website" | "instagram" | "tiktok" | "facebook" | string;
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

export type MaterialCategory = "wax" | "wicks" | "fragrance" | "moulding" | "packaging" | "tools" | "vessels" | "other";

export interface RawMaterialStock {
  id: string;
  name: string;
  category: MaterialCategory;
  unit: string; // "kg", "pcs", "packs", "bottles", "sheets", "rolls", "units", "moulds"
  stockLevel: number;
  safetyThreshold: number;
  unitCost: number;
  img: string;
}

export interface StockLog {
  id: string;
  materialId: string;
  materialName: string;
  type: "restock" | "usage" | "adjustment";
  quantity: number;
  unit: string;
  date: string;
  note: string;
}

export type TrashEntityType = "product" | "sale" | "expense" | "material";

export interface TrashItem<T = any> {
  id: string;
  entityId: string;
  entityType: TrashEntityType;
  title: string;
  subtitle: string;
  deletedAt: string;
  expiresAt: string;
  data: T;
}

export const DEFAULT_RAW_MATERIALS: RawMaterialStock[] = [
  {
    id: "soy-wax-flakes",
    name: "Soy Wax (Flakes)",
    category: "wax",
    unit: "kg",
    stockLevel: 25,
    safetyThreshold: 10,
    unitCost: 550,
    img: "/images/IMG_4171.jpg",
  },
  {
    id: "soy-wax-palettes",
    name: "Soy Wax (Palettes / Beads)",
    category: "wax",
    unit: "kg",
    stockLevel: 20,
    safetyThreshold: 8,
    unitCost: 580,
    img: "/images/IMG_4171.jpg",
  },
  {
    id: "gel-wax",
    name: "Gel Wax (Transparent)",
    category: "wax",
    unit: "kg",
    stockLevel: 15,
    safetyThreshold: 5,
    unitCost: 600,
    img: "/images/IMG_4174.jpg",
  },
  {
    id: "stone-plaster",
    name: "Stone Plaster (High Strength)",
    category: "moulding",
    unit: "kg",
    stockLevel: 40,
    safetyThreshold: 15,
    unitCost: 180,
    img: "/images/IMG_4521.PNG",
  },
  {
    id: "cotton-wicks",
    name: "Cotton Candle Wicks (Pre-Waxed)",
    category: "wicks",
    unit: "pcs",
    stockLevel: 120,
    safetyThreshold: 30,
    unitCost: 8,
    img: "/images/IMG_4522.PNG",
  },
  {
    id: "wick-stickers",
    name: "Wick Glue Stickers (Double-Sided)",
    category: "wicks",
    unit: "packs",
    stockLevel: 12,
    safetyThreshold: 4,
    unitCost: 150,
    img: "/images/IMG_4523.JPG",
  },
  {
    id: "wick-holders",
    name: "Metal Wick Centering Holders",
    category: "wicks",
    unit: "pcs",
    stockLevel: 35,
    safetyThreshold: 10,
    unitCost: 45,
    img: "/images/IMG_4524.PNG",
  },
  {
    id: "wax-thread",
    name: "Braided Wax Thread (Spool)",
    category: "wicks",
    unit: "rolls",
    stockLevel: 8,
    safetyThreshold: 2,
    unitCost: 350,
    img: "/images/IMG_4525.JPG",
  },
  {
    id: "fragrance-lavender",
    name: "Fragrance Oil - French Lavender",
    category: "fragrance",
    unit: "bottles",
    stockLevel: 6,
    safetyThreshold: 2,
    unitCost: 650,
    img: "/images/IMG_4526.JPG",
  },
  {
    id: "fragrance-vanilla",
    name: "Fragrance Oil - Warm Vanilla Bean",
    category: "fragrance",
    unit: "bottles",
    stockLevel: 8,
    safetyThreshold: 2,
    unitCost: 650,
    img: "/images/IMG_4526.JPG",
  },
  {
    id: "fragrance-sandalwood",
    name: "Fragrance Oil - Amber Sandalwood",
    category: "fragrance",
    unit: "bottles",
    stockLevel: 5,
    safetyThreshold: 2,
    unitCost: 750,
    img: "/images/IMG_4526.JPG",
  },
  {
    id: "candle-color-dyes",
    name: "Candle Color Dyes & Pigments",
    category: "wax",
    unit: "packs",
    stockLevel: 18,
    safetyThreshold: 5,
    unitCost: 220,
    img: "/images/IMG_4527.PNG",
  },
  {
    id: "warning-stickers",
    name: "Safety Warning Labels (Bottom)",
    category: "packaging",
    unit: "sheets",
    stockLevel: 25,
    safetyThreshold: 8,
    unitCost: 120,
    img: "/images/IMG_4528.JPG",
  },
  {
    id: "thank-you-stickers",
    name: "Thank You Finishing Stickers",
    category: "packaging",
    unit: "sheets",
    stockLevel: 30,
    safetyThreshold: 10,
    unitCost: 120,
    img: "/images/IMG_4529.JPG",
  },
  {
    id: "silicone-mould-rose",
    name: "Silicone Mould - Blooming Rose",
    category: "moulding",
    unit: "moulds",
    stockLevel: 4,
    safetyThreshold: 1,
    unitCost: 450,
    img: "/images/IMG_4181.jpg",
  },
  {
    id: "silicone-mould-tulip",
    name: "Silicone Mould - Spring Tulip",
    category: "moulding",
    unit: "moulds",
    stockLevel: 3,
    safetyThreshold: 1,
    unitCost: 450,
    img: "/images/IMG_4181.jpg",
  },
  {
    id: "silicone-mould-bubble",
    name: "Silicone Mould - Geometric Bubble Cube",
    category: "moulding",
    unit: "moulds",
    stockLevel: 6,
    safetyThreshold: 2,
    unitCost: 550,
    img: "/images/IMG_4181.jpg",
  },
  {
    id: "glass-jars-200ml",
    name: "Frosted Amber Glass Jars (200ml)",
    category: "vessels",
    unit: "units",
    stockLevel: 45,
    safetyThreshold: 15,
    unitCost: 110,
    img: "/images/IMG_4177.jpg",
  },
  {
    id: "regular-melting-pot",
    name: "Wax Melting Pot (Pouring Pitcher)",
    category: "tools",
    unit: "units",
    stockLevel: 4,
    safetyThreshold: 1,
    unitCost: 850,
    img: "/images/IMG_5123.JPG",
  },
  {
    id: "thermometer",
    name: "Precision Wax Thermometer",
    category: "tools",
    unit: "units",
    stockLevel: 5,
    safetyThreshold: 2,
    unitCost: 420,
    img: "/images/IMG_4526.JPG",
  },
  {
    id: "heat-gun",
    name: "Industrial Heat Gun",
    category: "tools",
    unit: "units",
    stockLevel: 3,
    safetyThreshold: 1,
    unitCost: 650,
    img: "/images/IMG_4530.JPG",
  }
];

interface DashboardContextType {
  sales: Sale[];
  expenses: Expense[];
  rawMaterials: RawMaterialStock[];
  stockLogs: StockLog[];
  trashItems: TrashItem[];
  isLoading: boolean;
  
  // Sales CRUD
  addSale: (sale: Omit<Sale, "id" | "totalAmount">) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  
  // Expenses CRUD
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Raw Material Actions
  addRawMaterial: (material: Omit<RawMaterialStock, "id">) => Promise<void>;
  updateRawMaterial: (id: string, material: Partial<RawMaterialStock>) => Promise<void>;
  deleteRawMaterial: (id: string) => Promise<void>;
  adjustMaterialStock: (id: string, delta: number, note?: string) => Promise<void>;
  restockMaterial: (id: string, quantity: number, unitCost: number, note?: string) => Promise<void>;
  
  // Recycle Bin (30-Day Trash & Recovery)
  moveToTrash: (
    entityType: TrashEntityType, 
    entityId: string, 
    title: string, 
    data: any, 
    subtitle?: string
  ) => Promise<string>;
  restoreFromTrash: (trashId: string) => Promise<TrashItem | null>;
  permanentlyDelete: (trashId: string) => Promise<void>;
  emptyTrash: () => Promise<void>;

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

export function DashboardStoreProvider({ children }: ProviderProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialStock[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
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
          customerEmail: row.customer_email || "",
          items: Array.isArray(row.items) ? row.items : [],
          totalAmount: Number(row.total_amount),
          date: row.sale_date,
          status: row.status,
        })));
      } else {
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

      // 3. Fetch Raw Materials Stock Levels
      const { data: stockData, error: stockErr } = await supabase
        .from("stock_levels")
        .select("*");

      if (!stockErr && stockData && stockData.length > 0) {
        const dbMap = new Map(stockData.map((s) => [s.product_id, s]));
        const merged = DEFAULT_RAW_MATERIALS.map((item) => {
          const row = dbMap.get(item.id);
          if (row) {
            return {
              ...item,
              stockLevel: Number(row.stock_level),
              safetyThreshold: Number(row.safety_threshold),
              unitCost: Number(row.unit_cost),
            };
          }
          return item;
        });

        // Add any custom added materials in DB
        stockData.forEach((row) => {
          if (!DEFAULT_RAW_MATERIALS.some((m) => m.id === row.product_id)) {
            merged.push({
              id: row.product_id,
              name: row.product_name || row.product_id,
              category: (row.category as MaterialCategory) || "wax",
              unit: row.unit || "kg",
              stockLevel: Number(row.stock_level),
              safetyThreshold: Number(row.safety_threshold),
              unitCost: Number(row.unit_cost),
              img: row.img || "",
            });
          }
        });

        setRawMaterials(merged);
      } else {
        const saved = localStorage.getItem("nivati_raw_materials");
        if (saved) {
          setRawMaterials(JSON.parse(saved));
        } else {
          setRawMaterials(DEFAULT_RAW_MATERIALS);
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
          materialId: row.product_id,
          materialName: row.product_title,
          type: row.type as "restock" | "usage" | "adjustment",
          quantity: Number(row.quantity),
          unit: row.unit || "units",
          date: row.log_date,
          note: row.note || "",
        })));
      } else {
        const saved = localStorage.getItem("nivati_raw_materials_logs");
        if (saved) setStockLogs(JSON.parse(saved));
      }

      // 5. Fetch Recycle Bin Items
      const { data: trashData, error: trashErr } = await supabase
        .from("recycle_bin")
        .select("*")
        .order("deleted_at", { ascending: false });

      const now = Date.now();

      if (!trashErr && trashData) {
        // Auto-purge any items that have passed 30 days
        const activeTrash: TrashItem[] = [];
        const expiredIds: string[] = [];

        trashData.forEach((row) => {
          const expiresTime = new Date(row.expires_at).getTime();
          if (expiresTime > now) {
            activeTrash.push({
              id: row.id,
              entityId: row.entity_id,
              entityType: row.entity_type as TrashEntityType,
              title: row.title,
              subtitle: row.subtitle || "",
              deletedAt: row.deleted_at,
              expiresAt: row.expires_at,
              data: row.payload,
            });
          } else {
            expiredIds.push(row.id);
          }
        });

        setTrashItems(activeTrash);

        // Delete expired records from DB in background
        if (expiredIds.length > 0) {
          await supabase.from("recycle_bin").delete().in("id", expiredIds);
        }
      } else {
        const saved = localStorage.getItem("nivati_recycle_bin");
        if (saved) {
          const parsed: TrashItem[] = JSON.parse(saved);
          const valid = parsed.filter((item) => new Date(item.expiresAt).getTime() > now);
          setTrashItems(valid);
        }
      }

    } catch (e) {
      console.error("Failed to load dashboard store data:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      localStorage.setItem("nivati_raw_materials", JSON.stringify(rawMaterials));
    }
  }, [rawMaterials, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("nivati_raw_materials_logs", JSON.stringify(stockLogs));
    }
  }, [stockLogs, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("nivati_recycle_bin", JSON.stringify(trashItems));
    }
  }, [trashItems, isLoading]);


  // ==============================================================================
  // RECYCLE BIN ACTIONS (30-Day Trash & Recovery)
  // ==============================================================================
  const moveToTrash = async (
    entityType: TrashEntityType, 
    entityId: string, 
    title: string, 
    data: any, 
    subtitle = ""
  ): Promise<string> => {
    const trashId = `TRASH-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const deletedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newTrashItem: TrashItem = {
      id: trashId,
      entityId,
      entityType,
      title,
      subtitle,
      deletedAt,
      expiresAt,
      data,
    };

    setTrashItems((prev) => [newTrashItem, ...prev]);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("recycle_bin").insert([{
        id: trashId,
        entity_id: entityId,
        entity_type: entityType,
        title,
        subtitle,
        deleted_at: deletedAt,
        expires_at: expiresAt,
        payload: data,
      }]);
    } catch (e) {
      console.error("Error writing trash item to database:", e);
    }

    return trashId;
  };

  const restoreFromTrash = async (trashId: string): Promise<TrashItem | null> => {
    const item = trashItems.find((t) => t.id === trashId);
    if (!item) return null;

    setTrashItems((prev) => prev.filter((t) => t.id !== trashId));

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("recycle_bin").delete().eq("id", trashId);

      // Re-insert into respective active store
      if (item.entityType === "sale") {
        const sale: Sale = item.data;
        setSales((prev) => [sale, ...prev]);
        await supabase.from("sales").insert([{
          id: sale.id,
          customer_name: sale.customerName,
          customer_email: sale.customerEmail,
          items: sale.items,
          total_amount: sale.totalAmount,
          status: sale.status,
          sale_date: sale.date,
        }]);
      } else if (item.entityType === "expense") {
        const expense: Expense = item.data;
        setExpenses((prev) => [expense, ...prev]);
        await supabase.from("expenses").insert([{
          id: expense.id,
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          status: expense.status,
          expense_date: expense.date,
        }]);
      } else if (item.entityType === "material") {
        const material: RawMaterialStock = item.data;
        setRawMaterials((prev) => [material, ...prev]);
        await supabase.from("stock_levels").insert([{
          product_id: material.id,
          product_name: material.name,
          category: material.category,
          unit: material.unit,
          stock_level: material.stockLevel,
          safety_threshold: material.safetyThreshold,
          unit_cost: material.unitCost,
          img: material.img,
        }]);
      } else if (item.entityType === "product") {
        const productPayload = item.data;
        await supabase.from("products").insert([productPayload]);
      }

    } catch (e) {
      console.error("Error restoring trash item from database:", e);
    }

    return item;
  };

  const permanentlyDelete = async (trashId: string) => {
    setTrashItems((prev) => prev.filter((t) => t.id !== trashId));

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("recycle_bin").delete().eq("id", trashId);
    } catch (e) {
      console.error("Error permanently deleting trash item:", e);
    }
  };

  const emptyTrash = async () => {
    const ids = trashItems.map((t) => t.id);
    setTrashItems([]);

    try {
      const supabase = createSupabaseBrowserClient();
      if (ids.length > 0) {
        await supabase.from("recycle_bin").delete().in("id", ids);
      }
    } catch (e) {
      console.error("Error emptying recycle bin:", e);
    }
  };


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

    setSales((prev) => [newSale, ...prev]);

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

    // Move to 30-Day Recycle Bin
    await moveToTrash(
      "sale",
      id,
      `Sale ${saleToDelete.id} (${saleToDelete.customerName})`,
      saleToDelete,
      `Rs ${saleToDelete.totalAmount.toLocaleString()} • ${saleToDelete.items.length} items`
    );

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("sales").delete().eq("id", id);
    } catch (e) {
      console.error("Error deleting sale in database:", e);
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
    const expToDelete = expenses.find((e) => e.id === id);
    if (!expToDelete) return;

    setExpenses((prev) => prev.filter((exp) => exp.id !== id));

    // Move to 30-Day Recycle Bin
    await moveToTrash(
      "expense",
      id,
      expToDelete.title,
      expToDelete,
      `Rs ${expToDelete.amount.toLocaleString()} • ${expToDelete.category}`
    );

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("expenses").delete().eq("id", id);
    } catch (e) {
      console.error("Error deleting expense in database:", e);
    }
  };


  // ==============================================================================
  // RAW MATERIAL STOCK ACTIONS
  // ==============================================================================
  const addRawMaterial = async (materialData: Omit<RawMaterialStock, "id">) => {
    const slug = materialData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    const newMaterial: RawMaterialStock = {
      ...materialData,
      id,
    };

    setRawMaterials((prev) => [...prev, newMaterial]);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_levels").insert([{
        product_id: id,
        product_name: materialData.name,
        category: materialData.category,
        unit: materialData.unit,
        stock_level: materialData.stockLevel,
        safety_threshold: materialData.safetyThreshold,
        unit_cost: materialData.unitCost,
        img: materialData.img,
      }]);
    } catch (e) {
      console.error("Error saving raw material to database:", e);
    }
  };

  const updateRawMaterial = async (id: string, updatedFields: Partial<RawMaterialStock>) => {
    setRawMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );

    try {
      const supabase = createSupabaseBrowserClient();
      const payload: Record<string, unknown> = {};
      if (updatedFields.name !== undefined) payload.product_name = updatedFields.name;
      if (updatedFields.category !== undefined) payload.category = updatedFields.category;
      if (updatedFields.unit !== undefined) payload.unit = updatedFields.unit;
      if (updatedFields.stockLevel !== undefined) payload.stock_level = updatedFields.stockLevel;
      if (updatedFields.safetyThreshold !== undefined) payload.safety_threshold = updatedFields.safetyThreshold;
      if (updatedFields.unitCost !== undefined) payload.unit_cost = updatedFields.unitCost;
      if (updatedFields.img !== undefined) payload.img = updatedFields.img;

      await supabase.from("stock_levels").upsert({
        product_id: id,
        ...payload,
      });
    } catch (e) {
      console.error("Error updating raw material in database:", e);
    }
  };

  const deleteRawMaterial = async (id: string) => {
    const matToDelete = rawMaterials.find((m) => m.id === id);
    if (!matToDelete) return;

    setRawMaterials((prev) => prev.filter((m) => m.id !== id));

    // Move to 30-Day Recycle Bin
    await moveToTrash(
      "material",
      id,
      matToDelete.name,
      matToDelete,
      `${matToDelete.stockLevel} ${matToDelete.unit} • Rs ${matToDelete.unitCost}/${matToDelete.unit}`
    );

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_levels").delete().eq("product_id", id);
    } catch (e) {
      console.error("Error deleting raw material from database:", e);
    }
  };

  const adjustMaterialStock = async (
    id: string, 
    delta: number, 
    note = "Manual count adjustment"
  ) => {
    let finalLevel = 0;
    let materialUnit = "units";
    let materialName = id;

    setRawMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          finalLevel = Math.max(0, m.stockLevel + delta);
          materialUnit = m.unit;
          materialName = m.name;
          return { ...m, stockLevel: finalLevel };
        }
        return m;
      })
    );

    const logId = `LOG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newLog: StockLog = {
      id: logId,
      materialId: id,
      materialName,
      type: delta >= 0 ? "adjustment" : "usage",
      quantity: delta,
      unit: materialUnit,
      date: new Date().toISOString().split("T")[0],
      note,
    };
    setStockLogs((logs) => [newLog, ...logs]);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_logs").insert([{
        id: logId,
        product_id: id,
        product_title: materialName,
        type: delta >= 0 ? "adjustment" : "usage",
        quantity: delta,
        unit: materialUnit,
        log_date: new Date().toISOString().split("T")[0],
        note,
      }]);

      await supabase.from("stock_levels").upsert({
        product_id: id,
        stock_level: finalLevel,
      });
    } catch (e) {
      console.error("Error updating adjusted raw material in database:", e);
    }
  };

  const restockMaterial = async (
    id: string, 
    quantity: number, 
    unitCost: number, 
    note = "Raw material shipment received"
  ) => {
    const mat = rawMaterials.find((m) => m.id === id);
    const prevQty = mat?.stockLevel || 0;
    const prevCost = mat?.unitCost || unitCost;

    const totalCost = (prevQty * prevCost) + (quantity * unitCost);
    const totalQty = prevQty + quantity;
    const averageCost = totalQty > 0 ? Math.round(totalCost / totalQty) : unitCost;
    const matName = mat?.name || id;
    const matUnit = mat?.unit || "units";

    setRawMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stockLevel: totalQty, unitCost: averageCost } : m))
    );

    const logId = `LOG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newLog: StockLog = {
      id: logId,
      materialId: id,
      materialName: matName,
      type: "restock",
      quantity,
      unit: matUnit,
      date: new Date().toISOString().split("T")[0],
      note,
    };
    setStockLogs((logs) => [newLog, ...logs]);

    // Automatically record shipment in Operating Expenses ledger
    await addExpense({
      title: `Restock Raw Material: ${matName} (+${quantity} ${matUnit})`,
      amount: quantity * unitCost,
      category: "materials",
      date: new Date().toISOString().split("T")[0],
      status: "paid",
    });

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.from("stock_logs").insert([{
        id: logId,
        product_id: id,
        product_title: matName,
        type: "restock",
        quantity,
        unit: matUnit,
        log_date: new Date().toISOString().split("T")[0],
        note,
      }]);

      await supabase.from("stock_levels").upsert({
        product_id: id,
        stock_level: totalQty,
        unit_cost: averageCost,
      });
    } catch (e) {
      console.error("Error logging raw material restock in database:", e);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        sales,
        expenses,
        rawMaterials,
        stockLogs,
        trashItems,
        isLoading,
        addSale,
        updateSale,
        deleteSale,
        addExpense,
        updateExpense,
        deleteExpense,
        addRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        adjustMaterialStock,
        restockMaterial,
        moveToTrash,
        restoreFromTrash,
        permanentlyDelete,
        emptyTrash,
        refreshData: fetchAllData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
