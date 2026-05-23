import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

import {
  mapProductRowToAdminProduct,
  mapProductRowToProduct,
  seedProducts,
  type AdminCatalogProduct,
  type ProductRow,
} from "@/lib/catalog";
import type { Product } from "@/lib/data";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const PRODUCT_SELECT_FIELDS = `
  id,
  title,
  description,
  price,
  tag,
  size_tag,
  primary_image,
  gallery,
  categories,
  scent_top,
  scent_mid,
  scent_base,
  is_active,
  sort_order,
  created_at,
  updated_at
`;

export async function getPublicCatalogProducts(): Promise<Product[]> {
  noStore();

  if (!hasSupabaseEnv()) {
    return seedProducts;
  }

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_FIELDS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load public catalog from Supabase:", error.message);
    return seedProducts;
  }

  if (!data || data.length === 0) {
    return seedProducts;
  }

  return data.map((row) => mapProductRowToProduct(row as ProductRow));
}

export async function getAdminCatalogProducts(
  supabase: Pick<SupabaseClient, "from">,
): Promise<{ products: AdminCatalogProduct[]; errorMessage: string | null }> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_FIELDS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      products: [],
      errorMessage: error.message,
    };
  }

  return {
    products: (data ?? []).map((row) =>
      mapProductRowToAdminProduct(row as ProductRow),
    ),
    errorMessage: null,
  };
}
