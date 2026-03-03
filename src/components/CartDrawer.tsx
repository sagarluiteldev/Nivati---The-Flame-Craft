"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useAppContext();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-olive/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-creme dark:bg-olive shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-olive/10 dark:border-creme/10">
              <h2 className="text-2xl font-serif text-olive dark:text-creme flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-olive/60 hover:text-olive dark:text-creme/60 dark:hover:text-creme hover:bg-olive/5 dark:hover:bg-creme/5 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-olive/60 dark:text-creme/60 gap-4">
                  <ShoppingBag className="w-12 h-12 stroke-1" />
                  <p className="font-serif text-xl">Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 border border-olive/20 dark:border-creme/20 rounded-full hover:bg-olive/5 dark:hover:bg-creme/5 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-olive/5 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif text-lg text-olive dark:text-creme leading-tight">{item.title}</h3>
                        <p className="font-medium text-olive dark:text-creme">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-olive/20 dark:border-creme/20 rounded-full bg-transparent">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-olive dark:text-creme hover:bg-olive/10 dark:hover:bg-creme/10 rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-olive dark:text-creme hover:bg-olive/10 dark:hover:bg-creme/10 rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs uppercase tracking-wider text-olive/60 dark:text-creme/60 hover:text-olive dark:hover:text-creme underline underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-olive/10 dark:border-creme/10 bg-olive/5 dark:bg-creme/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-olive/80 dark:text-creme/80">Subtotal</span>
                  <span className="text-xl font-serif text-olive dark:text-creme">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-olive/60 dark:text-creme/60 text-center mb-4">
                  Shipping & taxes calculated at checkout.
                </p>
                <button className="w-full py-4 bg-olive text-creme dark:bg-creme dark:text-olive rounded-full hover:bg-olive/90 dark:hover:bg-creme/90 transition-colors uppercase tracking-widest text-sm">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
