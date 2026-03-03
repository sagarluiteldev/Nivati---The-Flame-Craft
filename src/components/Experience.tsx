"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, Recycle } from "lucide-react";

export default function Experience() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const features = [
    {
      icon: Flame,
      title: "Hand-Poured",
      description: "100% natural soy wax and clean-burning cotton wicks crafted to perfection.",
    },
    {
      icon: Leaf,
      title: "Curated Scents",
      description: "Phthalate-free fragrances inspired by nature for a true sensory experience.",
    },
    {
      icon: Recycle,
      title: "Sustainable",
      description: "Reusable glass jars and plastic-free packaging that honor the earth.",
    },
  ];

  return (
    <section className="py-24 bg-creme border-y border-olive/10" id="experience">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-olive mb-4">The Nivati Experience</h2>
          <div className="w-16 h-0.5 bg-sage mx-auto" />
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className="group flex flex-col items-center text-center p-8 rounded-2xl border border-olive/10 hover:border-olive/20 hover:bg-olive/5 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-full bg-olive/5 flex items-center justify-center mb-6 group-hover:bg-olive/10 transition-colors">
                <feature.icon className="w-8 h-8 text-olive" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-olive mb-3">{feature.title}</h3>
              <p className="text-olive/70 font-sans font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
