import { products as seedCatalogProducts, type Product } from "@/lib/data";

export interface ProductRow {
  id: string;
  title: string;
  description: string;
  price: number | string;
  tag: string | null;
  size_tag: string | null;
  primary_image: string | null;
  gallery: string[] | null;
  categories: string[] | null;
  scent_top: string | null;
  scent_mid: string | null;
  scent_base: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminCatalogProduct extends Product {
  categories: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProductRecordInput {
  id: string;
  title: string;
  description: string;
  price: number;
  tag: string;
  size_tag: string;
  primary_image: string;
  gallery: string[];
  categories: string[];
  scent_top: string;
  scent_mid: string;
  scent_base: string;
  is_active: boolean;
  sort_order: number;
}

export const seedProducts = seedCatalogProducts;

export const KNOWN_CATEGORY_ORDER = [
  "Signature Candles",
  "Concrete Jar Candles",
  "Basic Jar Candles",
  "Mould Candles",
  "Premium Jar Candles",
  "Gel&Soy Jar",
  "Mini Jar",
  "Concrete Pots & More",
  "Candle Making Kit",
  "Candle Making Materials",
];

export const PRODUCT_GRID_SIZE_OPTIONS = Array.from(
  new Set(seedProducts.map((product) => product.sizeTag)),
);

export const DEFAULT_GRID_SIZE =
  PRODUCT_GRID_SIZE_OPTIONS[0] ?? "col-span-1 row-span-1";

export const DEFAULT_SCENT_NOTE = "Unscented";

export function normalizeCategories(category: string | string[]): string[] {
  return Array.isArray(category) ? category.filter(Boolean) : [category].filter(Boolean);
}

export function getPrimaryCategory(category: string | string[]): string {
  return normalizeCategories(category)[0] ?? "Uncategorized";
}

export function matchesCategory(
  product: Pick<Product, "category">,
  activeCategory: string,
) {
  if (activeCategory === "All") {
    return true;
  }

  return normalizeCategories(product.category).includes(activeCategory);
}

export function getCategoryList(products: Product[]) {
  const uniqueCategories = Array.from(
    new Set(products.flatMap((product) => normalizeCategories(product.category))),
  );

  const ordered = KNOWN_CATEGORY_ORDER.filter((category) =>
    uniqueCategories.includes(category),
  );

  const custom = uniqueCategories
    .filter((category) => !KNOWN_CATEGORY_ORDER.includes(category))
    .sort((left, right) => left.localeCompare(right));

  return ["All", ...ordered, ...custom];
}

export function productSupportsPersonalization(product: Pick<Product, "category">) {
  return ![
    "Concrete Pots & More",
    "Candle Making Kit",
    "Candle Making Materials",
  ].some((category) => normalizeCategories(product.category).includes(category));
}

export function mapProductRowToProduct(row: ProductRow): Product {
  const categories = row.categories?.filter(Boolean) ?? [];
  const gallery = row.gallery?.filter(Boolean) ?? [];
  const primaryImage = row.primary_image?.trim() || gallery[0] || "";

  return {
    id: row.id,
    title: row.title,
    price: Number(row.price ?? 0),
    sizeTag: row.size_tag?.trim() || DEFAULT_GRID_SIZE,
    img: primaryImage,
    gallery: gallery.length > 0 ? gallery : primaryImage ? [primaryImage] : [],
    tag: row.tag?.trim() || "",
    category: categories.length <= 1 ? categories[0] ?? "Uncategorized" : categories,
    description: row.description ?? "",
    scentNotes: {
      top: row.scent_top?.trim() || DEFAULT_SCENT_NOTE,
      mid: row.scent_mid?.trim() || DEFAULT_SCENT_NOTE,
      base: row.scent_base?.trim() || DEFAULT_SCENT_NOTE,
    },
  };
}

export function mapProductRowToAdminProduct(row: ProductRow): AdminCatalogProduct {
  const product = mapProductRowToProduct(row);
  const categories = row.categories?.filter(Boolean) ?? [];

  return {
    ...product,
    categories,
    category: categories.length <= 1 ? categories[0] ?? "Uncategorized" : categories,
    isActive: row.is_active ?? true,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

export function mapProductToRecordInput(product: Product): ProductRecordInput {
  const categories = normalizeCategories(product.category);
  const gallery = Array.from(new Set([product.img, ...product.gallery].filter(Boolean)));

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    tag: product.tag || "",
    size_tag: product.sizeTag || DEFAULT_GRID_SIZE,
    primary_image: product.img || gallery[0] || "",
    gallery,
    categories,
    scent_top: product.scentNotes.top || DEFAULT_SCENT_NOTE,
    scent_mid: product.scentNotes.mid || DEFAULT_SCENT_NOTE,
    scent_base: product.scentNotes.base || DEFAULT_SCENT_NOTE,
    is_active: true,
    sort_order: 0,
  };
}

export function sortProducts(products: Product[]) {
  return [...products].sort((left, right) => {
    const leftRank = seedProducts.findIndex((product) => product.id === left.id);
    const rightRank = seedProducts.findIndex((product) => product.id === right.id);

    if (leftRank !== -1 && rightRank !== -1 && leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.title.localeCompare(right.title);
  });
}