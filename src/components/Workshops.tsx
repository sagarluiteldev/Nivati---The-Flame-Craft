"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default function Workshops() {
  return (
    <section className="py-24 bg-creme relative overflow-hidden" id="workshops">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sage/10 rounded-l-full -z-10 transform translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            className="relative h-[500px] w-full rounded-2xl overflow-hidden group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-olive/10 group-hover:bg-transparent transition-colors duration-500 z-10" style={{ transform: "translateZ(0)" }} />
            <img 
              src="/images/workshop_pouring.png" 
              alt="Hands pouring wax into a glass jar"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button className="w-20 h-20 bg-creme/90 backdrop-blur-sm rounded-full flex items-center justify-center text-olive hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-olive leading-tight">
              Master the Flame.
            </h2>
            <p className="text-lg text-olive/80 font-sans font-light leading-relaxed">
              Join our interactive online workshops and learn the art of candle making from the comfort of your home. From understanding scent notes and proper blending to mastering the perfect pour and wick setting.
            </p>
            
            <ul className="flex flex-col gap-4 mt-2 mb-6">
              {[
                "Live step-by-step guidance",
                "Understand scent throw and temperature",
                "Learn troubleshooting techniques",
                "Complete starter kit mailed to you"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-olive border-b border-olive/10 pb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <a 
                href="https://wa.me/9842003249?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20the%20online%20candle%20making%20workshops"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-olive text-creme rounded-full tracking-wide hover:bg-olive/90 transition-all hover:shadow-lg hover:-translate-y-1 inline-flex justify-center"
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
