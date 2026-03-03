"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";

interface Props {
  product: Product;
}

export default function StickyBuyBar({ product }: Props) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useAppContext();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show the buy bar after scrolling past 600px (roughly past the main add-to-cart button)
    setIsVisible(latest > 600);
  });

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.img
    });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-creme/90 dark:bg-black/90 backdrop-blur-md border-t border-olive/10 dark:border-creme/10 px-6 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-4">
          <img src={product.img} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-olive/5" />
          <div>
            <h4 className="font-serif text-olive dark:text-creme text-lg">{product.title}</h4>
            <p className="text-olive/70 dark:text-creme/70 text-sm">${product.price}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <p className="md:hidden font-serif text-olive dark:text-creme text-lg flex-1">{product.title}</p>
          <div className="hidden sm:block text-olive dark:text-creme font-medium text-lg mr-2">
            ${product.price}
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 md:flex-none bg-olive text-creme dark:bg-creme dark:text-olive px-8 py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium tracking-wide shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
