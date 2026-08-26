"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const MotionImage = motion.create(Image);

const slogans = [
  "Scented Handmade Candles",
  "Handcrafted with Heart",
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
    
    // Gallery auto-play (6s interval to avoid LCP measurement collisions)
    const galleryTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

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
      className="relative min-h-[90vh] lg:h-screen lg:min-h-0 flex items-center pt-20 md:pt-24 pb-16 lg:pb-0 overflow-hidden bg-creme select-none"
    >
      {/* Texture Overlay - Desktop Only */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('/images/paper-fibers.png')] hidden lg:block" />
      
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-sage/5 rounded-none -z-10 hidden lg:block" />

      {/* Floating Parallax Elements - Restricted to Desktop for performance and clarity */}
      <motion.img 
        src="/images/lavender_sprig.png"
        alt=""
        fetchPriority="low"
        loading="lazy"
        width={128}
        height={128}
        style={{ rotate: rotate1, x: mousePos.x * 0.5, y: useTransform(scrollYProgress, [0, 1], [(mousePos.y * 0.5), -150 + (mousePos.y * 0.5)]) }}
        className="absolute top-[15%] left-[5%] w-32 h-auto opacity-60 blur-[0.5px] pointer-events-none z-20 hidden lg:block mix-blend-multiply"
      />
      <motion.img 
        src="/images/orange_slice.png"
        alt=""
        fetchPriority="low"
        loading="lazy"
        width={96}
        height={96}
        style={{ rotate: rotate2, x: mousePos.x * -0.8, y: useTransform(scrollYProgress, [0, 1], [(mousePos.y * -0.8), -300 + (mousePos.y * -0.8)]) }}
        className="absolute bottom-[20%] left-[40%] w-24 h-auto opacity-50 blur-[1px] pointer-events-none z-20 hidden lg:block mix-blend-multiply"
      />
      <motion.img 
        src="/images/jasmine_petal.png"
        alt=""
        fetchPriority="low"
        loading="lazy"
        width={48}
        height={48}
        style={{ rotate: rotate3, x: mousePos.x * 1.2, y: useTransform(scrollYProgress, [0, 1], [(mousePos.y * 1.2), -150 + (mousePos.y * 1.2)]) }}
        className="absolute top-[40%] left-[25%] w-12 h-auto opacity-70 pointer-events-none z-20 hidden lg:block mix-blend-multiply"
      />

      {/* Big Crisp Hero Image - Desktop (0 border radius with slow, graceful entrance animation) */}
      <motion.div 
        initial={{ opacity: 0, x: 30, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute right-4 sm:right-6 lg:right-8 xl:right-12 top-28 lg:top-32 bottom-6 lg:bottom-8 xl:bottom-10 w-[45vw] xl:w-[44vw] rounded-none overflow-hidden shadow-2xl shadow-black/10 border border-black/5 z-0 hidden lg:block"
      >
        {/* Instant SSR Base Image (Zero render delay for LCP) */}
        <Image 
          src={heroImages[0].src} 
          alt={heroImages[0].alt}
          fill
          priority
          fetchPriority="high"
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: heroImages[0].position || "center" }}
        />

        {/* Dynamic Carousel Slide (Only renders when rotating past slide 0) */}
        <AnimatePresence mode="popLayout">
          {currentImageIndex > 0 && (
            <MotionImage 
              key={currentImageIndex}
              src={heroImages[currentImageIndex].src} 
              alt={heroImages[currentImageIndex].alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover z-5"
              style={{ objectPosition: heroImages[currentImageIndex].position || "center" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="w-full max-w-440 mx-auto pl-6 sm:pl-10 md:pl-14 lg:pl-16 xl:pl-20 pr-6 lg:pr-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center relative z-10">
        <div className="flex flex-col gap-6 lg:gap-8 text-center lg:text-left max-w-2xl lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Editorial Heading Design */}
            <h1 className="font-serif text-olive leading-[0.88]">
              <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[13.5rem] block tracking-tighter mix-blend-multiply">
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
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-lora not-italic font-normal relative inline-block mt-2 lg:-mt-8 lg:ml-3 text-neutral-800 whitespace-nowrap"
              >
                The Flame Craft
              </motion.span>
            </h1>
          </motion.div>

          {/* Interactive Slogan Reveal (40% smaller, single line guaranteed) */}
          <div className="h-7 sm:h-8 lg:h-9 overflow-hidden relative flex items-center justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              <motion.p 
                key={sloganIndex}
                initial={{ y: 15, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -15, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.7, ease: "circOut" }}
                className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-700 font-sans font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap"
              >
                {slogans[sloganIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div 
            className="hidden lg:flex flex-col sm:flex-row justify-center lg:justify-start gap-5 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Link 
              href="/shop"
              className="px-9 py-4.5 btn-mesh text-creme rounded-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 text-center font-medium tracking-wide text-base shadow-lg"
            >
              Shop Collection
            </Link>
            <Link 
              href="#workshops"
              className="px-9 py-4.5 border border-neutral-400 text-neutral-900 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-neutral-900 hover:text-creme hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 font-medium text-center text-base"
            >
              Learn the Craft
            </Link>
          </motion.div>

          {/* Luxury Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="hidden lg:flex pt-2 justify-center lg:justify-start items-center gap-6"
          >
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-700 font-bold">Handmade with Love</span>
              <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-700 font-bold">Pure Soy Wax</span>
            </div>
          </motion.div>
        </div>

        {/* Mobile View Image container (0 border radius with slow, graceful entrance animation) */}
        <motion.div 
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative w-full h-100 sm:h-115 -mt-1 sm:mt-1 mb-6 rounded-none overflow-hidden shadow-xl shadow-black/10 border border-black/5 z-0 block lg:hidden"
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* Instant SSR Base Image (Zero render delay for Mobile LCP) */}
            <Image 
              src={heroImages[0].src} 
              alt={heroImages[0].alt}
              fill
              priority
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: heroImages[0].position || "center" }}
            />

            {/* Dynamic Carousel Slide (Only renders when rotating past slide 0) */}
            <AnimatePresence mode="popLayout">
              {currentImageIndex > 0 && (
                <MotionImage 
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex].src} 
                  alt={heroImages[currentImageIndex].alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover z-5"
                  style={{ objectPosition: heroImages[currentImageIndex].position || "center" }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mobile only buttons */}
        <motion.div 
          className="flex lg:hidden flex-col sm:flex-row justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link 
            href="/shop"
            className="px-8 py-4 btn-mesh text-creme rounded-lg text-center font-medium tracking-wide shadow-md"
          >
            Shop Collection
          </Link>
          <Link 
            href="#workshops"
            className="px-8 py-4 border border-neutral-400 text-neutral-900 rounded-lg tracking-wide font-medium text-center"
          >
            Learn the Craft
          </Link>
        </motion.div>

        {/* Mobile only Luxury Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex lg:hidden pt-2 justify-center items-center w-4/5 mx-auto mb-8"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-700 font-bold">Handmade with Love</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-700 font-bold">Pure Soy Wax</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
