"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBagIcon as ShoppingBag, Bars3Icon as Menu, XMarkIcon as X } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Workshops", href: "/#workshops" },
    { 
      label: "Join a Class", 
      href: "https://wa.me/9842003249?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20the%20online%20candle%20making%20workshops",
      external: true 
    },
    { label: "Our Story", href: "/#story" },
  ];

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === "/") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      {isSearchOpen && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}

      {/* Borderless Header (Moves up naturally with the hero section, zero fixed background box) */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-30 pointer-events-none py-4 md:py-6 bg-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 flex items-start justify-between">
          
          {/* Top-Left: Nivati Logo (Remains at exact same spot) */}
          <div className="pointer-events-auto">
            <Link 
              href="/" 
              className="flex items-center transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Nivati Home"
            >
              <Image 
                src="/images/logo.png" 
                alt="Nivati Logo" 
                width={110} 
                height={110} 
                priority
                className="h-18 w-18 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-26 lg:w-26 object-contain transition-all" 
              />
            </Link>
          </div>

          {/* Desktop Right Side: Vertical Nav + Icons Horizontally Below Our Story */}
          <div className="pointer-events-auto hidden md:flex flex-col items-start">
            
            {/* Vertical Editorial Links (Rock-solid alignment, zero hover shift, brand typography) */}
            <nav className="flex flex-col items-start font-sans text-xs uppercase tracking-[0.22em] text-neutral-800 select-none">
              {navItems.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : !item.external && pathname.startsWith(item.href);

                const linkContent = (
                  <>
                    {/* Fixed-width indicator container: completely eliminates any layout jump on hover */}
                    <span 
                      className={`w-4 inline-flex items-center justify-start transition-opacity duration-200 ${
                        isActive 
                          ? "opacity-100 text-neutral-950 font-bold" 
                          : "opacity-0 group-hover:opacity-40 text-neutral-500"
                      }`}
                    >
                      —
                    </span>
                    <span>{item.label}</span>
                  </>
                );

                const linkClass = `group flex items-center py-1 cursor-pointer transition-colors duration-200 ${
                  isActive 
                    ? "text-neutral-950 font-semibold" 
                    : "text-neutral-600 hover:text-neutral-950 font-medium"
                }`;

                if (item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {linkContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={linkClass}
                  >
                    {linkContent}
                  </Link>
                );
              })}
            </nav>

            {/* Clean Bigger Icons Only, Aligned Horizontally Just Below Our Story Nav */}
            <div className="flex items-center gap-4 mt-4 pl-4 text-neutral-800">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-neutral-800 hover:text-olive transition-colors p-1 cursor-pointer"
                aria-label="Search"
              >
                <SearchIcon className="w-6 h-6" />
              </button>

              <button 
                className="text-neutral-800 hover:text-olive transition-colors relative p-1 cursor-pointer" 
                aria-label="Cart"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-6 h-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-5 h-5 px-1 rounded-full bg-olive text-creme text-[11px] flex items-center justify-center font-bold shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Right Side: Bigger Action Icons & Hamburger */}
          <div className="pointer-events-auto flex md:hidden items-center gap-3 text-neutral-800 pt-1">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-neutral-800 hover:text-olive transition-colors cursor-pointer"
              aria-label="Search"
            >
              <SearchIcon className="w-7 h-7" />
            </button>

            <button 
              className="relative p-1.5 text-neutral-800 hover:text-olive transition-colors cursor-pointer" 
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-7 h-7" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-olive text-creme text-[10px] flex items-center justify-center font-bold shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button 
              className="p-1.5 text-neutral-900 cursor-pointer active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-creme pt-7 px-7 sm:px-10 md:hidden flex flex-col pointer-events-auto"
          >
            {/* Top Bar inside Drawer: Big Logo & Big Close Button (X) - Zero Horizontal Lines */}
            <div className="flex items-center justify-between w-full">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center cursor-pointer"
                aria-label="Nivati Home"
              >
                <Image 
                  src="/images/logo.png" 
                  alt="Nivati Logo" 
                  width={96} 
                  height={96} 
                  priority
                  className="h-20 w-20 sm:h-24 sm:w-24 object-contain" 
                />
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-900 hover:text-olive transition-colors cursor-pointer active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-10 h-10 stroke-[1.5]" />
              </button>
            </div>

            {/* Navigation Links - Positioned just below Logo and X with good clean gap */}
            <nav className="flex flex-col items-start gap-7 font-sans text-2xl uppercase tracking-[0.22em] text-neutral-900 mt-12 sm:mt-14">
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : !item.external && pathname.startsWith(item.href);
                const itemClass = `flex items-center gap-3 transition-colors cursor-pointer ${
                  isActive ? "text-neutral-950 font-bold" : "text-neutral-600 hover:text-neutral-950 font-medium"
                }`;

                if (item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={itemClass}
                    >
                      {isActive && <span className="text-olive">—</span>}
                      <span>{item.label}</span>
                    </a>
                  );
                }

                return (
                  <Link 
                    key={item.label}
                    href={item.href} 
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleLinkClick(e, item.href);
                    }} 
                    className={itemClass}
                  >
                    {isActive && <span className="text-olive">—</span>}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom details - Zero border lines */}
            <div className="mt-auto pb-10 flex items-center justify-between text-xs text-neutral-400 uppercase tracking-widest font-sans">
              <span>Hand-Poured in Nepal</span>
              <span>Pure Soy Wax</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
