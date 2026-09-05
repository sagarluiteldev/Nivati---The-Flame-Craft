"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon as SearchIcon, XMarkIcon as X } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [catalogProducts, setCatalogProducts] = useState<typeof products>(products);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch active products from the API when the search overlay is opened
  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCatalogProducts(data);
        }
      })
      .catch((err) => {
        console.error("Error loading products for search:", err);
      });
  }, [isOpen]);

  // Focus input when opened and lock body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const results = query.trim() === "" 
    ? [] 
    : catalogProducts.filter(p => {
        const categoryMatch = Array.isArray(p.category) 
          ? p.category.some(c => c.toLowerCase().includes(query.toLowerCase()))
          : p.category.toLowerCase().includes(query.toLowerCase());
        return p.title.toLowerCase().includes(query.toLowerCase()) || 
               categoryMatch ||
               p.description.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col justify-start pt-20 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-creme/90  backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-3xl mx-auto flex flex-col"
          >
            <style>{`
              .search-popup-input::placeholder {
                color: rgba(0, 0, 0, 0.35) !important;
                -webkit-text-fill-color: rgba(0, 0, 0, 0.35) !important;
                opacity: 1 !important;
              }
              .search-popup-input {
                color: rgba(0, 0, 0, 0.8) !important;
                -webkit-text-fill-color: rgba(0, 0, 0, 0.8) !important;
              }
            `}</style>

            <button
              onClick={onClose}
              className="absolute top-0 right-0 z-10 p-2 text-black/50 hover:text-black/80 transition-colors"
              aria-label="Close search"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative border-b-2 border-black/15 pb-4 mb-8 pr-12">
              <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-black/40" />
              <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scents, kits..."
                className="search-popup-input w-full bg-transparent text-4xl md:text-6xl font-serif text-black/80 outline-none pl-12"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
              {query.length > 0 && results.length === 0 && (
                <p className="text-xl text-black/60 text-center py-12 font-medium">
                  No results found for &quot;{query}&quot;.
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((product) => (
                  <Link 
                    href={`/shop/${product.id}`} 
                    key={product.id}
                    onClick={onClose}
                    className="flex gap-4 items-center p-4 rounded-lg hover:bg-black/[0.03] transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-none overflow-hidden bg-black/5 relative shrink-0">
                      <Image src={product.img} alt={product.title} fill sizes="80px" loading="lazy" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-black/45 font-medium">{Array.isArray(product.category) ? product.category.join(", ") : product.category}</span>
                      <h4 className="text-xl font-serif text-black/80 font-medium">{product.title}</h4>
                      <p className="text-black/70 font-medium">Rs {product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {query.length === 0 && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest text-black/50 mb-4 font-semibold">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Signature Candles", "Kits", "Fig", "Matcha"].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 rounded-lg border border-black/20 text-black/70 hover:bg-black/5 hover:text-black/90 hover:border-black/40 transition-colors text-sm font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
