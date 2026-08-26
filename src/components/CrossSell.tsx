"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon as ArrowLeft, ShoppingBagIcon as ShoppingBag } from "@heroicons/react/24/outline";
import { products } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";

interface Props {
  currentProductId: string;
  category: string | string[];
}

export default function CrossSell({ currentProductId, category }: Props) {
  const { addToCart } = useAppContext();

  // Find related products in the same category, excluding the current one, limit to 4
  const recommendations = products
    .filter(p => {
      const pCats = Array.isArray(p.category) ? p.category : [p.category];
      const targetCats = Array.isArray(category) ? category : [category];
      const isRelated = pCats.some(cat => targetCats.includes(cat));
      return isRelated && p.id !== currentProductId;
    })
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
    <div className="py-24 border-t border-neutral-200 mt-12 w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-4">You May Also Like</h2>
          <p className="text-neutral-600">Explore more from our {Array.isArray(category) ? category[0].toLowerCase() : category.toLowerCase()} collection.</p>
        </div>
        <Link href="/shop" className="hidden md:inline-flex text-sm uppercase tracking-widest text-neutral-900 hover:text-black transition-colors items-center gap-2 font-medium">
          View All <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <Link href={`/shop/${product.id}`} key={product.id} className="group block">
            <div className="aspect-square rounded-none overflow-hidden bg-olive/5 relative mb-6">
              <div className="absolute inset-0 bg-olive/10 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-0" style={{ transform: "translateZ(0)" }} />
              <Image 
                src={product.img} 
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ transform: "translateZ(0)" }}
              />

              {/* Quick Add to Cart Round Icon Button - Bottom Right */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image: product.img
                  });
                }}
                className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-olive text-black hover:text-creme backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/15 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-black/10"
                aria-label={`Add ${product.title} to cart`}
                title="Add to cart"
              >
                <ShoppingBag className="w-5 h-5 md:w-5.5 md:h-5.5" />
              </button>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">{Array.isArray(product.category) ? product.category.join(" / ") : product.category}</span>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-neutral-900 group-hover:text-black/70 transition-colors">{product.title}</h3>
                <span className="text-neutral-800 font-medium">Rs {product.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center md:hidden">
        <Link href="/shop" className="inline-flex px-8 py-4 border border-neutral-300 rounded-lg text-sm uppercase tracking-widest text-neutral-900 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 hover:bg-neutral-900 hover:text-creme active:scale-[0.95] items-center gap-2 font-medium">
          View All <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
