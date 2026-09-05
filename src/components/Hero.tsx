"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

const slogans = [
  "Scented Handmade Candles",
  "Handcrafted with Heart",
  "Sustainable Luxury",
  "Intentionally Poured"
];

interface HeroCard {
  id: string;
  src: string;
  alt: string;
  label: string;
  category: string;
  heightClass: string;
  bgColor: string;
  delay: number;
}

const heroCards: HeroCard[] = [
  {
    id: "card-1",
    src: "/images/moon_candle_aura.jpg",
    alt: "Moon Candle",
    label: "Moon",
    category: "Concrete Jar Candles",
    heightClass: "h-72 sm:h-80 lg:h-[330px] xl:h-[370px]",
    bgColor: "bg-[#cbd8c6]",
    delay: 0.22
  },
  {
    id: "card-2",
    src: "/images/IMG_4148.jpg",
    alt: "Acanthus Pillar Candle",
    label: "Acanthus",
    category: "Mould Candles",
    heightClass: "h-84 sm:h-92 lg:h-[400px] xl:h-[450px]",
    bgColor: "bg-[#d8b8b8]",
    delay: 0.38
  },
  {
    id: "card-3",
    src: "/images/IMG_4143.jpg",
    alt: "Rose Jar Candle",
    label: "Rose Jar",
    category: "Premium Jar Candles",
    heightClass: "h-96 sm:h-104 lg:h-[450px] xl:h-[500px]",
    bgColor: "bg-[#d49e3b]",
    delay: 0.08
  },
  {
    id: "card-4",
    src: "/images/IMG_4086.jpg",
    alt: "Rose Bowl Candle",
    label: "Rose Bowl",
    category: "Concrete Jar Candles",
    heightClass: "h-80 sm:h-88 lg:h-[380px] xl:h-[430px]",
    bgColor: "bg-[#455c47]",
    delay: 0.30
  },
  {
    id: "card-5",
    src: "/images/IMG_4518.jpg",
    alt: "Starfish Name Candle",
    label: "Starfish",
    category: "Concrete Jar Candles",
    heightClass: "h-72 sm:h-80 lg:h-[340px] xl:h-[380px]",
    bgColor: "bg-[#cb8376]",
    delay: 0.16
  }
];

export default function Hero() {
  const [sloganIndex, setSloganIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  useEffect(() => {
    const sloganTimer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 4000);

    const mobileCarouselTimer = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % heroCards.length);
    }, 4500);

    return () => {
      clearInterval(sloganTimer);
      clearInterval(mobileCarouselTimer);
    };
  }, []);

  return (
    <section 
      className="relative min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 md:pt-20 lg:pt-20 pb-10 md:pb-14 overflow-hidden bg-creme select-none"
    >
      {/* Texture Overlay - Desktop Only */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('/images/paper-fibers.png')] hidden lg:block" />
      
      {/* Sculptural Fluid Light Wave Background Effect (Inspired by luxury tactile curve) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Ambient Radiance in Top-Left */}
        <div 
          className="absolute -top-[25%] -left-[15%] w-[85vw] h-[85vw] max-w-[1300px] max-h-[1300px] rounded-full opacity-75 mix-blend-soft-light filter blur-[130px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(246,243,235,0.45) 55%, transparent 75%)"
          }}
        />

        {/* Diagonal Volumetric Wave Canvas / SVG */}
        <svg 
          viewBox="0 0 1600 1000" 
          preserveAspectRatio="none"
          className="w-full h-full object-cover opacity-90"
        >
          <defs>
            {/* Specular crest linear gradient with falloffs at ends */}
            <linearGradient id="crestHighlight" x1="0%" y1="20%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            {/* Shadow side above the ridge */}
            <linearGradient id="shadowAbove" x1="40%" y1="10%" x2="45%" y2="60%">
              <stop offset="0%" stopColor="#1e221d" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#1e221d" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#1e221d" stopOpacity="0" />
            </linearGradient>

            {/* Diffuse light fan below the ridge */}
            <linearGradient id="diffuseBelow" x1="45%" y1="20%" x2="55%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#f7f5ed" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f7f5ed" stopOpacity="0" />
            </linearGradient>

            {/* Left drape shadow */}
            <linearGradient id="leftDrapeShadow" x1="0%" y1="20%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#1e221d" stopOpacity="0.06" />
              <stop offset="60%" stopColor="#1e221d" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#1e221d" stopOpacity="0" />
            </linearGradient>

            {/* Filters */}
            <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
            <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            <filter id="deepShadowBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="55" />
            </filter>
            <filter id="leftFoldBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="40" />
            </filter>
          </defs>

          {/* 1. Upper Shadow Envelope (Creates the 3D surface dipping behind the ridge) */}
          <path 
            d="M -150,-50 L 1750,-50 L 1750,560 C 1100,380 600,210 -150,130 Z" 
            fill="url(#shadowAbove)" 
            filter="url(#deepShadowBlur)"
          />

          {/* 2. Lower Light Diffusion Fan (Volumetric light wash below the ridge) */}
          <path 
            d="M -150,130 C 600,210 1100,380 1750,560 L 1750,1050 L -150,1050 Z" 
            fill="url(#diffuseBelow)" 
            filter="url(#softBlur)"
          />

          {/* 3. Left Secondary Drape/Fold (Matches the soft vertical contour on the left of the image) */}
          <path 
            d="M 320,180 C 220,380 120,640 -80,920" 
            fill="none" 
            stroke="url(#leftDrapeShadow)" 
            strokeWidth="110" 
            filter="url(#leftFoldBlur)" 
          />

          {/* 4. Broad Diffuse Shadow Under the Ridge (Provides tactile depth) */}
          <path 
            d="M -150,140 C 600,220 1100,390 1750,570" 
            fill="none" 
            stroke="rgba(30, 35, 28, 0.05)" 
            strokeWidth="90" 
            filter="url(#deepShadowBlur)" 
          />

          {/* 5. Volumetric Soft Light Halo along the Ridge */}
          <path 
            d="M -150,130 C 600,210 1100,380 1750,560" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="38" 
            filter="url(#softBlur)" 
            opacity="0.9"
          />

          {/* 6. Glowing Luminous Crest Line */}
          <path 
            d="M -150,130 C 600,210 1100,380 1750,560" 
            fill="none" 
            stroke="url(#crestHighlight)" 
            strokeWidth="8" 
            filter="url(#crispGlow)" 
          />

          {/* 7. Ultra-fine Specular Highlight Blade */}
          <path 
            d="M -150,130 C 600,210 1100,380 1750,560" 
            fill="none" 
            stroke="url(#crestHighlight)" 
            strokeWidth="2.2" 
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Content Container - Strictly matches max-w-7xl px-6 from other sections */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Brand Editorial Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <h1 className="font-serif text-olive leading-[0.85] text-center">
            <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] xl:text-[11.5rem] block tracking-tighter mix-blend-multiply">
              N
              <span className="relative inline-block">
                ı
                <span 
                  className="absolute left-[50%] -translate-x-[40%] top-[0.21em] pointer-events-none"
                >
                  <svg
                    viewBox="0 0 100 155"
                    className="w-[0.13em] h-[0.20em] fill-olive text-olive"
                  >
                    <path d="M 40.91,0.0 L 43.51,9.86 L 41.95,21.66 L 36.62,31.39 L 17.14,55.26 L 7.79,69.13 L 1.69,83.66 L 0.0,100.65 L 4.16,115.83 L 11.43,128.28 L 17.53,136.06 L 37.92,154.87 L 30.0,145.4 L 24.29,134.77 L 22.6,128.15 L 22.6,119.85 L 26.36,107.92 L 31.82,99.23 L 34.16,108.44 L 38.57,112.46 L 37.27,97.02 L 39.74,84.05 L 45.84,73.15 L 54.94,65.11 L 53.64,69.91 L 54.42,78.86 L 72.73,106.36 L 77.27,119.85 L 77.27,128.15 L 74.42,137.62 L 69.87,145.4 L 61.95,154.87 L 81.95,136.45 L 91.69,123.48 L 98.57,107.66 L 99.87,92.35 L 95.32,75.62 L 83.12,56.03 L 82.47,62.26 L 79.61,70.04 L 74.55,75.88 L 70.52,77.56 L 72.6,50.07 L 68.57,31.78 L 64.55,23.35 L 56.75,12.71 L 48.96,5.32 Z" />
                  </svg>
                </span>
              </span>
              vati
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-lora not-italic font-normal block mt-2 text-neutral-800 tracking-wide">
              The Flame Craft
            </span>
          </h1>
        </motion.div>

        {/* Animated Slogan Reveal with Feathered Gradient Fade (Eliminates flat cutout edge) */}
        <div 
          className="h-10 sm:h-11 lg:h-12 overflow-hidden relative flex items-center justify-center mt-3 sm:mt-4 max-w-xl"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p 
              key={sloganIndex}
              initial={{ y: 8, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -8, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-700 font-sans font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase text-center whitespace-nowrap"
            >
              {slogans[sloganIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Desktop Centered CTA Buttons (Kept above cards on desktop) */}
        <motion.div 
          className="hidden md:flex flex-row items-center justify-center gap-4 sm:gap-5 mt-7 sm:mt-8 z-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
        >
          <Link 
            href="/shop"
            className="px-9 py-4.5 btn-mesh text-creme rounded-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 text-center font-medium tracking-wide text-base shadow-md inline-flex items-center gap-2.5 group"
          >
            <span>Shop Collection</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">→</span>
          </Link>
          <Link 
            href="#workshops"
            className="px-9 py-4.5 border border-neutral-400 text-neutral-900 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-neutral-900 hover:text-creme hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 font-medium text-center text-base"
          >
            Learn the Craft
          </Link>
        </motion.div>
      </div>

      {/* Cards Gallery */}
      <div className="w-full max-w-7xl mx-auto px-6 mt-8 sm:mt-12 lg:mt-16 relative z-10">
        
        {/* Mobile View (Option 3): Commanding Single Frame with Interactive Candle Pills & Buttons Below */}
        <div className="block md:hidden">
          {/* Pure Clean Photography Frame (Zero text inside) */}
          <Link 
            href="/shop"
            className="relative w-full h-84 sm:h-96 rounded-none overflow-hidden shadow-xl shadow-black/10 block bg-neutral-200"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={heroCards[activeMobileIndex].id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image 
                  src={heroCards[activeMobileIndex].src} 
                  alt={heroCards[activeMobileIndex].alt}
                  fill
                  priority={activeMobileIndex === 0}
                  sizes="100vw"
                  quality={90}
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          </Link>

          {/* Interactive Candle Selector Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 w-full flex-wrap">
            {heroCards.map((card, idx) => {
              const isActive = idx === activeMobileIndex;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveMobileIndex(idx)}
                  className={`px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 rounded-none cursor-pointer ${
                    isActive
                      ? "btn-mesh text-creme font-medium shadow-sm"
                      : "bg-black/5 text-neutral-700 hover:bg-black/10 hover:text-neutral-900"
                  }`}
                  aria-label={`Select ${card.alt}`}
                >
                  {card.label}
                </button>
              );
            })}
          </div>

          {/* Mobile CTA Buttons (Moved below the hero image & selector pills) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 w-full">
            <Link 
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 btn-mesh text-creme rounded-lg transition-all duration-300 active:scale-95 text-center font-medium tracking-wide text-base shadow-md inline-flex items-center justify-center gap-2.5 group"
            >
              <span>Shop Collection</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">→</span>
            </Link>
            <Link 
              href="#workshops"
              className="w-full sm:w-auto px-8 py-4 border border-neutral-400 text-neutral-900 rounded-lg tracking-wide transition-all duration-300 active:scale-95 font-medium text-center text-base"
            >
              Learn the Craft
            </Link>
          </div>
        </div>

        {/* Desktop / Tablet View (md: and up): Staggered 5 Flat Cards with Staggered Entrance Animation */}
        <div className="hidden md:flex items-end justify-center gap-5 lg:gap-6 xl:gap-8 pb-3 pt-4">
          {heroCards.map((card) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.65, 
                ease: [0.22, 1, 0.36, 1], 
                delay: card.delay 
              }}
              className="flex-1 min-w-0 flex-col items-center group flex"
            >
              {/* Flat Card Container (No border, no rounded corners) */}
              <Link 
                href="/shop"
                className={`relative w-full ${card.heightClass} ${card.bgColor} rounded-none overflow-hidden shadow-lg shadow-black/8 transform-gpu transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/15 block`}
              >
                <Image 
                  src={card.src} 
                  alt={card.alt}
                  fill
                  priority={card.delay < 0.25}
                  sizes="(max-width: 1024px) 25vw, 20vw"
                  quality={85}
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
