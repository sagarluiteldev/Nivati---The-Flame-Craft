import SmoothScroller from "@/components/SmoothScroller";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Collections from "@/components/Collections";
import Workshops from "@/components/Workshops";
import Journals from "@/components/Journals";
import Process from "@/components/Process";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-creme selection:bg-olive selection:text-creme">
      <SmoothScroller />
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
