"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { products } from "@/lib/data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened and lock body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const results = query.trim() === "" 
    ? [] 
    : products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col justify-start pt-20 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-creme/90 dark:bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-3xl mx-auto flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-0 right-0 z-10 p-2 text-olive/50 hover:text-olive dark:text-creme/50 dark:hover:text-creme transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative border-b-2 border-olive/20 dark:border-creme/20 pb-4 mb-8 pr-12">
              <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-olive/40 dark:text-creme/40" />
              <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scents, kits..."
                className="w-full bg-transparent text-4xl md:text-6xl font-serif text-olive dark:text-creme placeholder-olive/20 dark:placeholder-creme/20 outline-hidden pl-12"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
              {query.length > 0 && results.length === 0 && (
                <p className="text-xl text-olive/60 dark:text-creme/60 text-center py-12">
                  No results found for "{query}".
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((product) => (
                  <Link 
                    href={`/shop/${product.id}`} 
                    key={product.id}
                    onClick={onClose}
                    className="flex gap-4 items-center p-4 rounded-2xl hover:bg-olive/5 dark:hover:bg-creme/5 transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-olive/10 dark:bg-creme/10 relative shrink-0">
                      <img src={product.img} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-olive/50 dark:text-creme/50">{product.category}</span>
                      <h4 className="text-xl font-serif text-olive dark:text-creme">{product.title}</h4>
                      <p className="text-olive/80 dark:text-creme/80">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {query.length === 0 && (
              <div className="mt-8 opacity-50">
                <p className="text-sm uppercase tracking-widest text-olive dark:text-creme mb-4">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Signature Candles", "Kits", "Fig", "Matcha"].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 rounded-full border border-olive/20 dark:border-creme/20 text-olive dark:text-creme hover:bg-olive hover:text-creme dark:hover:bg-creme dark:hover:text-olive transition-colors text-sm"
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
