"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Collections() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const collections = [
    {
      title: "Signature Jars",
      description: "Best-selling scented candles for your sanctuary.",
      image: "/images/IMG_4084.jpg",
      span: "md:col-span-2 lg:col-span-2 row-span-2",
    },
    {
      title: "Shaped Candles",
      description: "Handcrafted roses, cakes & geometric art pieces.",
      image: "/images/IMG_4099.jpg",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "Mini Candles",
      description: "Pocket-sized luxury for travel & gifting.",
      image: "/images/IMG_4101.JPG",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "Large Candles",
      description: "Statement pillars that fill entire rooms.",
      image: "/images/IMG_4067.jpg",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "Raw Materials",
      description: "Premium wax, wicks, and oils for makers.",
      image: "/images/IMG_4187.png",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "The Beginner's Kit",
      description: "All-in-one box to start your candle journey.",
      image: "/images/IMG_4201.jpg",
      span: "md:col-span-2 lg:col-span-2 row-span-2",
    },
  ];

  return (
    <section className="py-24 bg-creme transition-colors duration-700" id="shop">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-serif text-olive mb-4">Curated Collections</h2>
            <p className="text-olive/70 font-sans font-light text-lg">
              Explore our range of hand-poured artisan candles and dedicated crafting supplies.
            </p>
          </div>
          <Link 
            href="/shop"
            className="group flex items-center gap-2 text-olive font-medium tracking-wide border-b border-olive pb-1 hover:text-sage hover:border-sage transition-colors"
          >
            View All 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {collections.map((col, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${col.span}`}
            >
              <div className="absolute inset-0 bg-olive/20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" style={{ transform: "translateZ(0)" }} />
              <img 
                src={col.image} 
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-10 bg-linear-to-t from-olive/90 via-olive/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-serif text-creme mb-2">{col.title}</h3>
                <p className="text-creme/80 font-sans font-light opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {col.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
