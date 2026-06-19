"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon as X, 
  ArrowRightIcon as ArrowRight, 
  SparklesIcon as Sparkles, 
  ShoppingBagIcon as ShoppingBag, 
  ArrowPathIcon as ArrowPath 
} from "@heroicons/react/24/outline";
import { products, Product } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

interface ScentQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "niva" | "user";
  text: string;
  options?: { text: string; value: string }[];
  field?: "mood" | "notes" | "room";
}

const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    }
  }
};

// Sommelier Prompts Setup (Defined outside component to prevent render dependency cycles)
const askMoodMessage = (): ChatMessage => ({
  id: "q-mood",
  sender: "niva",
  text: "Hello! I am Niva, Nivati's AI Scent Sommelier. Tell me, what kind of vibe or mood are you looking to bring into your space today?",
  options: [
    { text: "🕯️ Cozy, warm, comforting evening", value: "cozy" },
    { text: "🌿 Fresh, grounding, earthy forest", value: "earthy" },
    { text: "🍊 Energetic, bright, citrusy lift", value: "fresh" },
    { text: "🌸 Romantic, elegant, floral sanctuary", value: "floral" }
  ],
  field: "mood"
});

const askNotesMessage = (moodVal: string): ChatMessage => {
  let vibeDesc = "";
  if (moodVal === "cozy") vibeDesc = "warm, comforting evening";
  if (moodVal === "earthy") vibeDesc = "fresh, grounding forest vibe";
  if (moodVal === "fresh") vibeDesc = "bright, citrusy energy";
  if (moodVal === "floral") vibeDesc = "romantic floral sanctuary";

  return {
    id: "q-notes",
    sender: "niva",
    text: `Ah, a ${vibeDesc} sounds absolutely wonderful. Next, what kind of scent profiles draw you in the most?`,
    options: [
      { text: "🪵 Woody & Earthy notes (Cedarwood, Patchouli, Pine)", value: "woody" },
      { text: "🍯 Sweet & Warm notes (Vanilla, Honey, Cream)", value: "sweet" },
      { text: "🌱 Fresh & Crisp notes (Green Tea, Mint, Bergamot)", value: "fresh-notes" },
      { text: "🌷 Soft & Floral notes (Rose, Lily, Lavender)", value: "floral-notes" }
    ],
    field: "notes"
  };
};

const askRoomMessage = (): ChatMessage => ({
  id: "q-room",
  sender: "niva",
  text: "Lastly, where will this candle live? Tell me about the energy of the room you have in mind.",
  options: [
    { text: "🛌 Bedroom (Relaxing, intimate, calming)", value: "bedroom" },
    { text: "🛋️ Living Room (Ambient, warm, welcoming)", value: "living" },
    { text: "💻 Workspace (Alert, focused, clean)", value: "workspace" },
    { text: "🛁 Bathroom / Spa (Purifying, fresh, tranquil)", value: "bathroom" }
  ],
  field: "room"
});

export default function ScentQuiz({ isOpen, onClose }: ScentQuizProps) {
  const { addToCart } = useAppContext();

  // Selections
  const [selections, setSelections] = useState({
    mood: "",
    notes: "",
    room: "",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  
  // Results
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [primaryProduct, setPrimaryProduct] = useState<Product | null>(null);
  const [cartSuccess, setCartSuccess] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Ambient glows mapping
  const ambient = getAmbientStyles(selections.mood);

  // Reset/Restart Callback
  const handleReset = useCallback(() => {
    setSelections({ mood: "", notes: "", room: "" });
    setMatchingProducts([]);
    setPrimaryProduct(null);
    setIsAnalyzing(false);
    setCartSuccess(false);
    setIsTyping(true);
    
    const initialTimer = setTimeout(() => {
      setMessages([askMoodMessage()]);
      setIsTyping(false);
    }, 1000);
    return () => clearTimeout(initialTimer);
  }, []);

  // Start chat on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleReset();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleReset]);

  const getMatches = (mood: string, notes: string, room: string): Product[] => {
    const scored = products.map(product => {
      let score = 0;
      const textToSearch = [
        product.title,
        product.description,
        product.scentNotes?.top,
        product.scentNotes?.mid,
        product.scentNotes?.base,
        ...(Array.isArray(product.category) ? product.category : [product.category])
      ].join(" ").toLowerCase();

      // Mood match
      if (mood === "cozy") {
        if (textToSearch.includes("vanilla") || textToSearch.includes("honey") || textToSearch.includes("warm") || textToSearch.includes("cozy") || textToSearch.includes("sweet")) score += 3;
      } else if (mood === "earthy") {
        if (textToSearch.includes("wood") || textToSearch.includes("cedar") || textToSearch.includes("patchouli") || textToSearch.includes("earthy") || textToSearch.includes("forest") || textToSearch.includes("musk")) score += 3;
      } else if (mood === "fresh") {
        if (textToSearch.includes("citrus") || textToSearch.includes("matcha") || textToSearch.includes("mint") || textToSearch.includes("fresh") || textToSearch.includes("green") || textToSearch.includes("fruit")) score += 3;
      } else if (mood === "floral") {
        if (textToSearch.includes("rose") || textToSearch.includes("floral") || textToSearch.includes("lily") || textToSearch.includes("jasmine") || textToSearch.includes("bloom")) score += 3;
      }

      // Scent Profile match
      if (notes === "woody") {
        if (textToSearch.includes("cedar") || textToSearch.includes("wood") || textToSearch.includes("patchouli") || textToSearch.includes("pine") || textToSearch.includes("sandalwood")) score += 4;
      } else if (notes === "sweet") {
        if (textToSearch.includes("vanilla") || textToSearch.includes("honey") || textToSearch.includes("sugar") || textToSearch.includes("caramel") || textToSearch.includes("cream")) score += 4;
      } else if (notes === "fresh-notes") {
        if (textToSearch.includes("citrus") || textToSearch.includes("mint") || textToSearch.includes("tea") || textToSearch.includes("matcha") || textToSearch.includes("lemongrass") || textToSearch.includes("bergamot")) score += 4;
      } else if (notes === "floral-notes") {
        if (textToSearch.includes("rose") || textToSearch.includes("jasmine") || textToSearch.includes("lavender") || textToSearch.includes("bloom") || textToSearch.includes("honeysuckle")) score += 4;
      }

      // Room match
      if (room === "bedroom") {
        if (textToSearch.includes("relax") || textToSearch.includes("calm") || textToSearch.includes("soothing") || textToSearch.includes("vanilla") || textToSearch.includes("lavender")) score += 2;
      } else if (room === "living") {
        if (textToSearch.includes("warm") || textToSearch.includes("ambient") || textToSearch.includes("cozy") || textToSearch.includes("welcome")) score += 2;
      } else if (room === "workspace") {
        if (textToSearch.includes("focus") || textToSearch.includes("clear") || textToSearch.includes("clean") || textToSearch.includes("matcha") || textToSearch.includes("mint") || textToSearch.includes("citrus")) score += 2;
      } else if (room === "bathroom") {
        if (textToSearch.includes("fresh") || textToSearch.includes("purifying") || textToSearch.includes("spa") || textToSearch.includes("clean") || textToSearch.includes("citrus")) score += 2;
      }

      return { product, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  };

  const triggerAnalysis = (finalSelections: typeof selections) => {
    setIsAnalyzing(true);
    setAnalysisText("Connecting with scent library...");
    
    // Cycle analysis steps
    const step1 = setTimeout(() => setAnalysisText("Analyzing botanical scent notes..."), 900);
    const step2 = setTimeout(() => setAnalysisText("Synthesizing personal recommendation..."), 1800);
    
    const step3 = setTimeout(() => {
      // Perform matching
      const matches = getMatches(finalSelections.mood, finalSelections.notes, finalSelections.room);
      setMatchingProducts(matches);
      if (matches.length > 0) {
        setPrimaryProduct(matches[0]);
      }
      setIsAnalyzing(false);
    }, 2700);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleSelectOption = (field: "mood" | "notes" | "room", value: string, text: string) => {
    // 1. Add user message
    const updatedMessages = [
      ...messages.map(m => m.field === field ? { ...m, options: undefined } : m), // Remove options from previous question
      { id: `u-${field}`, sender: "user", text } as ChatMessage
    ];
    setMessages(updatedMessages);

    // 2. Update selections
    const newSelections = { ...selections, [field]: value };
    setSelections(newSelections);

    // 3. Queue next step
    setIsTyping(true);
    
    const replyTimer = setTimeout(() => {
      setIsTyping(false);
      if (field === "mood") {
        setMessages(prev => [...prev, askNotesMessage(value)]);
      } else if (field === "notes") {
        setMessages(prev => [...prev, askRoomMessage()]);
      } else if (field === "room") {
        triggerAnalysis(newSelections);
      }
    }, 1200);

    return () => clearTimeout(replyTimer);
  };

  const getRationale = (product: Product) => {
    const top = product.scentNotes.top !== "Unscented" ? product.scentNotes.top.split(',')[0].trim() : "";
    const mid = product.scentNotes.mid !== "Unscented" ? product.scentNotes.mid.split(',')[0].trim() : "";
    const base = product.scentNotes.base !== "Unscented" ? product.scentNotes.base.split(',')[0].trim() : "";
    const noteList = [top, mid, base].filter(Boolean).join(", ").toLowerCase();

    let vibe = "";
    if (selections.mood === "cozy") vibe = "warm comforting aura";
    if (selections.mood === "earthy") vibe = "calming grounded forest presence";
    if (selections.mood === "fresh") vibe = "clean, refreshing, and bright energy";
    if (selections.mood === "floral") vibe = "romantic floral sanctuary";

    let roomName = "";
    if (selections.room === "bedroom") roomName = "relaxing bedroom sanctuary";
    if (selections.room === "living") roomName = "warm and social living room";
    if (selections.room === "workspace") roomName = "focused workspace";
    if (selections.room === "bathroom") roomName = "purifying, spa-like bathroom";

    return `For your ${roomName}, I highly suggest ${product.title}. Featuring beautiful notes of ${noteList || "custom blends"}, it radiates a ${vibe} that aligns perfectly with your preferences.`;
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.img,
    });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-zinc-950/95 backdrop-blur-2xl flex flex-col text-creme overflow-y-auto"
        >
          {/* Morphing Ambient Background Glows */}
          <div 
            className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full blur-[130px] -z-10 transition-all duration-1000" 
            style={{ backgroundColor: ambient.bg1 }} 
          />
          <div 
            className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[130px] -z-10 transition-all duration-1000" 
            style={{ backgroundColor: ambient.bg2 }} 
          />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-6 md:right-12 p-2.5 text-creme/60 hover:text-creme hover:bg-white/10 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Close Sommelier"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Core container */}
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col pt-24 pb-12 px-6">
            
            {/* Header Title */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-olive/30 border border-olive/20 rounded-full text-xs font-medium tracking-wider text-sage uppercase">
                <Sparkles className="w-3.5 h-3.5" /> AI Scent Sommelier
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-creme mt-3">Find Your Vibe</h2>
            </div>

            <AnimatePresence mode="wait">
              {/* Chat View */}
              {!isAnalyzing && !primaryProduct && (
                <motion.div 
                  key="chat-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full"
                >
                  <div className="space-y-6 overflow-y-auto pr-2 py-4 max-h-[50vh] scrollbar-hide">
                    {messages.map((msg, index) => (
                      <div 
                        key={msg.id || index}
                        className={`flex gap-4 items-start ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {/* Avatar */}
                        {msg.sender === "niva" && (
                          <div className="w-9 h-9 rounded-full bg-olive/30 border border-olive/20 flex items-center justify-center text-sage shrink-0">
                            <Sparkles className="w-4.5 h-4.5" />
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`p-4 md:p-5 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-olive text-creme rounded-tr-none"
                            : "bg-white/5 border border-white/10 text-creme/90 rounded-tl-none"
                        }`}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Typing State */}
                    {isTyping && (
                      <div className="flex gap-4 items-start">
                        <div className="w-9 h-9 rounded-full bg-olive/30 border border-olive/20 flex items-center justify-center text-sage shrink-0 animate-pulse">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <motion.span variants={dotVariants} initial="initial" animate="animate" className="w-1.5 h-1.5 rounded-full bg-creme/50" />
                          <motion.span variants={dotVariants} initial="initial" animate="animate" className="w-1.5 h-1.5 rounded-full bg-creme/50 [animation-delay:0.2s]" />
                          <motion.span variants={dotVariants} initial="initial" animate="animate" className="w-1.5 h-1.5 rounded-full bg-creme/50 [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Options Selector panel */}
                  <div className="mt-8">
                    {messages.length > 0 && messages[messages.length - 1].options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {messages[messages.length - 1].options?.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const lastMsg = messages[messages.length - 1];
                              if (lastMsg.field) {
                                handleSelectOption(lastMsg.field, option.value, option.text);
                              }
                            }}
                            className="py-4 px-6 bg-white/5 border border-white/10 hover:border-olive hover:bg-olive text-creme hover:text-creme rounded-xl text-sm md:text-base tracking-wide transition-all cursor-pointer text-left flex items-center justify-between"
                          >
                            <span>{option.text}</span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* AI Analysis Overlay */}
              {isAnalyzing && (
                <motion.div
                  key="analyzing-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12"
                >
                  <div className="relative w-32 h-32 mb-8">
                    {/* Multi-layered concentric rings */}
                    <div className="absolute inset-0 border border-sage/20 rounded-full animate-ping [animation-duration:2.5s]" />
                    <div className="absolute inset-4 border border-olive/30 rounded-full animate-ping [animation-duration:1.8s]" />
                    <div className="absolute inset-2 border-2 border-dashed border-olive/40 rounded-full animate-spin [animation-duration:8s]" />
                    <div className="absolute inset-6 border border-creme/25 rounded-full animate-spin [animation-duration:4s] [animation-direction:reverse]" />
                    <div className="absolute inset-8 bg-olive/20 rounded-full flex items-center justify-center text-sage">
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-creme mb-2 uppercase tracking-widest animate-pulse">Analyzing Scent DNA</h3>
                  <p className="text-sm text-creme/50 font-light tracking-wide h-6">{analysisText}</p>
                </motion.div>
              )}

              {/* Recommendation Screen */}
              {!isAnalyzing && primaryProduct && (
                <motion.div
                  key="result-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    
                    {/* Primary suggestions info */}
                    <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-olive/10 rounded-full blur-[80px] -z-10" />
                      
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <span className="px-3.5 py-1 bg-olive text-creme text-xs font-semibold rounded-full uppercase tracking-wider">
                            Niva&apos;s Choice
                          </span>
                          <span className="text-creme/50 text-sm font-sans tracking-wide">
                            Rs {primaryProduct.price}
                          </span>
                        </div>

                        <h3 className="text-3xl md:text-5xl font-serif text-creme mb-6 leading-tight">
                          {primaryProduct.title}
                        </h3>

                        {/* Image + Description grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-6">
                          <div className="sm:col-span-5 aspect-square rounded-2xl overflow-hidden bg-olive/5 relative">
                            <Image 
                              src={primaryProduct.img} 
                              alt={primaryProduct.title} 
                              fill
                              sizes="300px"
                              className="object-cover mix-blend-lighten"
                            />
                          </div>
                          <div className="sm:col-span-7 space-y-4">
                            <p className="text-creme/80 text-sm md:text-base leading-relaxed font-light">
                              {primaryProduct.description}
                            </p>
                            
                            {/* Notes display */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {primaryProduct.scentNotes.top !== "Unscented" && (
                                <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-creme/60">
                                  Top: {primaryProduct.scentNotes.top.split(',')[0]}
                                </span>
                              )}
                              {primaryProduct.scentNotes.mid !== "Unscented" && (
                                <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-creme/60">
                                  Mid: {primaryProduct.scentNotes.mid.split(',')[0]}
                                </span>
                              )}
                              {primaryProduct.scentNotes.base !== "Unscented" && (
                                <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-creme/60">
                                  Base: {primaryProduct.scentNotes.base.split(',')[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Rationale Text Box */}
                      <div className="mt-4 p-4 md:p-5 bg-olive/20 border border-olive/35 rounded-2xl flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-olive/30 border border-olive/20 flex items-center justify-center text-sage shrink-0">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                        <p className="text-xs md:text-sm text-creme/90 leading-relaxed italic font-light font-sans">
                          &ldquo;{getRationale(primaryProduct)}&rdquo;
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                          onClick={() => handleAddToCart(primaryProduct)}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-creme text-zinc-950 px-6 py-4 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg select-none cursor-pointer"
                        >
                          <ShoppingBag className="w-5 h-5" /> 
                          {cartSuccess ? "Added to Cart!" : "Add to Cart"}
                        </button>
                        <Link 
                          href={`/shop/${primaryProduct.id}`}
                          onClick={onClose}
                          className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white text-creme px-6 py-4 rounded-full transition-all hover:scale-105 active:scale-95 select-none text-center"
                        >
                          Shop Product <ArrowRight className="w-4.5 h-4.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Alternatives Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      <h4 className="text-sm font-sans uppercase tracking-[0.2em] text-creme/50 font-semibold px-1">
                        Alternative Matches
                      </h4>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {matchingProducts.slice(1, 3).map((item, idx) => (
                          <div 
                            key={item.id}
                            onClick={() => {
                              // Swap alternative with primary suggestion
                              const newMatches = [...matchingProducts];
                              const clickedIndex = idx + 1;
                              const currentPrimary = newMatches[0];
                              newMatches[0] = newMatches[clickedIndex];
                              newMatches[clickedIndex] = currentPrimary;
                              setMatchingProducts(newMatches);
                              setPrimaryProduct(newMatches[0]);
                            }}
                            className="bg-white/5 border border-white/10 hover:border-olive/50 rounded-2xl p-4 flex gap-4 items-center transition-all hover:-translate-y-1 cursor-pointer select-none group"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-olive/5 relative shrink-0">
                              <Image 
                                src={item.img} 
                                alt={item.title} 
                                fill
                                sizes="100px"
                                className="object-cover mix-blend-lighten"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif text-base text-creme truncate group-hover:text-sage transition-colors">
                                {item.title}
                              </h5>
                              <p className="text-creme/50 text-xs mt-1 font-sans">
                                Rs {item.price}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] text-sage mt-2 font-medium">
                                <ArrowPath className="w-3 h-3" /> Swap Match
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Restart Quiz button */}
                      <button 
                        onClick={handleReset} 
                        className="w-full py-4 mt-auto border border-white/5 hover:bg-white/5 rounded-2xl text-xs md:text-sm font-sans tracking-widest uppercase text-creme/40 hover:text-creme transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowPath className="w-4 h-4" /> Start Over
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper to resolve dynamic ambient radial background styles based on selections
function getAmbientStyles(mood: string | null) {
  switch (mood) {
    case "cozy":
      return {
        bg1: "rgba(217, 119, 6, 0.15)", // amber-600
        bg2: "rgba(245, 158, 11, 0.08)"  // amber-500
      };
    case "earthy":
      return {
        bg1: "rgba(4, 120, 87, 0.15)",   // emerald-700
        bg2: "rgba(13, 148, 136, 0.08)"  // teal-600
      };
    case "fresh":
      return {
        bg1: "rgba(6, 182, 212, 0.15)",  // cyan-500
        bg2: "rgba(59, 130, 246, 0.08)"  // blue-500
      };
    case "floral":
      return {
        bg1: "rgba(219, 39, 119, 0.15)", // pink-600
        bg2: "rgba(162, 28, 175, 0.08)"  // fuchsia-600
      };
    default:
      return {
        bg1: "rgba(95, 111, 82, 0.15)",  // olive theme color
        bg2: "rgba(162, 173, 156, 0.08)" // sage
      };
  }
}
