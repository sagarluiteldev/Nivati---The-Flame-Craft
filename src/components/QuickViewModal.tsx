"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon as X, ShoppingBagIcon as ShoppingBag, PlusIcon as Plus, MinusIcon as Minus } from "@heroicons/react/24/outline";
import { Product, COLORS, FRAGRANCES } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: Props) {
  const { addToCart } = useAppContext();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedFragrance, setSelectedFragrance] = useState(FRAGRANCES[0]);
  const [specialMessage, setSpecialMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset states when opening a new product
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedColor(COLORS[0].name);
      setSelectedFragrance(FRAGRANCES[0]);
      setSpecialMessage("");
      setQuantity(1);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product?.id]);

  if (!product) return null;

  const showPersonalization = !["Concrete Pots & More", "Candle Making Kit", "Candle Making Materials"].some(cat => 
    Array.isArray(product.category) ? product.category.includes(cat) : product.category === cat
  );

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.img,
      metadata: showPersonalization ? {
        color: selectedColor,
        fragrance: selectedFragrance,
        message: specialMessage
      } : undefined
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-olive/20 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[900px] bg-creme/95 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] backdrop-blur-md"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-creme/80 hover:bg-creme text-olive rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="shrink-0 md:w-1/2 relative min-h-[300px] md:h-auto bg-olive/5 overflow-hidden">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                src={product.img}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 md:w-1/2 p-8 lg:p-12 overflow-y-auto scrollbar-hide flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-olive/30 mb-3 block">
                {Array.isArray(product.category) ? product.category.join(" / ") : product.category}
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif text-olive mb-4 leading-tight">
                {product.title}
              </h2>
              <p className="text-xl font-serif text-olive/80 mb-10">
                Rs {product.price}
              </p>
              
              {/* Personalization UI */}
              {showPersonalization ? (
                <div className="space-y-10 border-t border-olive/10 pt-10 mb-10">
                  {/* Color Selection */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-olive/40 block mb-6 px-1">Choose Jar Color</label>
                    <div className="flex flex-wrap gap-4">
                      {COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative w-10 h-10 rounded-full border-2 transition-all p-1 group flex items-center justify-center ${
                            selectedColor === color.name ? 'border-olive scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          aria-label={color.name}
                        >
                          <div 
                            className={`w-full h-full rounded-full shadow-inner ${color.name === "Custom" ? "animate-spin-slow" : ""}`}
                            style={{ background: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fragrance Selection */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-olive/40 block mb-6 px-1">Select Scent</label>
                    <div className="flex flex-wrap gap-2">
                      {FRAGRANCES.map((fragrance) => (
                        <button
                          key={fragrance}
                          onClick={() => setSelectedFragrance(fragrance)}
                          className={`px-4 py-2 rounded-full text-[11px] transition-all border ${
                            selectedFragrance === fragrance
                              ? 'bg-olive text-creme border-olive shadow-md'
                              : 'bg-transparent text-olive/60 border-olive/10 hover:border-olive/30 hover:bg-olive/5'
                          }`}
                        >
                          {fragrance}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Message */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-olive/40 block mb-6 px-1">Special Message</label>
                    <textarea
                      value={specialMessage}
                      onChange={(e) => setSpecialMessage(e.target.value)}
                      placeholder="Special messages, notes, custom colors, fragrances..."
                      className="w-full bg-olive/5 border border-olive/10 rounded-2xl p-6 text-olive focus:outline-none focus:border-sage transition-all placeholder:text-olive/20 resize-none text-sm leading-relaxed"
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                /* Non-personalizable details */
                (product.scentNotes.top !== "Unscented" && product.scentNotes.top !== "Customize your own") && (
                  <div className="mb-10 p-6 bg-olive/5 rounded-2xl border border-olive/10">
                    <h4 className="font-serif text-lg text-olive mb-4">Product Details</h4>
                    <ul className="space-y-3 text-sm font-light text-olive/80">
                      <li className="flex gap-4">
                        <span className="w-12 font-medium text-olive/40 uppercase tracking-widest text-[10px]">Top:</span> 
                        {product.scentNotes.top}
                      </li>
                      <li className="flex gap-4">
                        <span className="w-12 font-medium text-olive/40 uppercase tracking-widest text-[10px]">Mid:</span> 
                        {product.scentNotes.mid}
                      </li>
                      <li className="flex gap-4">
                        <span className="w-12 font-medium text-olive/40 uppercase tracking-widest text-[10px]">Base:</span> 
                        {product.scentNotes.base}
                      </li>
                    </ul>
                  </div>
                )
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 mt-auto">
                <div className="flex items-center justify-between border border-olive/20 rounded-full bg-transparent p-1 min-w-[120px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-base font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-olive text-creme rounded-full py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(40,54,24,0.3)] active:scale-[0.95] font-medium tracking-widest text-[10px]"
                >
                  <ShoppingBag className="w-4 h-4" /> ADD TO CART
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
