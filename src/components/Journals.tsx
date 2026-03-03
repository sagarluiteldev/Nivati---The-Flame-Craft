"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Journals() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      badge: "Verified Maker",
      quote: "The beginner's kit completely changed my weekend routine. The instructions were flawless, and the scent fills my entire living room.",
      scent: "Oud & Bergamot"
    },
    {
      name: "Marcus T.",
      badge: "Verified Maker",
      quote: "I took the virtual masterclass and it was incredible. Learning the science behind scent throw made my own DIY candles perform like luxury brands.",
      scent: "Sandalwood & Rose"
    },
    {
      name: "Elena R.",
      badge: "Verified Buyer",
      quote: "The unboxing experience alone is worth it. Absolutely stunning packaging, zero plastic, and the candle burns so evenly.",
      scent: "Fig & Vetiver"
    }
  ];

  return (
    <section className="py-24 bg-olive text-creme dark:bg-transparent dark:text-olive transition-colors duration-700" id="journals">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 text-creme dark:text-olive transition-colors duration-700">Customer Journals</h2>
          <p className="font-sans font-light text-creme/70 dark:text-olive/70 max-w-xl mx-auto transition-colors duration-700">
            Stories from our community of makers and luxury candle enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              className="bg-creme/5 border border-creme/10 dark:bg-olive/5 dark:border-olive/10 p-8 rounded-2xl flex flex-col justify-between transition-colors duration-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sage text-sage" />
                  ))}
                </div>
                <blockquote className="text-lg font-light leading-relaxed mb-8 italic">
                  "{t.quote}"
                </blockquote>
              </div>
              
              <div className="border-t border-creme/10 dark:border-olive/10 pt-6 mt-auto transition-colors duration-700">
                <div className="font-serif text-lg mb-1">{t.name}</div>
                <div className="flex items-center justify-between text-sm font-light text-creme/60 dark:text-olive/60 transition-colors duration-700">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    {t.badge}
                  </span>
                  <span>{t.scent}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
