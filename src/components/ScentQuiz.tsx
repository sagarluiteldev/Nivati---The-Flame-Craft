"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { XMarkIcon as X, ArrowRightIcon as ArrowRight } from "@heroicons/react/24/outline";
import { products } from "@/lib/data";
import Link from "next/link";

interface ScentQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: 1,
    title: "What's your ideal evening?",
    options: [
      { text: "A quiet dinner with wine", attribute: "berry-wine" },
      { text: "Reading by a warm fire", attribute: "rose-bloom-mould" },
      { text: "Early to bed, early to rise", attribute: "iced-matcha-gel-soy" },
      { text: "A late night walk", attribute: "concrete-moon" },
    ]
  },
  {
    id: 2,
    title: "Pick a texture",
    options: [
      { text: "Crushed Velvet", attribute: "rose-bloom-mould" },
      { text: "Linen", attribute: "concrete-moon" },
      { text: "Smooth Ceramic", attribute: "iced-matcha-gel-soy" },
      { text: "Raw Wood", attribute: "berry-wine" },
    ]
  },
  {
    id: 3,
    title: "Favorite environment",
    options: [
      { text: "Mediterranean Coast", attribute: "berry-wine" },
      { text: "Deep Forest", attribute: "concrete-moon" },
      { text: "Minimalist Studio", attribute: "iced-matcha-gel-soy" },
      { text: "Rose Garden", attribute: "rose-bloom-mould" },
    ]
  }
];

export default function ScentQuiz({ isOpen, onClose }: ScentQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  const handleAnswer = (attribute: string) => {
    const newAnswers = [...answers, attribute];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      // Calculate result
      const counts = newAnswers.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      setResultId(winner);
      setCurrentStep(questions.length); // Move to result screen
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultId(null);
  };

  const closeAndReset = () => {
    onClose();
    setTimeout(handleReset, 500); // Reset after exit animation
  };

  const resultProduct = resultId ? products.find(p => p.id === resultId) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-creme  flex flex-col pt-32 px-6 overflow-y-auto"
        >
          <button 
            onClick={closeAndReset}
            className="absolute top-8 right-6 md:right-12 p-2 text-olive  hover:bg-olive/10  rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center pb-24">
            <AnimatePresence mode="wait">
              {currentStep < questions.length ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-olive/50  font-serif mb-4">Step {currentStep + 1} of {questions.length}</span>
                  <h2 className="text-3xl md:text-5xl font-serif text-olive  mb-12 text-center">
                    {questions[currentStep].title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {questions[currentStep].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option.attribute)}
                        className="py-6 px-8 border border-olive/20  rounded-2xl text-lg text-olive  hover:bg-olive hover:text-creme   transition-all text-center"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <h2 className="text-xl text-olive/60  uppercase tracking-widest mb-4">Your Signature Scent is</h2>
                  <h3 className="text-5xl md:text-7xl font-serif text-olive  mb-12">{resultProduct?.title}</h3>
                  
                  {resultProduct && (
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                      <div className="w-64 h-64 rounded-full overflow-hidden bg-olive/5 relative">
                         <img src={resultProduct.img} alt={resultProduct.title} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply scale-110" style={{ transform: "translateZ(0) scale(1.1)" }} />
                      </div>
                      <div className="text-left max-w-sm">
                         <p className="text-olive/80  text-lg mb-6">{resultProduct.description}</p>
                         <Link 
                            href={`/shop/${resultProduct.id}`}
                            onClick={closeAndReset}
                            className="inline-flex items-center gap-2 bg-olive text-creme px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(40,54,24,0.3)] active:scale-95"
                         >
                            Shop this Scent <ArrowRight className="w-5 h-5" />
                         </Link>
                      </div>
                    </div>
                  )}
                  
                  <button onClick={handleReset} className="text-olive/50 hover:text-olive   underline underline-offset-4">
                    Take Quiz Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
