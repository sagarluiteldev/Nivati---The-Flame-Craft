"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StickyBuyBar from "@/components/StickyBuyBar";
import CrossSell from "@/components/CrossSell";
import { products } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useAppContext();

  if (!product) {
    return (
      <main className="min-h-screen py-32 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-olive mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-olive hover:underline">Return to Shop</Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.img
    });
  };

  return (
    <main className="min-h-screen flex flex-col pt-24">
      <Navbar />
      
      <div className="grow max-w-7xl mx-auto px-6 w-full py-12 md:py-24">
        <Breadcrumbs items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` },
          { label: product.title }
        ]} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4 md:sticky md:top-32"
          >
            <div className="aspect-4/5 md:aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden bg-olive/5 relative">
              <img 
                src={product.gallery[activeImage]} 
                alt={product.title} 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-opacity duration-500"
                style={{ transform: "translateZ(0)" }}
              />
            </div>
            {product.gallery.length > 1 && (
              <div className="flex gap-4">
                {product.gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-olive/5 border-2 transition-colors ${activeImage === idx ? 'border-olive' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Gallery image ${idx+1}`} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" style={{ transform: "translateZ(0)" }} />
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
              <span className="text-olive/60 text-sm uppercase tracking-widest">{product.category}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif text-olive mb-4">{product.title}</h1>
            <p className="text-2xl text-olive/80 mb-8">Rs {product.price}</p>
            
            <p className="text-lg leading-relaxed text-olive/80 mb-12 font-light">
              {product.description}
            </p>

            <div className="space-y-6 border-y border-olive/10 py-8 mb-12">
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <span className="text-sm uppercase tracking-widest text-olive/50">Top Notes</span>
                <span className="text-olive/90">{product.scentNotes.top}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <span className="text-sm uppercase tracking-widest text-olive/50">Mid Notes</span>
                <span className="text-olive/90">{product.scentNotes.mid}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <span className="text-sm uppercase tracking-widest text-olive/50">Base Notes</span>
                <span className="text-olive/90">{product.scentNotes.base}</span>
              </div>
            </div>

            {/* Add to Cart Area */}
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-olive/20 rounded-full bg-transparent p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-olive hover:bg-olive/10 rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-olive text-creme py-4 rounded-full flex items-center justify-center gap-2 hover:bg-olive/90 transition-colors"
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
