"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Facebook = ({ className, bgFill = "#FAFAFA", iconFill = "#5a6c37" }: { className?: string; bgFill?: string; iconFill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill={bgFill} />
    <path
      fill={iconFill}
      d="M 15.93,4.26 L 12.54,4.2 L 11.91,4.35 L 11.19,4.74 L 10.2,5.91 L 9.81,6.99 L 9.75,10.41 L 6.96,10.47 L 6.96,13.5 L 9.75,13.56 L 9.75,21.03 L 12.96,21.03 L 12.96,13.56 L 15.3,13.53 L 15.42,13.41 L 15.9,10.56 L 15.78,10.44 L 13.02,10.47 L 12.96,7.86 L 13.2,7.38 L 13.95,6.87 L 15.96,6.78 Z"
    />
  </svg>
);

const Instagram = ({ className, bgFill = "#FAFAFA", iconFill = "#5a6c37" }: { className?: string; bgFill?: string; iconFill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill={bgFill} />
    <path
      fill={iconFill}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M 6.35,5.76 L 5.61,6.65 L 5.24,7.46 L 5.17,8.12 L 5.1,8.2 L 5.1,15.66 L 5.39,16.69 L 5.98,17.65 L 6.42,18.09 L 7.09,18.54 L 8.05,18.9 L 8.42,18.9 L 8.49,18.98 L 15.88,18.98 L 15.95,18.9 L 16.32,18.9 L 16.98,18.68 L 17.94,18.09 L 18.68,17.28 L 19.05,16.54 L 19.2,16.1 L 19.2,15.8 L 19.27,15.73 L 19.27,8.05 L 19.2,7.98 L 19.2,7.68 L 19.05,7.24 L 18.76,6.65 L 18.31,6.06 L 17.43,5.32 L 16.98,5.1 L 16.32,4.87 L 15.95,4.87 L 15.88,4.8 L 8.57,4.8 L 8.49,4.87 L 8.12,4.87 L 7.38,5.1 Z M 16.98,6.42 L 17.72,7.16 L 18.02,7.75 L 18.09,8.27 L 18.17,8.34 L 18.17,15.43 L 18.09,15.51 L 18.09,15.8 L 18.02,15.88 L 17.94,16.25 L 17.5,16.91 L 16.91,17.43 L 16.47,17.65 L 16.32,17.65 L 16.02,17.8 L 15.66,17.8 L 15.58,17.87 L 8.86,17.87 L 8.79,17.8 L 8.34,17.8 L 8.27,17.72 L 7.9,17.65 L 7.38,17.35 L 6.57,16.47 L 6.35,16.02 L 6.35,15.88 L 6.28,15.8 L 6.28,15.43 L 6.2,15.36 L 6.2,8.49 L 6.28,8.42 L 6.28,8.05 L 6.35,7.98 L 6.42,7.61 L 6.65,7.31 L 6.72,7.09 L 7.61,6.28 L 8.12,6.06 L 8.34,6.06 L 8.42,5.98 L 15.29,5.98 L 15.36,5.91 L 15.43,5.98 L 16.02,5.98 L 16.1,6.06 L 16.47,6.13 Z M 11.43,7.83 L 11.37,7.92 L 10.95,7.92 L 10.86,8.01 L 10.71,8.01 L 10.5,8.16 L 10.32,8.16 L 10.02,8.31 L 9.84,8.49 L 9.78,8.46 L 9.6,8.64 L 9.51,8.64 L 9.15,9.03 L 9.03,9.03 L 9.03,9.15 L 8.64,9.51 L 8.01,10.77 L 8.01,11.04 L 7.92,11.1 L 7.92,11.52 L 7.83,11.61 L 7.83,12.36 L 7.92,12.45 L 7.92,12.87 L 8.01,12.93 L 8.07,13.41 L 8.16,13.47 L 8.16,13.65 L 8.31,13.95 L 8.49,14.13 L 8.46,14.19 L 8.55,14.37 L 9.6,15.42 L 10.41,15.81 L 10.47,15.9 L 10.86,15.96 L 10.95,16.05 L 11.28,16.05 L 11.37,16.14 L 12.6,16.14 L 12.69,16.05 L 13.02,16.05 L 13.11,15.96 L 13.5,15.9 L 13.56,15.81 L 13.74,15.81 L 13.86,15.66 L 14.22,15.48 L 14.28,15.51 L 15.51,14.28 L 15.48,14.22 L 15.66,14.04 L 15.9,13.56 L 15.96,13.17 L 16.05,13.11 L 16.05,12.84 L 16.14,12.78 L 16.11,12.18 L 16.2,12.09 L 16.2,11.82 L 16.11,11.73 L 16.14,11.19 L 16.05,11.13 L 16.05,10.86 L 15.9,10.65 L 15.9,10.47 L 15.72,10.23 L 15.75,10.11 L 15.57,9.93 L 15.42,9.6 L 14.37,8.55 L 13.56,8.16 L 13.5,8.07 L 13.02,8.01 L 12.93,7.92 L 12.6,7.92 L 12.54,7.83 Z M 11.58,9.24 L 12.39,9.24 L 12.48,9.33 L 12.75,9.3 L 12.84,9.39 L 13.02,9.39 L 13.08,9.48 L 13.17,9.48 L 13.26,9.57 L 13.32,9.54 L 13.5,9.72 L 13.59,9.72 L 14.34,10.47 L 14.34,10.56 L 14.43,10.65 L 14.4,10.71 L 14.49,10.8 L 14.49,10.89 L 14.58,10.95 L 14.58,11.13 L 14.67,11.22 L 14.64,11.34 L 14.73,11.43 L 14.73,12.54 L 14.64,12.63 L 14.67,12.84 L 14.58,12.93 L 14.58,13.02 L 14.49,13.08 L 14.49,13.17 L 14.4,13.26 L 14.43,13.32 L 14.34,13.41 L 14.34,13.5 L 14.19,13.62 L 14.19,13.71 L 13.65,14.25 L 13.56,14.25 L 13.41,14.43 L 13.35,14.4 L 13.26,14.49 L 13.17,14.49 L 13.11,14.58 L 12.93,14.58 L 12.84,14.67 L 12.72,14.64 L 12.63,14.73 L 12.21,14.73 L 12.15,14.82 L 11.82,14.82 L 11.76,14.73 L 11.34,14.73 L 11.25,14.64 L 11.13,14.67 L 11.04,14.58 L 10.86,14.58 L 10.8,14.49 L 10.71,14.49 L 10.56,14.34 L 10.47,14.34 L 10.35,14.19 L 10.26,14.19 L 9.78,13.71 L 9.78,13.62 L 9.63,13.5 L 9.63,13.41 L 9.54,13.32 L 9.57,13.26 L 9.48,13.17 L 9.48,13.08 L 9.39,13.02 L 9.39,12.84 L 9.3,12.75 L 9.33,12.54 L 9.24,12.48 L 9.24,11.49 L 9.33,11.43 L 9.3,11.22 L 9.39,11.13 L 9.39,11.04 L 9.48,10.95 L 9.48,10.8 L 9.57,10.71 L 9.54,10.65 L 9.72,10.47 L 9.72,10.38 L 10.38,9.72 L 10.65,9.63 L 10.8,9.48 L 10.95,9.48 L 11.04,9.39 L 11.19,9.39 L 11.28,9.3 L 11.49,9.33 Z M 15.8,7.31 L 15.73,7.38 L 15.66,7.38 L 15.51,7.53 L 15.43,7.53 L 15.43,7.61 L 15.29,7.75 L 15.29,8.34 L 15.36,8.42 L 15.36,8.49 L 15.66,8.79 L 15.8,8.79 L 15.88,8.86 L 16.17,8.86 L 16.25,8.79 L 16.32,8.79 L 16.39,8.71 L 16.47,8.71 L 16.69,8.49 L 16.69,8.42 L 16.76,8.34 L 16.76,7.83 L 16.69,7.75 L 16.69,7.68 L 16.39,7.38 L 16.32,7.38 L 16.25,7.31 Z"
    />
  </svg>
);

const TikTok = ({ className, bgFill = "#FAFAFA", iconFill = "#5a6c37" }: { className?: string; bgFill?: string; iconFill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill={bgFill} />
    <path
      fill={iconFill}
      d="M 15.42,4.68 L 12.84,4.68 L 12.84,15.48 L 12.51,16.35 L 12.0,16.95 L 11.04,17.43 L 9.75,17.34 L 9.27,17.1 L 8.61,16.44 L 8.28,15.63 L 8.37,14.43 L 9.21,13.35 L 10.08,12.96 L 11.1,13.05 L 11.22,12.93 L 11.22,10.38 L 10.08,10.29 L 9.24,10.44 L 8.1,10.92 L 6.81,11.97 L 5.94,13.41 L 5.61,15.54 L 6.03,17.16 L 7.17,18.75 L 8.67,19.71 L 9.75,20.01 L 11.97,19.86 L 12.93,19.47 L 13.74,18.9 L 14.79,17.7 L 15.42,15.87 L 15.48,9.78 L 17.19,10.74 L 17.91,10.89 L 19.14,10.8 L 19.14,8.43 L 17.37,8.01 L 16.29,7.08 L 15.48,5.49 Z"
    />
  </svg>
);

export default function Footer() {
  const letters = ["N", "I", "V", "A", "T", "I"];
  const watermarkRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: watermarkRef,
    offset: ["start end", "end start"],
  });

  // Senior UI/UX Physics: Spring-damped transforms eliminate raw scroll jumps
  const springConfig = { stiffness: 60, damping: 22, mass: 0.8 };

  const rawY1 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const rawY2 = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const rawY3 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const rawY4 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const rawR1 = useTransform(scrollYProgress, [0, 1], [-18, -12]);
  const rawR2 = useTransform(scrollYProgress, [0, 1], [9, 15]);
  const rawR3 = useTransform(scrollYProgress, [0, 1], [-13, -7]);
  const rawR4 = useTransform(scrollYProgress, [0, 1], [15, 21]);

  const y1 = useSpring(rawY1, springConfig);
  const y2 = useSpring(rawY2, springConfig);
  const y3 = useSpring(rawY3, springConfig);
  const y4 = useSpring(rawY4, springConfig);

  const r1 = useSpring(rawR1, springConfig);
  const r2 = useSpring(rawR2, springConfig);
  const r3 = useSpring(rawR3, springConfig);
  const r4 = useSpring(rawR4, springConfig);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const letterVariants = (index: number) => ({
    hidden: {
      y: index % 2 === 0 ? "-115%" : "115%",
    },
    visible: {
      y: "0%",
      transition: {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  });

  const candleVariants = (delay: number) => ({
    hidden: {
      opacity: 0,
      scale: 0.6,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  });

  return (
    <footer className="relative bg-creme pt-8 md:pt-16 pb-0 transition-colors duration-700 overflow-hidden">
      
      {/* Large Brand Watermark with Overlapping Candle Images */}
      <div 
        ref={watermarkRef}
        className="relative w-full overflow-hidden py-16 md:py-24 flex items-center justify-center select-none"
      >
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative inline-block"
        >
          <motion.h2 
            variants={containerVariants}
            className="text-[18vw] md:text-[14vw] font-serif font-black text-olive uppercase leading-none flex justify-center"
          >
            {letters.map((char, index) => (
              <span
                key={index}
                className="inline-flex overflow-hidden py-[0.06em] -my-[0.06em] mr-[0.18em] last:mr-0"
              >
                <motion.span
                  variants={letterVariants(index)}
                  className="inline-block will-change-transform"
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          
          {/* Left Overlapping Image (overlapping N) */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <motion.div 
              style={isMobile ? undefined : { y: y1, rotate: r1 }}
              className="will-change-transform"
            >
              <motion.div
                variants={candleVariants(0.1)}
                className="w-[20vw] h-[20vw] md:w-28 md:h-28 lg:w-44 lg:h-44 xl:w-56 xl:h-56 rotate-[-15deg] relative"
              >
                <Image src="/images/footer_1.png" alt="Nivati candle craft" width={224} height={224} loading="lazy" className="w-full h-full object-contain filter drop-shadow-xl" />
              </motion.div>
            </motion.div>
          </div>

          {/* Top Overlapping Image (overlapping top of V/A) */}
          <div className="absolute top-0 left-[38%] -translate-x-1/2 -translate-y-[40%] z-20 pointer-events-none">
            <motion.div 
              style={isMobile ? undefined : { y: y2, rotate: r2 }}
              className="will-change-transform"
            >
              <motion.div
                variants={candleVariants(0.22)}
                className="w-[16vw] h-[16vw] md:w-24 md:h-24 lg:w-36 lg:h-36 xl:w-48 xl:h-48 rotate-12 relative"
              >
                <Image src="/images/footer_2.png" alt="Nivati candle craft" width={192} height={192} loading="lazy" className="w-full h-full object-contain filter drop-shadow-xl" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Overlapping Image (overlapping bottom of A/T) */}
          <div className="absolute bottom-0 left-[62%] -translate-x-1/2 translate-y-[40%] z-20 pointer-events-none">
            <motion.div 
              style={isMobile ? undefined : { y: y3, rotate: r3 }}
              className="will-change-transform"
            >
              <motion.div
                variants={candleVariants(0.32)}
                className="w-[16vw] h-[16vw] md:w-24 md:h-24 lg:w-36 lg:h-36 xl:w-48 xl:h-48 rotate-[-10deg] relative"
              >
                <Image src="/images/footer_3.png" alt="Nivati candle craft" width={192} height={192} loading="lazy" className="w-full h-full object-contain filter drop-shadow-xl" />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Overlapping Image (overlapping final I) */}
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <motion.div 
              style={isMobile ? undefined : { y: y4, rotate: r4 }}
              className="will-change-transform"
            >
              <motion.div
                variants={candleVariants(0.44)}
                className="w-[20vw] h-[20vw] md:w-28 md:h-28 lg:w-44 lg:h-44 xl:w-56 xl:h-56 rotate-18 relative"
              >
                <Image src="/images/footer_4.png" alt="Nivati candle craft" width={224} height={224} loading="lazy" className="w-full h-full object-contain filter drop-shadow-xl" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Green Footer Box */}
      <div 
        className="max-w-7xl mx-auto bg-mesh-grain text-creme rounded-none px-6 sm:px-10 md:px-14 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-12 shadow-2xl border border-white/10 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Image src="/images/logo.png" alt="Nivati Logo" width={80} height={80} loading="lazy" className="h-16 w-16 md:h-20 md:w-20 object-contain brightness-0 invert opacity-95" />
              </div>
              <p className="text-creme/75 font-sans font-light max-w-sm leading-relaxed mb-6 text-sm md:text-base">
                Empowering your sanctuary with hand-poured scents and mindful crafting. Find your glow.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.facebook.com/nivati.np" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm"
                >
                  <Facebook className="w-full h-full" bgFill="#FAFAFA" iconFill="#3b4132" />
                </a>
                <a 
                  href="https://www.instagram.com/nivati.np" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm"
                >
                  <Instagram className="w-full h-full" bgFill="#FAFAFA" iconFill="#3b4132" />
                </a>
                <a 
                  href="https://www.tiktok.com/@nivati.np" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="TikTok"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm"
                >
                  <TikTok className="w-full h-full" bgFill="#FAFAFA" iconFill="#3b4132" />
                </a>
              </div>
            </div>

            {/* Shop & Support side by side on mobile */}
            <div className="grid grid-cols-2 md:contents gap-6">
              <div>
                <h3 className="font-serif text-creme text-lg md:text-xl mb-3 md:mb-4">Shop</h3>
                <ul className="flex flex-col gap-2 md:gap-3 font-light text-creme/75 text-sm md:text-base">
                  <li><Link href="/shop?category=Signature Candles" className="hover:text-white transition-colors">Signature Candles</Link></li>
                  <li><Link href="/shop?category=Candle Making Kit" className="hover:text-white transition-colors">DIY Kits</Link></li>
                  <li><Link href="/#workshops" className="hover:text-white transition-colors">Workshops</Link></li>
                  <li><Link href="/shop?category=Candle Making Materials" className="hover:text-white transition-colors">Raw Materials</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-creme text-lg md:text-xl mb-3 md:mb-4">Support</h3>
                <ul className="flex flex-col gap-2 md:gap-3 font-light text-creme/75 text-sm md:text-base">
                  <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                  <li><Link href="/wholesale" className="hover:text-white transition-colors">Wholesale & Bulk</Link></li>
                  <li><a href="tel:+9779842003249" className="hover:text-white transition-colors">Contact Us: +977 9842003249</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-creme/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-creme/60">
            <p>© {new Date().getFullYear()} Nivati — The Flame Craft. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
