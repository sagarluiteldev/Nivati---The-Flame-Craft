"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ScentQuiz from "@/components/ScentQuiz";
import SearchOverlay from "@/components/SearchOverlay";
import { Moon, Sun, Search as SearchIcon } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { cart, setIsCartOpen, isNightMode, setIsNightMode } = useAppContext();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsQuizOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ScentQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled || isMobileMenuOpen ? "bg-creme/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <Link href="/" className="flex items-center z-50 transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/images/logo.png" 
              alt="Nivati Logo" 
              className="h-24 w-24 md:h-28 md:w-28 object-contain dark:brightness-0 dark:invert transition-all" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-olive/80 relative">
            <div className="relative group py-6">
              <Link href="/shop" className="hover:text-olive transition-colors peer flex items-center gap-1">
                Shop 
                <svg className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full -left-12 w-[600px] bg-creme dark:bg-[#1a1a1a] shadow-2xl rounded-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-3 gap-6 translate-y-4 group-hover:translate-y-0 border border-olive/10 dark:border-creme/10 z-50">
                <Link href="/shop?category=Signature+Candles" className="group/item block">
                  <div className="aspect-square bg-olive/5 dark:bg-white/5 rounded-xl overflow-hidden mb-3 relative">
                     <img src="/images/collection_jars.png" alt="Signature Candles" className="absolute inset-0 w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-serif text-olive dark:text-creme text-lg mb-1 normal-case tracking-normal">Signature Candles</h4>
                  <p className="text-xs text-olive/60 dark:text-creme/60 normal-case tracking-normal">Our classic luxury scents</p>
                </Link>
                <Link href="/shop?category=DIY+Kits" className="group/item block">
                  <div className="aspect-square bg-olive/5 dark:bg-white/5 rounded-xl overflow-hidden mb-3 relative">
                     <img src="/images/collection_kit.png" alt="DIY Kits" className="absolute inset-0 w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-serif text-olive dark:text-creme text-lg mb-1 normal-case tracking-normal">DIY Kits</h4>
                  <p className="text-xs text-olive/60 dark:text-creme/60 normal-case tracking-normal">Pour your own at home</p>
                </Link>
                <Link href="/shop?category=Raw+Materials" className="group/item block">
                  <div className="aspect-square bg-olive/5 dark:bg-white/5 rounded-xl overflow-hidden mb-3 relative">
                     <img src="/images/collection_materials.png" alt="Raw Materials" className="absolute inset-0 w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-serif text-olive dark:text-creme text-lg mb-1 normal-case tracking-normal">Raw Materials</h4>
                  <p className="text-xs text-olive/60 dark:text-creme/60 normal-case tracking-normal">Waxes, wicks, and vessels</p>
                </Link>
              </div>
            </div>

            <Link href="/#kits" className="hover:text-olive transition-colors py-6">DIY Kits</Link>
            <Link href="/#workshops" className="hover:text-olive transition-colors py-6">Workshops</Link>
            <Link href="/#story" className="hover:text-olive transition-colors py-6">Our Story</Link>
          </nav>

          <div className="flex items-center gap-4 md:gap-6 z-50">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-olive hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsQuizOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-olive hover:text-olive/70 transition-colors"
            >
              Scent Quiz
            </button>
            <button 
              onClick={() => setIsNightMode(!isNightMode)} 
              className="text-olive hover:opacity-70 transition-opacity"
              aria-label="Toggle Night Mode"
            >
              {isNightMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="text-olive hover:opacity-70 transition-opacity relative" 
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-olive text-creme text-[10px] flex items-center justify-center font-bold">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            <a 
              href="https://wa.me/9842003249?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20the%20online%20candle%20making%20workshops"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-olive text-creme rounded-full text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Join a Class
            </a>
            <button 
              className="md:hidden text-olive p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-creme pt-24 px-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-6 text-2xl font-serif text-olive mt-8">
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop Candles</Link>
              <Link href="/#kits" onClick={() => setIsMobileMenuOpen(false)}>DIY Kits</Link>
              <Link href="/#workshops" onClick={() => setIsMobileMenuOpen(false)}>Workshops</Link>
              <Link href="/#story" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
            </nav>
            <div className="mt-12 pt-12 border-t border-olive/10">
              <a 
                href="https://wa.me/9842003249?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20the%20online%20candle%20making%20workshops"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-olive text-creme rounded-full text-lg tracking-wide hover:bg-olive/90 transition-colors"
              >
                Join a Class
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
