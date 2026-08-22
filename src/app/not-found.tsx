import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col pt-32 bg-creme">
      <Navbar />
      
      <div className="grow max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-sans uppercase tracking-[0.3em] text-olive/60 mb-3">
          Error 404
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-olive mb-6">
          Page Not Found
        </h1>
        <p className="text-olive/75 font-sans font-light text-base md:text-lg max-w-md mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s guide you back to our sanctuary.
        </p>
        <Link
          href="/"
          className="px-8 py-3.5 bg-olive text-creme rounded-full hover:bg-olive/90 transition-colors uppercase tracking-widest text-xs font-medium"
        >
          Return Home
        </Link>
      </div>

      <Footer />
    </main>
  );
}
