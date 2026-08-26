"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon as Star } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const reviews = [
  {
    name: "Shreya Shrestha",
    badge: "Verified Maker",
    quote: "The beginner's kit completely changed my weekend routine. The instructions were so easy to follow, and the scent fills my entire living space.",
    scent: "Vanilla & Tonka",
    rating: 5,
  },
  {
    name: "Sneha Gurung",
    badge: "Verified Buyer",
    quote: "The unboxing experience alone is worth it. Absolutely stunning packaging, eco-friendly, and the soy candle burns cleanly with zero soot.",
    scent: "Lavender & Sage",
    rating: 5,
  },
  {
    name: "Aayusha Karki",
    badge: "Verified Buyer",
    quote: "The most aesthetic candles I've ever owned. They feel like miniature sculptural art pieces on my table and smell divine even unlit.",
    scent: "Amber & Jasmine",
    rating: 5,
  },
  {
    name: "Prashanti Thapa",
    badge: "Workshop Maker",
    quote: "Attending the candle crafting workshop was such a mindful, calming experience. Learning scent notes made me appreciate hand-poured crafts so much more.",
    scent: "Rose & Sandalwood",
    rating: 5,
  },
  {
    name: "Rohan Maharjan",
    badge: "Verified Buyer",
    quote: "Ordered the concrete jar candle for our studio. The craftsmanship is solid, minimalist, and the subtle scent throw is top tier.",
    scent: "Cedar & Bergamot",
    rating: 5,
  },
  {
    name: "Anushka Sharma",
    badge: "Verified Buyer",
    quote: "Scent throw is 10/10! Gentle, soothing, and fills the room without being overpowering. Perfect for evening unwinding.",
    scent: "Fig & White Musk",
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
    <section className="py-20 md:py-32 min-h-[90vh] lg:min-h-screen flex flex-col justify-center bg-creme text-black overflow-hidden" id="journals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-black mb-3 md:mb-4">Customer Journals</h2>
          <p className="font-sans font-normal text-black/80 max-w-xl mx-auto text-sm md:text-base lg:text-lg px-2">
            Stories and experiences from our community of makers and luxury candle enthusiasts.
          </p>
        </div>

        {/* Desktop Carousel Container with Side Arrows */}
        <div className="relative">
          {/* Desktop Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-black/20 bg-white/95 text-black hover:bg-black hover:text-white items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
            aria-label="Previous reviews"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Cards Display Area */}
          <div className="overflow-hidden min-h-110 md:min-h-125 lg:min-h-135 px-1 py-1 flex items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index + (isMobile ? "-m" : "-d")}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full"
              >
                {currentReviews.map((review, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: idx % 2 === 0
                        ? "linear-gradient(to top right, #1d5200 0%, #5a6c37 100%)"
                        : "linear-gradient(to top left, #1d5200 0%, #5a6c37 100%)",
                    }}
                    className="min-h-110 sm:min-h-120 md:min-h-130 lg:min-h-137.5 border border-white/15 rounded-none p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between shadow-2xl shadow-black/15 hover:border-white/30 transition-all duration-300"
                  >
                    <div>
                      {/* Rating Stars & Badge */}
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex gap-1.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-creme text-creme" />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-creme/90 uppercase tracking-wider flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                          <span className="w-2 h-2 rounded-full bg-creme" />
                          {review.badge}
                        </span>
                      </div>

                      {/* Quote */}
                      <blockquote className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-creme leading-relaxed mb-6 sm:mb-8 font-normal">
                        &quot;{review.quote}&quot;
                      </blockquote>
                    </div>

                    {/* Reviewer & Scent Tag */}
                    <div className="pt-6 sm:pt-8 border-t border-creme/20 flex items-center justify-between">
                      <div>
                        <div className="font-serif text-lg sm:text-xl text-creme font-semibold">{review.name}</div>
                      </div>
                      <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-xs sm:text-sm font-sans text-creme font-medium">
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
            className="hidden md:flex absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-black/20 bg-white/95 text-black hover:bg-black hover:text-white items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
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
            className="flex md:hidden w-10 h-10 rounded-full border border-black/20 bg-white/95 text-black active:bg-black active:text-white items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-1">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="p-2 flex items-center justify-center cursor-pointer min-w-6 min-h-6"
              >
                <span
                  className={`transition-all duration-300 rounded-full block ${
                    idx === index ? "w-6 sm:w-8 h-2 bg-black" : "w-2 h-2 bg-black/20 hover:bg-black/40"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Mobile Next Button */}
          <button
            onClick={handleNext}
            className="flex md:hidden w-10 h-10 rounded-full border border-black/20 bg-white/95 text-black active:bg-black active:text-white items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
