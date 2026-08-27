import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Collections from "@/components/Collections";

const Workshops = dynamic(() => import("@/components/Workshops"));
const Journals = dynamic(() => import("@/components/Journals"));
const Process = dynamic(() => import("@/components/Process"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main className="relative bg-creme selection:bg-olive selection:text-creme">
      <Navbar />
      <Hero />
      <Experience />
      <Collections />
      <Workshops />
      <Journals />
      <Process />
      <Footer />
    </main>
  );
}
