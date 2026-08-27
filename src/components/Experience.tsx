"use client";

import { motion, Variants } from "framer-motion";
import { FireIcon as Flame, HeartIcon as Leaf, ArrowPathRoundedSquareIcon as Recycle } from "@heroicons/react/24/outline";

export default function Experience() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: { 
      opacity: 0, 
      y: 14,
    },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1],
      } 
    },
  };

  const features = [
    {
      number: "01",
      icon: Flame,
      title: "Hand-Poured",
      description: "100% natural soy wax and clean-burning cotton wicks crafted to perfection. Individually poured in our studio.",
    },
    {
      number: "02",
      icon: Leaf,
      title: "Curated Scents",
      description: "Phthalate-free fragrances inspired by nature. Our proprietary blends evoke memories and ground you in the present moment.",
    },
    {
      number: "03",
      icon: Recycle,
      title: "Sustainable",
      description: "Reusable glass jars and plastic-free packaging that honor the earth. We believe luxury shouldn't come at an environmental cost.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-creme relative overflow-hidden" id="experience">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-serif text-neutral-900 mb-6"
          >
            The Nivati Experience
          </motion.h2>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "4rem", opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-0.5 bg-olive mx-auto" 
          />
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              className="relative group p-8 md:p-10 rounded-none bg-mesh-grain border border-white/15 text-creme hover:border-white/35 shadow-xl shadow-black/10 transition-[border-color,box-shadow] duration-500 ease-out overflow-hidden flex flex-col justify-between transform-gpu will-change-transform backface-hidden"
            >
              <div>
                {/* Icon */}
                <div className="mb-6 text-creme relative z-10">
                  <feature.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300 ease-out" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-serif text-creme mb-4 relative z-10 font-normal">{feature.title}</h3>
                <p className="text-creme/90 font-sans font-light leading-relaxed relative z-10 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
