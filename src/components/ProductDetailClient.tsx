"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MinusIcon as Minus, PlusIcon as Plus, ShoppingBagIcon as ShoppingBag } from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StickyBuyBar from "@/components/StickyBuyBar";
import CrossSell from "@/components/CrossSell";
import { Product, COLORS, FRAGRANCES } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedFragrance, setSelectedFragrance] = useState(FRAGRANCES[0]);
  const [specialMessage, setSpecialMessage] = useState("");
  const { addToCart } = useAppContext();

  const showPersonalization = !["Concrete Pots & More", "Candle Making Kit", "Candle Making Materials"].some(cat => 
    Array.isArray(product.category) ? product.category.includes(cat) : product.category === cat
  );

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.img,
      metadata: {
        color: selectedColor,
        fragrance: selectedFragrance,
        message: specialMessage
      }
    });
  };

  return (
    <main className="min-h-screen flex flex-col pt-32 md:pt-40">
      <Navbar />
      
      <div className="grow max-w-7xl mx-auto px-6 w-full pt-4 pb-12 md:pt-6 md:pb-24">
        <Breadcrumbs items={[
          { label: 'Shop', href: '/shop' },
          { 
            label: Array.isArray(product.category) ? product.category[0] : product.category, 
            href: `/shop?category=${encodeURIComponent(Array.isArray(product.category) ? product.category[0] : product.category)}` 
          },
          { label: product.title }
        ]} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-start">
          {/* Image Gallery & Special Message Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4 md:sticky md:top-36"
          >
            <div className="aspect-square w-full rounded-none overflow-hidden bg-olive/5 relative">
              <Image 
                src={product.gallery[activeImage]} 
                alt={product.title} 
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-opacity duration-500"
              />
            </div>
            {product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveImage(idx)}
                     className={`w-18 h-18 rounded-none overflow-hidden bg-olive/5 border-2 transition-colors relative ${activeImage === idx ? 'border-olive' : 'border-transparent'}`}
                   >
                     <Image src={img} alt={`Gallery image ${idx+1}`} fill sizes="72px" className="w-full h-full object-cover mix-blend-multiply" />
                   </button>
                ))}
              </div>
            )}

            {/* Special Message Section (Placed below image) */}
            {showPersonalization && (
              <div className="mt-3 pt-6 border-t border-black/10">
                <label className="text-xs uppercase tracking-widest text-black/60 font-medium block mb-3 px-1">
                  Special Message / Notes
                </label>
                <textarea
                  value={specialMessage}
                  onChange={(e) => setSpecialMessage(e.target.value)}
                  placeholder="Special messages, notes, custom colors, fragrances..."
                  className="w-full bg-black/5 border border-black/10 rounded-lg p-4 text-black text-sm md:text-base focus:outline-none focus:border-olive transition-colors placeholder:text-black/35 resize-none leading-relaxed"
                  rows={3}
                />
              </div>
            )}
          </motion.div>

          {/* Product Info, Options & Add to Cart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              {product.tag && (
                 <span className="px-3 py-1 bg-olive text-creme text-xs font-medium tracking-wide rounded-full">
                   {product.tag}
                 </span>
              )}
              <span className="text-black/60 text-xs md:text-sm uppercase tracking-widest">
                {Array.isArray(product.category) ? product.category.join(" / ") : product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-3 leading-tight">{product.title}</h1>
            <p className="text-2xl md:text-3xl text-black/80 mb-6 font-serif">Rs {product.price}</p>
            
            <p className="text-base md:text-lg leading-relaxed text-black/80 mb-8 font-light max-w-xl">
              {product.description}
            </p>

            {/* Personalization UI */}
            {showPersonalization ? (
              <div className="space-y-8 border-t border-black/10 pt-8 mb-8">
                {/* Color Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <label className="text-xs uppercase tracking-widest text-black/60 font-medium">Choose Jar Color</label>
                    <span className="text-sm text-black/60 font-medium">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3.5 md:gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full border-2 transition-all p-1 group flex items-center justify-center ${
                          selectedColor === color.name ? 'border-olive scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                        aria-label={color.name}
                        title={color.name}
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-inner"
                          style={{ background: color.hex }}
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-black/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 bg-creme px-1.5 py-0.5 rounded shadow">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fragrance Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <label className="text-xs uppercase tracking-widest text-black/60 font-medium">Select Fragrance</label>
                    <span className="text-sm text-black/60 font-medium">{selectedFragrance}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-2.5">
                    {FRAGRANCES.map((fragrance) => (
                      <button
                        key={fragrance}
                        onClick={() => setSelectedFragrance(fragrance)}
                        className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm transition-all border ${
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
              </div>
            ) : (
              /* Non-personalizable details */
              (product.scentNotes.top !== "Unscented" && product.scentNotes.top !== "Customize your own") && (
                <div className="mb-8 p-6 bg-black/5 rounded-none border border-black/10">
                  <h4 className="font-serif text-lg text-black mb-4">Product Details</h4>
                  <ul className="space-y-3 text-sm md:text-base font-light text-black/85">
                    <li className="flex gap-4 border-b border-black/5 pb-2.5">
                      <span className="w-20 font-medium text-black/50 uppercase tracking-widest text-[10px]">Top:</span> 
                      <span className="font-medium">{product.scentNotes.top}</span>
                    </li>
                    <li className="flex gap-4 border-b border-black/5 pb-2.5">
                      <span className="w-20 font-medium text-black/50 uppercase tracking-widest text-[10px]">Mid:</span> 
                      <span className="font-medium">{product.scentNotes.mid}</span>
                    </li>
                    <li className="flex gap-4 pb-1">
                      <span className="w-20 font-medium text-black/50 uppercase tracking-widest text-[10px]">Base:</span> 
                      <span className="font-medium">{product.scentNotes.base}</span>
                    </li>
                  </ul>
                </div>
              )
            )}

            {/* Add to Cart Area */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6 mt-2">
              <div className="flex items-center justify-between border border-black/20 rounded-lg bg-transparent p-1 min-w-35">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-black hover:bg-black/10 rounded-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-lg font-medium text-black">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-black hover:bg-black/10 rounded-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="w-full sm:flex-1 btn-mesh text-creme py-4 md:py-5 px-8 rounded-lg flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md font-medium text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart - Rs {(product.price * quantity).toFixed(0)}</span>
              </button>
            </div>
          </motion.div>
        </div>
        
        <CrossSell currentProductId={product.id} category={product.category} />
      </div>
      
      <StickyBuyBar product={product} />
      <Footer />
    </main>
  );
}
