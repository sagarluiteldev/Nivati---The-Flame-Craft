"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon as ArrowRight } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Collections() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: custom * 0.07,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  const collections = [
    {
      title: "Signature Candles",
      description: "Best-selling scented candles for your sanctuary.",
      image: "/images/IMG_4084.jpg",
      href: "/shop?category=Signature Candles",
    },
    {
      title: "Shaped Candles",
      description: "Handcrafted roses, cakes & geometric art pieces.",
      image: "/images/IMG_4099.jpg",
      href: "/shop?category=Mould Candles",
    },
    {
      title: "Mini Candles",
      description: "Pocket-sized luxury for travel & gifting.",
      image: "/images/IMG_4101.jpg",
      href: "/shop?category=Mini Jar",
    },
    {
      title: "Large Candles",
      description: "Statement pillars that fill entire rooms.",
      image: "/images/IMG_4067.jpg",
      href: "/shop?category=Concrete Pots & More",
    },
    {
      title: "Raw Materials",
      description: "Premium wax, wicks, and oils for makers.",
      image: "/images/IMG_4187.PNG",
      href: "/shop?category=Candle Making Materials",
    },
    {
      title: "Concrete Jars",
      description: "Architectural designs in minimalist concrete.",
      image: "/images/IMG_4070.PNG",
      href: "/shop?category=Concrete Jar Candles",
    },
    {
      title: "The Beginner's Kit",
      description: "All-in-one box to start your candle journey.",
      image: "/images/IMG_4201.jpg",
      href: "/shop?category=Candle Making Kit",
    },
    {
      title: "Premium Collection",
      description: "Exquisite scents in our signature glass vessels.",
      image: "/images/IMG_4095.jpg",
      href: "/shop?category=Premium Jar Candles",
    },
    {
      title: "Gel & Soy Blends",
      description: "A unique fusion of clarity and creamy wax.",
      image: "/images/IMG_4133.jpg",
      href: "/shop?category=Gel&Soy Jar",
    },
  ];

  return (
    <section className="py-24 bg-creme transition-colors duration-700" id="shop">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-xl"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-black mb-4">Curated Collections</h2>
            <p className="text-black/80 font-sans font-normal text-base md:text-lg">
              Explore our range of hand-poured artisan candles and dedicated crafting supplies.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          >
            <Link 
              href="/shop"
              className="group flex items-center gap-2 text-black font-medium tracking-wide border-b border-black pb-1 hover:text-black/70 hover:border-black/70 transition-colors"
            >
              View All Collections
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {collections.map((col, idx) => (
            <motion.div 
              key={idx} 
              custom={idx % 3}
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              className="flex flex-col will-change-transform"
            >
              <Link 
                href={col.href}
                className="group flex flex-col focus:outline-none"
              >
                {/* Image Container */}
                <div className="relative aspect-4/5 w-full rounded-none overflow-hidden bg-black/5 mb-4 border border-black/10 shadow-xs transition-all duration-500 group-hover:shadow-lg group-hover:border-black/25">
                  <Image 
                    src={col.image} 
                    alt={col.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform-gpu transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Text below Image */}
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl md:text-2xl font-serif text-black group-hover:text-black/70 transition-colors">
                      {col.title}
                    </h3>
                    <ArrowRight className="w-4.5 h-4.5 text-black/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
                  </div>
                  <p className="text-black/75 font-sans font-normal text-sm md:text-base leading-relaxed">
                    {col.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
