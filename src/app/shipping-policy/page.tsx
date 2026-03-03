"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ShippingPolicyPage() {
  const router = useRouter();
  
  return (
    <main className="min-h-screen flex flex-col pt-24 bg-creme">
      <Navbar />
      
      <div className="grow flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center py-20">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-8 shadow-xl bg-olive/5 relative">
           <img 
             src="/images/hero_candle.png" 
             alt="Candle" 
             className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" 
             style={{ transform: "translateZ(0)" }}
           />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif text-olive mb-6">
          Sorry ! This page is still in Development
        </h1>
        
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-8 py-4 bg-olive text-creme rounded-full tracking-wide hover:bg-olive/90 transition-all hover:shadow-lg hover:-translate-y-1 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Click here to go back
        </button>
      </div>
      
      <Footer />
    </main>
  );
}
