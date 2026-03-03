"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Global subtle parallax for the background or floating bits
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const steps = [
    {
      number: "01",
      title: "Ethically Sourced",
      description: "Our raw materials are gathered with care, ensuring sustainability and high quality. We use 100% natural soy wax and phthalate-free oils.",
      image: "/images/process_sourced.png"
    },
    {
      number: "02",
      title: "Precision Blending",
      description: "Every fragrance is meticulously tested for the perfect balance of cold and hot throw, making sure your space is always delightfully scented.",
      image: "/images/process_blending.png"
    },
    {
      number: "03",
      title: "The Nivati Finish",
      description: "Hand-poured, hand-labeled, and cured to perfection. Each candle is a testament to the artisan's dedication to the craft.",
      image: "/images/process_finish.png"
    }
  ];

  return (
    <section ref={containerRef} className="py-32 bg-creme relative overflow-hidden" id="story">
      {/* Abstract floating shapes linked to scroll */}
      <motion.div style={{ y: yParallax }} className="absolute -left-32 top-1/4 w-96 h-96 bg-olive/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div style={{ y: yParallax }} className="absolute -right-32 bottom-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-serif text-olive mb-4"
          >
            The Maker's Process
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans font-light text-olive/70 max-w-xl mx-auto"
          >
            From raw earth to flickering flame. Discover how we bring intention into every jar.
          </motion.p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center flex-col lg:flex-row gap-12 lg:gap-24 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="w-full lg:w-1/2">
                <motion.div 
                  className="relative w-full aspect-4/5 rounded-2xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-sage/10 mix-blend-multiply z-10" style={{ transform: "translateZ(0)" }} />
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <motion.span 
                  initial={{ opacity: 0, x: idx % 2 === 1 ? -20 : 20 }}
                  whileInView={{ opacity: 0.3, x: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8 }}
                  className="text-sage text-6xl md:text-8xl font-serif leading-none mb-4 tracking-tighter"
                >
                  {step.number}
                </motion.span>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl md:text-5xl font-serif text-olive mb-6"
                >
                  {step.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl text-olive/80 font-sans font-light leading-relaxed"
                >
                  {step.description}
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
