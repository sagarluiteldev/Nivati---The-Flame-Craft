"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Filter, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/QuickViewModal";

import { products, Product } from "@/lib/data";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = ["All", "Signature Candles", "DIY Kits", "Raw Materials"];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <>
    <QuickViewModal 
      isOpen={isQuickViewOpen} 
      onClose={() => setIsQuickViewOpen(false)} 
      product={quickViewProduct} 
    />
    <main className="min-h-screen flex flex-col pt-24 bg-creme dark:bg-olive transition-colors duration-700">
      <Navbar />
      
      <div className="grow max-w-7xl mx-auto px-6 w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-olive/60 hover:text-olive transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif text-olive dark:text-creme">All Collections</h1>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 border border-olive/20 dark:border-creme/20 rounded-full text-olive dark:text-creme hover:bg-olive hover:text-creme dark:hover:bg-creme dark:hover:text-olive transition-colors text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide">
          {categories.map((cat, i) => (
             <button 
               key={i} 
               onClick={() => setActiveCategory(cat)}
               className={`whitespace-nowrap px-6 py-2 rounded-full text-sm transition-colors ${
                 activeCategory === cat 
                   ? 'bg-olive text-creme dark:bg-creme dark:text-olive' 
                   : 'bg-olive/5 text-olive hover:bg-olive/10 dark:bg-creme/5 dark:text-creme dark:hover:bg-creme/10'
               }`}
             >
               {cat}
             </button>
          ))}
        </div>

        {/* Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px] mb-24">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                key={product.id}
                className={product.sizeTag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Link href={`/shop/${product.id}`} className="block h-full w-full">
                  <div
                    className="group relative rounded-3xl overflow-hidden cursor-pointer bg-olive/5 dark:bg-creme/5 h-full w-full block"
                  >
                <div className="absolute inset-0 bg-olive/10 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-0" style={{ transform: "translateZ(0)" }} />
                <img 
                  src={product.img} 
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{ transform: "translateZ(0)" }}
                />
                
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                  {product.tag && (
                    <span className="px-3 py-1 bg-creme text-olive text-xs font-medium tracking-wide rounded-full">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Quick View Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewProduct(product);
                    setIsQuickViewOpen(true);
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-creme/90 backdrop-blur-md text-olive px-6 py-2.5 rounded-full font-medium tracking-wide shadow-lg hover:bg-creme hover:scale-105"
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

                <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 bg-linear-to-t from-olive/90 via-olive/40 to-transparent flex justify-between items-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div>
                    <h3 className="text-2xl font-serif text-creme mb-1">{product.title}</h3>
                    <p className="text-creme/80 font-sans font-light">${product.price}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-creme text-olive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105">
                    <ArrowLeft className="w-5 h-5 rotate-135" />
                  </div>
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
    </>
  );
}
