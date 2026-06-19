import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wholesale & Bulk Orders | Nivati",
  description: "Partner with Nivati to stock our luxury soy candles and craft kits, customize corporate gifts, or create custom signature scent blends.",
};

export default function WholesalePage() {
  return (
    <main className="min-h-screen flex flex-col pt-32 bg-creme">
      <Navbar />
      
      <div className="grow max-w-4xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-6 mx-auto shadow-md bg-olive/5 relative">
            <img 
              src="/images/logo.png" 
              alt="Nivati Logo" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" 
              style={{ transform: "translateZ(0)" }}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-olive mb-4">
            Wholesale & Bulk Orders
          </h1>
          <p className="text-olive/60 font-serif italic text-base md:text-lg max-w-xl mx-auto">
            Bring Nivati&apos;s hand-poured, mindful aromas to your store, boutique, corporate gifts, or special celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-olive/5 p-8 rounded-3xl border border-olive/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-olive">Retail Partnerships</h3>
            <p className="text-sm text-olive/80 leading-relaxed font-sans">
              Partner with us to stock our premium candles and beginner-friendly candle-making kits on your shelves. We offer competitive margins, low minimum order quantities (MOQ), and testers for store displays.
            </p>
          </div>

          <div className="bg-olive/5 p-8 rounded-3xl border border-olive/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-olive">Corporate & Events</h3>
            <p className="text-sm text-olive/80 leading-relaxed font-sans">
              Delight your clients, employees, or wedding guests with custom Nivati gifts. We provide bespoke packaging, personalized labels, and bulk order discounts for events of all sizes.
            </p>
          </div>

          <div className="bg-olive/5 p-8 rounded-3xl border border-olive/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-olive/10 text-olive flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-olive">Custom Scent Blending</h3>
            <p className="text-sm text-olive/80 leading-relaxed font-sans">
              Create a signature olfactory experience unique to your brand, spa, or workspace. Our master scent designers can formulate custom aroma profiles based on your specific requirements.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-sage/5 border border-sage/10 p-8 rounded-3xl text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif text-olive">Inquire About Bulk Pricing</h2>
          <p className="text-olive/85 font-sans leading-relaxed text-sm md:text-base">
            Ready to bring Nivati&apos;s flame crafts into your space? Contact us with your expected quantity, customized requests, and preferred fragrances, and we will get back to you with custom catalog options and pricing details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <a 
              href="https://wa.me/9842003249?text=Hi,%20I%20am%20interested%20in%20placing%20a%20wholesale/bulk%20order%20with%20Nivati"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-olive text-creme px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg active:scale-95 text-base font-medium font-sans"
            >
              Contact via WhatsApp
            </a>
            <a 
              href="mailto:hello@nivati.com"
              className="inline-flex items-center gap-2 border border-olive/20 text-olive px-8 py-4 rounded-full transition-all duration-300 hover:bg-olive/5 hover:border-olive/45 active:scale-95 text-base font-medium font-sans"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
