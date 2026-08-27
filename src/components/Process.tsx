"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

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
      title: "Ethically Sourced",
      description: "Our raw materials are gathered with care, ensuring sustainability and high quality. We use 100% natural soy wax and phthalate-free oils.",
      image: "/images/process_sourced.png"
    },
    {
      title: "Precision Blending",
      description: "Every fragrance is meticulously tested for the perfect balance of cold and hot throw, making sure your space is always delightfully scented.",
      image: "/images/process_making_new.jpg"
    },
    {
      title: "The Nivati Finish",
      description: "Hand-poured, hand-labeled, and cured to perfection. Each candle is a testament to the artisan's dedication to the craft.",
      image: "/images/IMG_4078.jpg"
    }
  ];

  return (
    <section ref={containerRef} className="py-32 bg-creme relative overflow-hidden" id="story">
      {/* Abstract floating shapes linked to scroll */}
      <motion.div style={{ y: yParallax }} className="absolute -left-32 top-1/4 w-96 h-96 bg-olive/5 rounded-full blur-3xl pointer-events-none will-change-transform" />
      <motion.div style={{ y: yParallax }} className="absolute -right-32 bottom-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none will-change-transform" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-serif text-black mb-4"
          >
            The Maker&apos;s Process
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans font-normal text-black/80 max-w-xl mx-auto"
          >
            From raw earth to flickering flame. Discover how we bring intention into every jar.
          </motion.p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {steps.map((step, idx) => (
            <ProcessStep 
              key={idx} 
              step={step} 
              idx={idx} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProcessStepProps {
  step: {
    title: string;
    description: string;
    image: string;
  };
  idx: number;
}

function ProcessStep({ step, idx }: ProcessStepProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  
  // Local scroll progress for inner image parallax
  const { scrollYProgress: imageProgress } = useScroll({
    target: stepRef,
    offset: ["start end", "end start"]
  });

  // Fast early-trigger scroll progress for title letters
  const { scrollYProgress: titleProgress } = useScroll({
    target: stepRef,
    offset: ["start 92%", "start 40%"]
  });

  // Safe inner parallax translation bounded strictly inside the placeholder frame
  const imageY = useTransform(
    imageProgress, 
    [0, 1], 
    idx % 2 === 0 ? ["-7%", "7%"] : ["7%", "-7%"]
  );

  const totalChars = step.title.replace(/\s/g, "").length;
  let charCounter = 0;

  return (
    <div ref={stepRef} className={`flex items-center flex-col lg:flex-row gap-12 lg:gap-24 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
      <div className="w-full lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          className="relative w-full aspect-4/5 rounded-none overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-black/5 mix-blend-multiply z-10 pointer-events-none" style={{ transform: "translateZ(0)" }} />
          <motion.div 
            style={{ y: imageY }}
            className="relative w-full h-[120%] -top-[10%] left-0"
          >
            <Image 
              src={step.image} 
              alt={step.title}
              fill
              loading="lazy"
              quality={80}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <h3 className="text-3xl md:text-5xl font-serif text-black mb-6 flex flex-wrap perspective-1000">
          {step.title.split(" ").map((word: string, wordIdx: number) => (
            <span key={wordIdx} className="mr-3 overflow-hidden flex">
              {word.split("").map((char: string, charIdx: number) => {
                const index = charCounter++;
                return (
                  <AnimatedChar 
                    key={charIdx} 
                    char={char} 
                    index={index} 
                    totalChars={totalChars} 
                    scrollYProgress={titleProgress} 
                  />
                );
              })}
            </span>
          ))}
        </h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-black/85 font-sans font-normal leading-relaxed"
        >
          {step.description}
        </motion.p>
      </div>
    </div>
  );
}

function AnimatedChar({ char, index, totalChars, scrollYProgress }: { char: string, index: number, totalChars: number, scrollYProgress: MotionValue<number> }) {
  // Fast, early character reveal that finishes well before user scrolls past
  const stepSize = 0.55 / totalChars;
  const start = index * stepSize;
  const end = Math.min(start + 0.35, 1);
  
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [24, 0]);
  const rotateX = useTransform(scrollYProgress, [start, end], [-60, 0]);

  return (
    <motion.span 
      style={{ opacity, y, rotateX, transformStyle: "preserve-3d" }}
      className="inline-block origin-bottom"
    >
      {char}
    </motion.span>
  );
}
