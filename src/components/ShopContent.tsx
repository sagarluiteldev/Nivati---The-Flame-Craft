"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftIcon as ArrowLeft } from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/QuickViewModal";
import { Product } from "@/lib/data";
import Image from "next/image";

interface ShopContentProps {
  products: Product[];
}

export default function ShopContent({ products }: ShopContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["All", "Signature Candles", "Concrete Jar Candles", "Basic Jar Candles", "Mould Candles", "Premium Jar Candles", "Gel&Soy Jar", "Mini Jar", "Concrete Pots & More", "Candle Making Kit", "Candle Making Materials"];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => Array.isArray(p.category) ? p.category.includes(activeCategory) : p.category === activeCategory);

  return (
    <main className="min-h-screen flex flex-col pt-32 bg-creme transition-colors duration-700">
      <Navbar />
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={quickViewProduct} 
      />
      
      <div className="grow max-w-7xl mx-auto px-6 w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-olive/60 hover:text-olive transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-6xl font-serif text-olive ">All Collections</h1>
          </div>
        </div>

        {/* Categories Dropdown Filter */}
        <div className="relative mb-12 z-40">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-3 px-6 py-3 bg-olive/5 border border-olive/10 text-olive rounded-full text-sm font-medium hover:bg-olive/10 transition-all select-none cursor-pointer"
          >
            <span>Category: <strong className="text-olive font-semibold">{activeCategory}</strong></span>
            <svg 
              className={`w-4 h-4 text-olive/60 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              {/* Overlay backdrop to close on outside click */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div 
                className="absolute left-0 mt-2 w-64 bg-creme border border-olive/10 rounded-2xl shadow-xl z-40 p-2 flex flex-col gap-1"
              >
                {categories.map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (cat === "All") {
                        params.delete("category");
                      } else {
                        params.set("category", cat);
                      }
                      router.push(`/shop?${params.toString()}`, { scroll: false });
                      setIsDropdownOpen(false);
                    }}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-olive text-creme font-medium' 
                        : 'text-olive/80 hover:bg-olive/5'
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && (
                      <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Uniform Grid Layout */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                className="col-span-1 aspect-4/5 md:aspect-3/4 relative rounded-3xl overflow-hidden group bg-olive/5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Link href={`/shop/${product.id}`} className="block h-full w-full">
                  <div className="absolute inset-0 bg-olive/10 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-0" style={{ transform: "translateZ(0)" }} />
                  <Image 
                    src={product.img} 
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                  />
                  
                  <div className="absolute top-6 left-6 z-20 flex gap-2">
                    {product.tag && (
                      <span className="px-3 py-1 bg-creme text-olive text-xs font-medium tracking-wide rounded-full">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* Quick View Button - Desktop Only */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                    className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-creme/90 backdrop-blur-md text-olive px-6 py-2.5 rounded-full font-medium tracking-wide shadow-lg hover:bg-creme hover:scale-105"
                  >
                    Quick View
                  </button>

                  {/* Scent Note Hover Micro-Animation */}
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    {product.scentNotes && product.scentNotes.top !== "Unscented" && product.scentNotes.top !== "Customize your own" && (
                      <>
                        <span className="px-3 py-1 bg-creme/90 backdrop-blur-sm text-olive text-xs font-medium rounded-full shadow-sm delay-75">
                          Top: {product.scentNotes.top.split(',')[0]}
                        </span>
                        <span className="px-3 py-1 bg-creme/90 backdrop-blur-sm text-olive text-xs font-medium rounded-full shadow-sm delay-150">
                          Mid: {product.scentNotes.mid.split(',')[0]}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6 bg-linear-to-t from-olive/90 via-olive/40 to-transparent flex justify-between items-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div>
                      <h3 className="text-sm md:text-xl font-serif text-creme mb-0.5 md:mb-1">{product.title}</h3>
                      <p className="text-creme/80 font-sans font-light text-xs md:text-sm">Rs {product.price}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-creme text-olive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105">
                      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 rotate-135" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Footer />
    </main>
  );
}
