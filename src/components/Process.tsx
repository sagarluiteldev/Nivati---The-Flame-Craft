"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Global subtle parallax for the background or floating bits
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Subtle image parallax maps (global so they move continuously across the whole section)
  const imageYEven = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageYOdd = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

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
      image: "/images/process_making_new.jpg"
    },
    {
      number: "03",
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
            className="text-3xl md:text-5xl font-serif text-olive mb-4"
          >
            The Maker&apos;s Process
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans font-light text-olive/70 max-w-xl mx-auto"
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
              imageYEven={imageYEven} 
              imageYOdd={imageYOdd} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProcessStepProps {
  step: {
    number: string;
    title: string;
    description: string;
    image: string;
  };
  idx: number;
  imageYEven: MotionValue<string>;
  imageYOdd: MotionValue<string>;
}

function ProcessStep({ step, idx, imageYEven, imageYOdd }: ProcessStepProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  
  // Local scroll progress for this specific step
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start 95%", "center 50%"]
  });

  const totalChars = step.title.replace(/\s/g, "").length;
  let charCounter = 0;

  return (
    <div ref={stepRef} className={`flex items-center flex-col lg:flex-row gap-12 lg:gap-24 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
      <div className="w-full lg:w-1/2">
        <motion.div 
          className="relative w-full aspect-4/5 rounded-2xl overflow-hidden shadow-xl"
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1]),
            scale: useTransform(scrollYProgress, [0, 0.4], [0.95, 1])
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-sage/10 mix-blend-multiply z-10 pointer-events-none" style={{ transform: "translateZ(0)" }} />
          <motion.img 
            src={step.image} 
            alt={step.title}
            style={{ y: idx % 2 === 0 ? imageYEven : imageYOdd }}
            className="absolute w-full h-[130%] -top-[15%] left-0 object-cover"
          />
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <motion.span 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.4], [0, 0.3]),
            x: useTransform(scrollYProgress, [0, 0.4], [idx % 2 === 1 ? -40 : 40, 0])
          }}
          className="text-sage text-6xl md:text-8xl font-serif leading-none mb-4 tracking-tighter"
        >
          {step.number}
        </motion.span>
        
        <h3 className="text-3xl md:text-5xl font-serif text-olive mb-6 flex flex-wrap perspective-1000">
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
                    scrollYProgress={scrollYProgress} 
                  />
                );
              })}
            </span>
          ))}
        </h3>
        
        <motion.p 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.3, 0.8], [0, 1]),
            y: useTransform(scrollYProgress, [0.3, 0.8], [20, 0])
          }}
          className="text-lg md:text-xl text-olive/80 font-sans font-light leading-relaxed"
        >
          {step.description}
        </motion.p>
      </div>
    </div>
  );
}

function AnimatedChar({ char, index, totalChars, scrollYProgress }: { char: string, index: number, totalChars: number, scrollYProgress: MotionValue<number> }) {
  // Stagger the start times over the first 60% of the scroll animation
  const stepSize = 0.6 / totalChars;
  const start = index * stepSize;
  const end = start + 0.4; // 40% duration for each character
  
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);
  const rotateX = useTransform(scrollYProgress, [start, end], [-90, 0]);

  return (
    <motion.span 
      style={{ opacity, y, rotateX, transformStyle: "preserve-3d" }}
      className="inline-block origin-bottom"
    >
      {char}
    </motion.span>
  );
}
