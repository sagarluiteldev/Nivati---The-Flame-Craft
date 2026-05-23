"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBagIcon as ShoppingBag } from "@heroicons/react/24/outline";
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
      className="fixed bottom-0 left-0 right-0 z-40 bg-creme/90  backdrop-blur-md border-t border-olive/10  px-6 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] (0,0,0,0.2)]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-4">
          <img src={product.img} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-olive/5" />
          <div>
            <h4 className="font-serif text-olive  text-lg">{product.title}</h4>
            <p className="text-olive/70  text-sm">Rs {product.price}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <p className="md:hidden font-serif text-olive  text-lg flex-1">{product.title}</p>
          <div className="hidden sm:block text-olive  font-medium text-lg mr-2">
            Rs {product.price}
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 md:flex-none bg-olive text-creme px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(40,54,24,0.3)] active:scale-95 font-medium tracking-wide shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
