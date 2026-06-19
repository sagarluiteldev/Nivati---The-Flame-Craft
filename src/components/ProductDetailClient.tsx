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
    <main className="min-h-screen flex flex-col pt-20 md:pt-24">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4 md:sticky md:top-28"
          >
            <div className="aspect-4/5 md:aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden bg-olive/5 relative">
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
              <div className="flex gap-4">
                {product.gallery.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveImage(idx)}
                     className={`w-20 h-20 rounded-xl overflow-hidden bg-olive/5 border-2 transition-colors relative ${activeImage === idx ? 'border-olive' : 'border-transparent'}`}
                   >
                     <Image src={img} alt={`Gallery image ${idx+1}`} fill sizes="80px" className="w-full h-full object-cover mix-blend-multiply" />
                   </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              {product.tag && (
                 <span className="px-3 py-1 bg-olive text-creme text-xs font-medium tracking-wide rounded-full">
                   {product.tag}
                 </span>
              )}
              <span className="text-olive/60 text-sm uppercase tracking-widest">
                {Array.isArray(product.category) ? product.category.join(" / ") : product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-olive mb-4 leading-tight">{product.title}</h1>
            <p className="text-2xl text-olive/80 mb-8 font-serif">Rs {product.price}</p>
            
            <p className="text-lg leading-relaxed text-olive/80 mb-10 font-light max-w-lg">
              {product.description}
            </p>

            {/* Personalization UI */}
            {showPersonalization ? (
              <div className="space-y-10 border-y border-olive/10 py-10 mb-10">
                {/* Color Selection */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-olive/40 block mb-6 px-1">Choose Jar Color</label>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all p-1 group flex items-center justify-center ${
                          selectedColor === color.name ? 'border-olive scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        aria-label={color.name}
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-inner"
                          style={{ background: color.hex }}
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-olive/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fragrance Selection */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-olive/40 block mb-6 px-1">Select Fragrance</label>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {FRAGRANCES.map((fragrance) => (
                      <button
                        key={fragrance}
                        onClick={() => setSelectedFragrance(fragrance)}
                        className={`px-5 py-2.5 rounded-full text-sm transition-all border ${
                          selectedFragrance === fragrance
                            ? 'bg-olive text-creme border-olive shadow-md'
                            : 'bg-transparent text-olive/70 border-olive/10 hover:border-olive/30 hover:bg-olive/5'
                        }`}
                      >
                        {fragrance}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Message */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-olive/40 block mb-6 px-1">Special Message / Notes</label>
                  <textarea
                    value={specialMessage}
                    onChange={(e) => setSpecialMessage(e.target.value)}
                    placeholder="Special messages, notes, custom colors, fragrances..."
                    className="w-full bg-olive/5 border border-olive/10 rounded-2xl p-6 text-olive md:text-lg focus:outline-none focus:border-sage transition-colors placeholder:text-olive/20 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              /* Non-personalizable details */
              (product.scentNotes.top !== "Unscented" && product.scentNotes.top !== "Customize your own") && (
                <div className="mb-10 p-8 bg-olive/5 rounded-3xl border border-olive/10">
                  <h4 className="font-serif text-xl text-olive mb-6">Product Details</h4>
                  <ul className="space-y-4 text-sm md:text-base font-light text-olive/80">
                    <li className="flex gap-4 border-b border-olive/5 pb-3">
                      <span className="w-20 font-medium text-olive/50 uppercase tracking-widest text-[10px]">Top:</span> 
                      <span className="font-medium">{product.scentNotes.top}</span>
                    </li>
                    <li className="flex gap-4 border-b border-olive/5 pb-3">
                      <span className="w-20 font-medium text-olive/50 uppercase tracking-widest text-[10px]">Mid:</span> 
                      <span className="font-medium">{product.scentNotes.mid}</span>
                    </li>
                    <li className="flex gap-4 pb-3">
                      <span className="w-20 font-medium text-olive/50 uppercase tracking-widest text-[10px]">Base:</span> 
                      <span className="font-medium">{product.scentNotes.base}</span>
                    </li>
                  </ul>
                </div>
              )
            )}

            {/* Add to Cart Area */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
              <div className="flex items-center justify-between border border-olive/20 rounded-full bg-transparent p-1 min-w-[140px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-lg font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-olive text-creme py-4 md:py-5 rounded-full flex items-center justify-center gap-2 hover:bg-olive/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-olive/10"
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
