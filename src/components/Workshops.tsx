"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Workshops() {
  return (
    <section className="py-24 bg-creme relative overflow-hidden" id="workshops">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sage/10 rounded-none -z-10 transform translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            className="relative h-125 w-full rounded-none overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <Image 
              src="/images/master_the_flame.jpg" 
              alt="Artisan pouring lavender candle wax during a workshop"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight">
              Master the Flame.
            </h2>
            <p className="text-lg text-black/85 font-sans font-normal leading-relaxed">
              Join our interactive online workshops and learn the art of candle making from the comfort of your home. From understanding scent notes and proper blending to mastering the perfect pour and wick setting.
            </p>
            
            <ul className="flex flex-col gap-4 mt-2 mb-6">
              {[
                "Live step-by-step guidance",
                "Understand scent throw and temperature",
                "Learn troubleshooting techniques",
                "Complete starter kit mailed to you"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-black border-b border-black/10 pb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span className="font-normal">{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <a 
                href="https://wa.me/9842003249?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20the%20online%20candle%20making%20workshops"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 btn-mesh text-creme rounded-lg tracking-wide transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.95] inline-flex justify-center shadow-lg"
              >
                Book a Virtual Seat
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
