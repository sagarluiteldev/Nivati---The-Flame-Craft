"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: Props) {
  const { addToCart } = useAppContext();

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.img
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-olive/40 dark:bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-creme dark:bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-creme/50 hover:bg-creme dark:bg-black/50 dark:hover:bg-black text-olive dark:text-creme rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="shrink-0 md:w-1/2 relative h-64 md:h-auto bg-olive/5 dark:bg-white/5">
              <img
                src={product.img}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 md:w-1/2 p-6 md:p-12 overflow-y-auto min-h-0">
              <span className="text-sm font-medium tracking-widest uppercase text-olive/60 dark:text-creme/60 mb-2 block">
                {product.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-olive dark:text-creme mb-4">
                {product.title}
              </h2>
              <p className="text-2xl font-light text-olive/80 dark:text-creme/80 mb-6">
                ${product.price}
              </p>
              
              <p className="text-olive/70 dark:text-creme/70 font-sans font-light leading-relaxed mb-8">
                {product.description}
              </p>

              {(product.scentNotes.top !== "Unscented" && product.scentNotes.top !== "Customize your own") && (
                <div className="mb-8 p-6 bg-olive/5 dark:bg-white/5 rounded-2xl">
                  <h4 className="font-serif text-lg text-olive dark:text-creme mb-4">Scent Profile</h4>
                  <ul className="space-y-3 text-sm font-light text-olive/80 dark:text-creme/80">
                    <li className="flex gap-4"><span className="w-12 font-medium">Top:</span> {product.scentNotes.top}</li>
                    <li className="flex gap-4"><span className="w-12 font-medium">Mid:</span> {product.scentNotes.mid}</li>
                    <li className="flex gap-4"><span className="w-12 font-medium">Base:</span> {product.scentNotes.base}</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-olive/10 dark:border-creme/10 mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-olive text-creme dark:bg-creme dark:text-olive rounded-full py-4 px-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium tracking-wide"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
