"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { products, Product } from "@/lib/data";

interface Props {
  currentProductId: string;
  category: string;
}

export default function CrossSell({ currentProductId, category }: Props) {
  // Find related products in the same category, excluding the current one, limit to 4
  const recommendations = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  // If we don't have enough in the category, backfill with best sellers
  if (recommendations.length < 4) {
    const backfills = products
      .filter(p => p.id !== currentProductId && !recommendations.find(r => r.id === p.id))
      .slice(0, 4 - recommendations.length);
    recommendations.push(...backfills);
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="py-24 border-t border-olive/10 dark:border-creme/10 mt-12 w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-olive dark:text-creme mb-4">You May Also Like</h2>
          <p className="text-olive/60 dark:text-creme/60">Explore more from our {category.toLowerCase()} collection.</p>
        </div>
        <Link href="/shop" className="hidden md:inline-flex text-sm uppercase tracking-widest text-olive dark:text-creme hover:opacity-70 transition-opacity items-center gap-2">
          View All <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <Link href={`/shop/${product.id}`} key={product.id} className="group block">
            <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-olive/5 dark:bg-creme/5 relative mb-6">
              <div className="absolute inset-0 bg-olive/10 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-0" style={{ transform: "translateZ(0)" }} />
              <img 
                src={product.img} 
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ transform: "translateZ(0)" }}
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-olive/50 dark:text-creme/50 mb-2 block">{product.category}</span>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-olive dark:text-creme">{product.title}</h3>
                <span className="text-olive/80 dark:text-creme/80">${product.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center md:hidden">
        <Link href="/shop" className="inline-flex px-8 py-4 border border-olive/20 dark:border-creme/20 rounded-full text-sm uppercase tracking-widest text-olive dark:text-creme hover:bg-olive hover:text-creme dark:hover:bg-creme dark:hover:text-olive transition-colors items-center gap-2">
          View All <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
