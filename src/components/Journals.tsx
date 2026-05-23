"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StarIcon as Star } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

const cinematicReviews = [
  {
    name: "Sarah Jenkins",
    badge: "Verified Maker",
    quote: "The beginner's kit completely changed my weekend routine. The instructions were flawless, and the scent fills my entire living room.",
    scent: "Oud & Bergamot",
    image: "/images/IMG_4136.jpg"
  },
  {
    name: "Marcus T.",
    badge: "Verified Maker",
    quote: "I took the virtual masterclass and it was incredible. Learning the science behind scent throw made my own DIY candles perform like luxury brands.",
    scent: "Sandalwood & Rose",
    image: "/images/IMG_4133.jpg"
  },
  {
    name: "Elena R.",
    badge: "Verified Buyer",
    quote: "The unboxing experience alone is worth it. Absolutely stunning packaging, zero plastic, and the candle burns so evenly.",
    scent: "Fig & Vetiver",
    image: "/images/IMG_4147.jpg"
  }
];

const editorialReviews = [
  {
    name: "Chloe M.",
    badge: "Verified Buyer",
    quote: "The most beautiful candles I've ever owned. They feel more like art pieces than just home fragrance.",
    scent: "Lavender & Sage"
  },
  {
    name: "David L.",
    badge: "Verified Maker",
    quote: "The raw materials in the DIY kit are top tier. You can really feel the difference when pouring the pure soy wax.",
    scent: "Cedar & Vanilla"
  }
];

export default function Journals() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cinematicReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-14 md:py-24 bg-creme text-olive transition-colors duration-700 overflow-hidden" id="journals">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-3 md:mb-4 text-olive transition-colors duration-700">Customer Journals</h2>
            <p className="font-sans font-light text-olive/70 max-w-xl text-sm md:text-base transition-colors duration-700">
              Stories from our community of makers and luxury candle enthusiasts.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            {cinematicReviews.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 bg-sage' : 'w-2 bg-olive/20'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cinematic Hero Review (Col Span 8) */}
          <div className="lg:col-span-8 relative min-h-[400px] flex items-center">
            <div className="absolute -inset-4 md:-inset-8 bg-olive/5 rounded-[30px] md:rounded-[40px] -z-10 transition-colors duration-700" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full relative z-10"
              >
                {/* Floating Image */}
                <div className="relative h-64 md:h-[400px] w-full rounded-2xl md:rounded-[30px] overflow-hidden shadow-2xl">
                  <motion.img 
                    src={cinematicReviews[currentIndex].image}
                    alt={cinematicReviews[currentIndex].scent}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs uppercase tracking-widest text-white mb-2">
                      {cinematicReviews[currentIndex].scent}
                    </span>
                  </div>
                </div>

                {/* Giant Typography */}
                <div className="flex flex-col justify-center py-4">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-sage text-sage" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed md:leading-snug mb-8 text-olive">
                    &quot;{cinematicReviews[currentIndex].quote}&quot;
                  </blockquote>
                  <div>
                    <div className="font-serif text-xl tracking-wide">{cinematicReviews[currentIndex].name}</div>
                    <div className="text-sm font-light text-olive/50 mt-1 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                      {cinematicReviews[currentIndex].badge}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Editorial Supporting Reviews (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {editorialReviews.map((t, idx) => (
              <motion.div 
                key={idx}
                className="bg-olive/5 border border-olive/10 p-6 md:p-8 rounded-2xl md:rounded-[30px] flex flex-col justify-between hover:bg-olive/10 transition-colors duration-500 group h-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + (idx * 0.2) }}
              >
                <div>
                  <div className="flex gap-1 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-sage text-sage" />
                    ))}
                  </div>
                  <blockquote className="text-sm md:text-base font-light leading-relaxed mb-6 italic text-olive/90">
                    &quot;{t.quote}&quot;
                  </blockquote>
                </div>
                
                <div className="border-t border-olive/10 pt-4 mt-auto">
                  <div className="font-serif text-base mb-1">{t.name}</div>
                  <div className="text-xs font-light text-olive/50 flex justify-between items-center">
                    <span>{t.badge}</span>
                    <span className="italic">{t.scent}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile pagination dots */}
        <div className="flex md:hidden justify-center gap-2 mt-8">
          {cinematicReviews.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 bg-sage' : 'w-2 bg-olive/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
