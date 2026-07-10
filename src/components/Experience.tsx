"use client";

import { motion, Variants } from "framer-motion";
import { FireIcon as Flame, HeartIcon as Leaf, ArrowPathRoundedSquareIcon as Recycle } from "@heroicons/react/24/outline";

export default function Experience() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } 
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-serif text-olive mb-6"
          >
            The Nivati Experience
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-sage mx-auto" 
          />
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              whileHover={{ y: -8 }}
              className="relative group p-8 md:p-10 rounded-2xl md:rounded-3xl bg-linear-to-br from-olive/5 to-transparent border border-olive/10 hover:border-olive/20 hover:shadow-2xl hover:shadow-olive/5 transition-all duration-500 overflow-hidden"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-full bg-white/50 backdrop-blur-sm border border-olive/10 flex items-center justify-center mb-8 text-sage group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-500">
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-serif text-olive mb-4 relative z-10">{feature.title}</h3>
              <p className="text-olive/70 font-sans font-light leading-relaxed relative z-10">
                {feature.description}
              </p>
              
              {/* Subtle bottom glow line on hover */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-sage to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
