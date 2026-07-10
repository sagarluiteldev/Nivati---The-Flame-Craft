"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const MotionImage = motion(Image);

const slogans = [
  "Scented Handmade Candles",
  "Artisan Craftsmanship",
  "Sustainable Luxury",
  "Intentionally Poured"
];

const heroImages = [
  { src: "/images/IMG_4136.jpg", alt: "Hand-poured Nivati candle lifestyle", position: "center" },
  { src: "/images/IMG_4133.jpg", alt: "Cactus Jar Premium Candle", position: "center 70%" },
  { src: "/images/IMG_4147.jpg", alt: "Jack Daniels Whiskeysilicone gel candle", position: "center 80%" },
  { src: "/images/IMG_4069.jpg", alt: "Large Concrete Bowl Candle", position: "center 80%" }
];

export default function Hero() {
  const [sloganIndex, setSloganIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scroll parallax transforms
  const rotate1 = useTransform(scrollYProgress, [0, 1], [60, 105]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-15, -45]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [25, -10]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 4000);
    
    // Gallery auto-play
    const galleryTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(galleryTimer);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 40,
      y: (clientY / innerHeight - 0.5) * 40
    });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center pt-24 lg:pt-32 pb-20 lg:pb-0 overflow-hidden bg-creme select-none"
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('/images/paper-fibers.png')]" />
      
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-sage/5 rounded-l-none lg:rounded-l-[200px] -z-10 hidden lg:block" />

      {/* Floating Parallax Elements - Restricted to Desktop for performance and clarity */}
      <motion.img 
        src="/images/lavender_sprig.png"
        alt=""
        style={{ rotate: rotate1, x: mousePos.x * 0.5, y: useTransform(scrollYProgress, [0, 1], [(mousePos.y * 0.5), -150 + (mousePos.y * 0.5)]) }}
        className="absolute top-[15%] left-[5%] w-32 h-auto opacity-60 blur-[0.5px] pointer-events-none z-20 hidden lg:block mix-blend-multiply"
      />
      <motion.img 
        src="/images/orange_slice.png"
        alt=""
        style={{ rotate: rotate2, x: mousePos.x * -0.8, y: useTransform(scrollYProgress, [0, 1], [(mousePos.y * -0.8), -300 + (mousePos.y * -0.8)]) }}
        className="absolute bottom-[20%] left-[40%] w-24 h-auto opacity-50 blur-[1px] pointer-events-none z-20 hidden lg:block mix-blend-multiply"
      />
      <motion.img 
        src="/images/jasmine_petal.png"
        alt=""
        style={{ rotate: rotate3, x: mousePos.x * 1.2, y: useTransform(scrollYProgress, [0, 1], [(mousePos.y * 1.2), -150 + (mousePos.y * 1.2)]) }}
        className="absolute top-[40%] left-[25%] w-12 h-auto opacity-70 pointer-events-none z-20 hidden lg:block mix-blend-multiply"
      />

      {/* Big Blending Hero Image - Desktop Full Bleed View */}
      <motion.div 
        className="absolute right-0 top-0 bottom-0 w-[50vw] overflow-hidden z-0 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
      >
        <AnimatePresence>
          <MotionImage 
            key={currentImageIndex}
            src={heroImages[currentImageIndex].src} 
            alt={heroImages[currentImageIndex].alt}
            fill
            priority
            sizes="50vw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: heroImages[currentImageIndex].position || "center" }}
          />
        </AnimatePresence>

        {/* Soft edge blend overlays to blend with creme background */}
        {/* Left-to-Right Blend (Subtle, long gradient transition) */}
        <div 
          className="absolute inset-y-0 left-0 w-[45%] z-10 pointer-events-none" 
          style={{
            background: 'linear-gradient(to right, #FBFEF9 0%, rgba(251, 254, 249, 0.98) 12%, rgba(251, 254, 249, 0.85) 30%, rgba(251, 254, 249, 0.5) 60%, rgba(251, 254, 249, 0.18) 82%, rgba(251, 254, 249, 0) 100%)'
          }}
        />
        {/* Top-to-Bottom Blend (Prevents harsh top boundaries) */}
        <div 
          className="absolute inset-x-0 top-0 h-[20%] z-10 pointer-events-none" 
          style={{
            background: 'linear-gradient(to bottom, #FBFEF9 0%, rgba(251, 254, 249, 0.7) 35%, rgba(251, 254, 249, 0.25) 70%, rgba(251, 254, 249, 0) 100%)'
          }}
        />
        {/* Bottom-to-Top Blend (Prevents harsh bottom boundaries) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[20%] z-10 pointer-events-none" 
          style={{
            background: 'linear-gradient(to top, #FBFEF9 0%, rgba(251, 254, 249, 0.7) 35%, rgba(251, 254, 249, 0.25) 70%, rgba(251, 254, 249, 0) 100%)'
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        <div className="flex flex-col gap-8 lg:gap-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Editorial Heading Design */}
            <h1 className="font-serif text-olive leading-none">
              <span className="text-6xl md:text-8xl lg:text-[11rem] block tracking-tighter mix-blend-multiply">
                Nivati
              </span>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-lg md:text-2xl lg:text-4xl italic font-light relative inline-block mt-2 lg:-mt-8 lg:ml-2 text-sage whitespace-nowrap"
              >
                The Flame Craft
              </motion.span>
            </h1>
          </motion.div>

          {/* Interactive Slogan Reveal */}
          <div className="h-8 lg:h-12 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.p 
                key={sloganIndex}
                initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="text-lg lg:text-2xl text-olive/70 font-sans font-light tracking-widest uppercase"
              >
                {slogans[sloganIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div 
            className="hidden lg:flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2 lg:pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Link 
              href="/shop"
              className="px-8 py-4 bg-olive text-creme rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(40,54,24,0.3)] active:scale-95 text-center font-medium tracking-wide"
            >
              Shop Collection
            </Link>
            <Link 
              href="#workshops"
              className="px-8 py-4 border border-olive/30 text-olive rounded-full tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(40,54,24,0.1)] active:scale-95 font-light text-center"
            >
              Learn the Craft
            </Link>
          </motion.div>

          {/* Luxury Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="hidden lg:flex pt-6 lg:pt-8 border-t border-olive/10 justify-center lg:justify-start items-center gap-6"
          >
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-olive font-bold">Handmade with Love</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-olive font-bold">Pure Soy Wax</span>
            </div>
          </motion.div>
        </div>

        {/* Mobile View Image container / Desktop Grid Spacer */}
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 h-[45vh] lg:h-[75vh] lg:w-full lg:translate-x-0 lg:left-0 lg:right-0 mt-4 lg:mt-0 z-0 lg:opacity-0 lg:pointer-events-none">
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence>
              <MotionImage 
                key={currentImageIndex}
                src={heroImages[currentImageIndex].src} 
                alt={heroImages[currentImageIndex].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: heroImages[currentImageIndex].position || "center" }}
              />
            </AnimatePresence>
            
            {/* Soft vertical blends for mobile (Subtle, long gradient transition) */}
            <div 
              className="absolute inset-x-0 top-0 h-[30%] z-10 pointer-events-none" 
              style={{
                background: 'linear-gradient(to bottom, #FBFEF9 0%, rgba(251, 254, 249, 0.95) 15%, rgba(251, 254, 249, 0.7) 45%, rgba(251, 254, 249, 0.25) 75%, rgba(251, 254, 249, 0) 100%)'
              }}
            />
            <div 
              className="absolute inset-x-0 bottom-0 h-[30%] z-10 pointer-events-none" 
              style={{
                background: 'linear-gradient(to top, #FBFEF9 0%, rgba(251, 254, 249, 0.95) 15%, rgba(251, 254, 249, 0.7) 45%, rgba(251, 254, 249, 0.25) 75%, rgba(251, 254, 249, 0) 100%)'
              }}
            />
          </div>
        </div>

        {/* Mobile only buttons */}
        <motion.div 
          className="flex lg:hidden flex-col sm:flex-row justify-center gap-4 -mt-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link 
            href="/shop"
            className="px-8 py-4 bg-olive text-creme rounded-full text-center font-medium tracking-wide"
          >
            Shop Collection
          </Link>
          <Link 
            href="#workshops"
            className="px-8 py-4 border border-olive/30 text-olive rounded-full tracking-wide font-light text-center"
          >
            Learn the Craft
          </Link>
        </motion.div>

        {/* Mobile only Luxury Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex lg:hidden pt-4 border-t border-olive/10 justify-center items-center w-4/5 mx-auto mb-8"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-olive font-bold">Handmade with Love</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-olive font-bold">Pure Soy Wax</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
