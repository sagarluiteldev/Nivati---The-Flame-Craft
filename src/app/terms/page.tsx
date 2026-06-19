import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Nivati",
  description: "Read Nivati's Terms of Service governing product use, safe candle burning, custom orders, payments, and copyright.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col pt-32 bg-creme">
      <Navbar />
      
      <div className="grow max-w-3xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-olive mb-4">
            Terms of Service
          </h1>
          <p className="text-olive/60 font-serif italic text-sm md:text-base">
            Last updated: June 19, 2026
          </p>
        </div>

        <div className="space-y-8 font-sans text-olive/80 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing our website and purchasing products from Nivati, you agree to comply with and be bound by these Terms of Service. 
              Please read them carefully before using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">2. Product Authenticity & Safety</h2>
            <p>
              All Nivati products are hand-poured and unique. Slight variations in color, texture, or finish are normal and represent the handcrafted nature of the items. 
              You agree to follow safety instructions included with your candles (e.g., trimming wicks, never leaving burning candles unattended, keeping out of reach of children and pets). 
              Nivati is not liable for damages caused by improper candle usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">3. Payments & Order Policy</h2>
            <p>
              All prices listed on the site are in Nepalese Rupees (NPR) unless specified otherwise. 
              We reserve the right to cancel or refuse any order due to supply issues, pricing errors, or suspicion of fraudulent activity. 
              If we cancel an order after payment, we will issue a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">4. Intellectual Property</h2>
            <p>
              All content, images, designs, logo marks, and branding elements on this website are the property of Nivati — The Flame Craft. 
              No materials from this website may be copied, reproduced, or used without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">5. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of Nepal. 
              Any disputes arising out of your use of this site or purchase of products shall be resolved in the competent courts of Kathmandu, Nepal.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
