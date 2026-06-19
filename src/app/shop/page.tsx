import type { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "@/components/ShopContent";
import { getPublicCatalogProducts } from "@/lib/catalog-server";

export const metadata: Metadata = {
  title: "Shop All Collections | Nivati",
  description: "Browse Nivati's hand-poured soy and gel candles, concrete jar candle collections, and custom candle making kits and materials.",
};

export default async function ShopPage() {
  const products = await getPublicCatalogProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-creme flex items-center justify-center"><h2 className="text-olive font-serif text-2xl animate-pulse">Loading Collection...</h2></div>}>
      <ShopContent products={products} />
    </Suspense>
  );
}
