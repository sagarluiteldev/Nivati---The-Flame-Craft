"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon as X, MinusIcon as Minus, PlusIcon as Plus, ShoppingBagIcon as ShoppingBag } from "@heroicons/react/24/outline";
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
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-creme  shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-olive/10 ">
              <h2 className="text-2xl font-serif text-olive  flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-olive/60 hover:text-olive   hover:bg-olive/5  rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-olive/60  gap-4">
                  <ShoppingBag className="w-12 h-12 stroke-1" />
                  <p className="font-serif text-xl">Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 border border-olive/20  rounded-full hover:bg-olive/5  transition-colors"
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
                        <div className="flex-1">
                          <h3 className="font-serif text-lg text-olive  leading-tight mb-1">{item.title}</h3>
                          {item.metadata && (
                            <div className="space-y-1">
                              <div className="flex gap-2 text-[10px] uppercase tracking-widest text-olive/40">
                                {item.metadata.color && <span>Color: {item.metadata.color}</span>}
                                {item.metadata.fragrance && <span>Scent: {item.metadata.fragrance}</span>}
                              </div>
                              {item.metadata.message && (
                                <p className="text-xs text-olive/60 font-light italic truncate max-w-[200px]">
                                  &quot;{item.metadata.message}&quot;
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-olive ">Rs {(item.price * item.quantity).toFixed(0)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-olive/20  rounded-full bg-transparent">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.metadata)}
                            className="w-8 h-8 flex items-center justify-center text-olive  hover:bg-olive/10  rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.metadata)}
                            className="w-8 h-8 flex items-center justify-center text-olive  hover:bg-olive/10  rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id, item.metadata)}
                          className="text-xs uppercase tracking-wider text-olive/60  hover:text-olive  underline underline-offset-4"
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
              <div className="p-4 md:p-6 border-t border-olive/10  bg-olive/5 ">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-olive/80 text-sm">Subtotal</span>
                  <span className="text-lg font-serif text-olive ">Rs {subtotal.toFixed(0)}</span>
                </div>
                <p className="text-xs text-olive/60  text-center mb-3">
                  Shipping & taxes calculated at checkout.
                </p>
                <a 
                  href={`https://wa.me/9779842003249?text=${encodeURIComponent(
                    `🕯️ *New Order from Nivati Website*\n\n` +
                    cart.map((item, i) => {
                      let itemText = `${i + 1}. *${item.title}*\n   Qty: ${item.quantity} × Rs ${item.price} = Rs ${(item.price * item.quantity).toFixed(0)}`;
                      if (item.metadata) {
                        if (item.metadata.color) itemText += `\n   Color: ${item.metadata.color}`;
                        if (item.metadata.fragrance) itemText += `\n   Fragrance: ${item.metadata.fragrance}`;
                        if (item.metadata.message) itemText += `\n   Message: "${item.metadata.message}"`;
                      }
                      return itemText;
                    }).join('\n\n') +
                    `\n\n---\n💰 *Subtotal: Rs ${subtotal.toFixed(0)}*\n\nPlease confirm availability and share delivery details. 🙏\n\n*Note*: Please note that prices do not include the delivery charges. Delivery charges will be added to grand total according to the delivery locations.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] text-white rounded-full hover:bg-[#20BD5A] transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Order via WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
