"use client";

import { useState, useEffect, useRef } from "react";
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

  const modalRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Prevent background body & html scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyPaddingRight = document.body.style.paddingRight;

      // Prevent layout shift from scrollbar disappearing
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Reset states when opening a new product
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedColor(COLORS[0].name);
      setSelectedFragrance(FRAGRANCES[0]);
      setSpecialMessage("");
      setQuantity(1);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;
      };
    }
  }, [isOpen, product?.id]);

  // Focus trap for modal
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element on open
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
        <div 
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-olive/20 backdrop-blur-xl touch-none"
          />
          <motion.div
            ref={modalRef}
            data-lenis-prevent
            onWheel={(e) => {
              // If user scrolls anywhere on the modal outside the content container (e.g. over the image), scroll content
              if (contentScrollRef.current && !contentScrollRef.current.contains(e.target as Node)) {
                contentScrollRef.current.scrollTop += e.deltaY;
              }
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-225 bg-creme/95 rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] min-h-0 backdrop-blur-md z-10 overscroll-contain"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-creme/80 hover:bg-creme text-olive rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="shrink-0 md:w-1/2 relative min-h-56 sm:min-h-72 md:h-auto min-h-0 bg-olive/5 overflow-hidden">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                src={product.img}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply pointer-events-none"
              />
            </div>

            {/* Content Section */}
            <div 
              ref={contentScrollRef}
              data-lenis-prevent
              className="flex-1 md:w-1/2 p-6 sm:p-8 lg:p-12 overflow-y-auto min-h-0 overscroll-contain flex flex-col scrollbar-hide"
            >
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-3 block">
                {Array.isArray(product.category) ? product.category.join(" / ") : product.category}
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif text-black mb-4 leading-tight">
                {product.title}
              </h2>
              <p className="text-xl font-serif text-black/80 mb-10">
                Rs {product.price}
              </p>
              
              {/* Personalization UI */}
              {showPersonalization ? (
                <div className="space-y-10 border-t border-black/10 pt-10 mb-10">
                  {/* Color Selection */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-6 px-1">Choose Jar Color</label>
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
                    <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-6 px-1">Select Scent</label>
                    <div className="flex flex-wrap gap-2">
                      {FRAGRANCES.map((fragrance) => (
                        <button
                          key={fragrance}
                          onClick={() => setSelectedFragrance(fragrance)}
                          className={`px-4 py-2 rounded-lg text-[11px] transition-all border ${
                            selectedFragrance === fragrance
                              ? 'btn-mesh text-creme border-transparent shadow-md font-medium'
                              : 'bg-transparent text-black/70 border-black/10 hover:border-black/30 hover:bg-black/5'
                          }`}
                        >
                          {fragrance}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Message */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-6 px-1">Special Message</label>
                    <textarea
                      value={specialMessage}
                      onChange={(e) => setSpecialMessage(e.target.value)}
                      placeholder="Special messages, notes, custom colors, fragrances..."
                      className="w-full bg-black/5 border border-black/10 rounded-lg p-6 text-black focus:outline-none focus:border-olive transition-all placeholder:text-black/30 resize-none text-sm leading-relaxed"
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                /* Non-personalizable details */
                (product.scentNotes.top !== "Unscented" && product.scentNotes.top !== "Customize your own") && (
                  <div className="mb-10 p-6 bg-black/5 rounded-lg border border-black/10">
                    <h4 className="font-serif text-lg text-black mb-4">Product Details</h4>
                    <ul className="space-y-3 text-sm font-light text-black/85">
                      <li className="flex gap-4">
                        <span className="w-12 font-medium text-black/50 uppercase tracking-widest text-[10px]">Top:</span> 
                        {product.scentNotes.top}
                      </li>
                      <li className="flex gap-4">
                        <span className="w-12 font-medium text-black/50 uppercase tracking-widest text-[10px]">Mid:</span> 
                        {product.scentNotes.mid}
                      </li>
                      <li className="flex gap-4">
                        <span className="w-12 font-medium text-black/50 uppercase tracking-widest text-[10px]">Base:</span> 
                        {product.scentNotes.base}
                      </li>
                    </ul>
                  </div>
                )
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 mt-auto">
                <div className="flex items-center justify-between border border-black/20 rounded-lg bg-transparent p-1 min-w-30">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-black hover:bg-black/10 rounded-lg transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-base font-medium text-black">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-black hover:bg-black/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 btn-mesh text-creme rounded-lg py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.95] font-medium tracking-widest text-[10px] shadow-md"
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
