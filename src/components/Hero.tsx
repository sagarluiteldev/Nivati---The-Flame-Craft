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
  { src: "/images/IMG_4136.jpg", alt: "Hand-poured Nivati candle lifestyle" },
  { src: "/images/IMG_4133.jpg", alt: "Cactus Jar Premium Candle" },
  { src: "/images/IMG_4147.jpg", alt: "Jack Daniels Whiskeysilicone gel candle" },
  { src: "/images/IMG_4069.jpg", alt: "Large Concrete Bowl Candle" }
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
      <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-sage/5 rounded-l-none lg:rounded-l-[200px] -z-10" />

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

        <motion.div 
          className="relative h-[40vh] lg:h-[75vh] w-full mt-4 lg:mt-0"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "circOut" }}
        >
          {/* Image Container with continuous loop gallery */}
          <div 
            className="relative h-full w-full rounded-[30px] lg:rounded-[40px] shadow-2xl border-4 lg:border-12 border-white/50 backdrop-blur-md"
          >
            <div className="absolute inset-0 rounded-[26px] lg:rounded-[28px] overflow-hidden" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
              <div className="absolute inset-0 bg-sage/10 mix-blend-multiply z-10 pointer-events-none" />
              
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
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Gallery Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Hero gallery slider">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    currentImageIndex === i ? "bg-white w-4" : "bg-white/40"
                  }`}
                  role="tab"
                  aria-selected={currentImageIndex === i}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Decorative floating square */}
          <div className="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8 w-24 h-24 lg:w-48 lg:h-48 bg-olive rounded-2xl lg:rounded-3xl -z-10 shadow-2xl opacity-20 blur-xl lg:blur-2xl" />
        </motion.div>

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
