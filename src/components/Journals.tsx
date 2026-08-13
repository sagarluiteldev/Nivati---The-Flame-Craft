"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon as Star } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const reviews = [
  {
    name: "Sarah Jenkins",
    badge: "Verified Maker",
    quote: "The beginner's kit completely changed my weekend routine. The instructions were flawless, and the scent fills my entire living room.",
    scent: "Oud & Bergamot",
    rating: 5,
  },
  {
    name: "Marcus T.",
    badge: "Verified Maker",
    quote: "I took the virtual masterclass and it was incredible. Learning the science behind scent throw made my own DIY candles perform like luxury brands.",
    scent: "Sandalwood & Rose",
    rating: 5,
  },
  {
    name: "Elena R.",
    badge: "Verified Buyer",
    quote: "The unboxing experience alone is worth it. Absolutely stunning packaging, zero plastic, and the candle burns so evenly.",
    scent: "Fig & Vetiver",
    rating: 5,
  },
  {
    name: "Chloe M.",
    badge: "Verified Buyer",
    quote: "The most beautiful candles I've ever owned. They feel more like art pieces than just home fragrance.",
    scent: "Lavender & Sage",
    rating: 5,
  },
  {
    name: "David L.",
    badge: "Verified Maker",
    quote: "The raw materials in the DIY kit are top tier. You can really feel the difference when pouring the pure soy wax.",
    scent: "Cedar & Vanilla",
    rating: 5,
  },
  {
    name: "Amara K.",
    badge: "Verified Buyer",
    quote: "Scent throw is 10/10. Even unlit, the room smells subtle and inviting. Highly recommended!",
    scent: "Amber & Botanical",
    rating: 5,
  }
];

export default function Journals() {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % totalPages);
  };

  const currentReviews = reviews.slice(index * itemsPerPage, index * itemsPerPage + itemsPerPage);

  return (
    <section className="py-16 md:py-28 bg-creme text-olive overflow-hidden" id="journals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-olive mb-3 md:mb-4">Customer Journals</h2>
          <p className="font-sans font-light text-olive/70 max-w-xl mx-auto text-sm md:text-base px-2">
            Stories and experiences from our community of makers and luxury candle enthusiasts.
          </p>
        </div>

        {/* Desktop Carousel Container with Side Arrows */}
        <div className="relative">
          {/* Desktop Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-olive/20 bg-white/90 text-olive hover:bg-olive hover:text-white items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
            aria-label="Previous reviews"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Cards Display Area */}
          <div className="overflow-hidden min-h-[260px] md:min-h-[280px] px-1 py-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index + (isMobile ? "-m" : "-d")}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 w-full"
              >
                {currentReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-olive border border-olive/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-xl shadow-olive/10 hover:border-sage/40 transition-all duration-300"
                  >
                    <div>
                      {/* Rating Stars & Badge */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-sage text-sage" />
                          ))}
                        </div>
                        <span className="text-[11px] sm:text-xs font-light text-creme/70 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                          {review.badge}
                        </span>
                      </div>

                      {/* Quote */}
                      <blockquote className="font-serif text-base sm:text-lg md:text-xl text-creme/95 leading-relaxed mb-6 sm:mb-8">
                        &quot;{review.quote}&quot;
                      </blockquote>
                    </div>

                    {/* Reviewer & Scent Tag */}
                    <div className="pt-4 sm:pt-6 border-t border-creme/15 flex items-center justify-between">
                      <div>
                        <div className="font-serif text-base sm:text-lg text-creme font-medium">{review.name}</div>
                      </div>
                      <span className="inline-block px-3 py-1 bg-creme/10 border border-creme/20 rounded-full text-xs font-sans text-creme/90">
                        {review.scent}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop Right Arrow Button */}
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-olive/20 bg-white/90 text-olive hover:bg-olive hover:text-white items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
            aria-label="Next reviews"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Controls & Page Indicator Dots */}
        <div className="flex items-center justify-between md:justify-center gap-4 mt-6 md:mt-10 max-w-xs mx-auto md:max-w-none">
          {/* Mobile Previous Button */}
          <button
            onClick={handlePrev}
            className="flex md:hidden w-10 h-10 rounded-full border border-olive/20 bg-white/90 text-olive active:bg-olive active:text-white items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === index ? "w-6 sm:w-8 h-2 bg-olive" : "w-2 h-2 bg-olive/20 hover:bg-olive/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Next Button */}
          <button
            onClick={handleNext}
            className="flex md:hidden w-10 h-10 rounded-full border border-olive/20 bg-white/90 text-olive active:bg-olive active:text-white items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
