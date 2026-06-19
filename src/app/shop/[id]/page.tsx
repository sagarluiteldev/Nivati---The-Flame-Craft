import type { Metadata } from "next";
import Link from "next/link";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getPublicCatalogProducts } from "@/lib/catalog-server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const products = await getPublicCatalogProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found | Nivati",
    };
  }

  return {
    title: `${product.title} | Nivati — The Flame Craft`,
    description: `${product.description.substring(0, 155)}...`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const products = await getPublicCatalogProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen py-32 flex flex-col items-center justify-center bg-creme">
        <h1 className="text-4xl font-serif text-olive mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-olive hover:underline">
          Return to Shop
        </Link>
      </main>
    );
  }

  return <ProductDetailClient product={product} />;
}
