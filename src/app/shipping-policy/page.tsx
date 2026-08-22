import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Nivati",
  description: "Learn about Nivati's hand-poured candle order processing, Kathmandu Valley deliveries, nationwide shipping rates, and care guidelines.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col pt-32 bg-creme">
      <Navbar />
      
      <div className="grow max-w-3xl mx-auto px-6 py-12 md:py-20 w-full">
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
            Shipping Policy
          </h1>
          <p className="text-olive/60 font-serif italic text-base md:text-lg">
            Handcrafted with Care, Delivered with Love.
          </p>
        </div>

        <div className="space-y-12 font-sans text-olive/80 text-sm md:text-base leading-relaxed">
          <section className="border-b border-olive/10 pb-8">
            <h2 className="text-2xl font-serif text-olive mb-4">Order Processing</h2>
            <p>
              All Nivati candles and kits are hand-poured and assembled in small batches to ensure the highest quality. 
              Please allow <strong>1 to 2 business days</strong> for us to prepare and package your order before it is handed off to our courier partners. 
              You will receive an update once your package is on its way.
            </p>
          </section>

          <section className="border-b border-olive/10 pb-8">
            <h2 className="text-2xl font-serif text-olive mb-4">Delivery Times & Coverage</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-olive mb-1">Kathmandu Valley (Inside Ring Road & Surrounding Areas)</h3>
                <p>Deliveries within the Kathmandu Valley typically arrive within <strong>1 to 2 business days</strong> after processing is complete.</p>
              </div>
              <div>
                <h3 className="font-semibold text-olive mb-1">Nationwide Shipping (Outside Kathmandu Valley)</h3>
                <p>For orders shipped outside the Kathmandu Valley, delivery times vary by destination, generally taking <strong>3 to 5 business days</strong>.</p>
              </div>
            </div>
          </section>

          <section className="border-b border-olive/10 pb-8">
            <h2 className="text-2xl font-serif text-olive mb-4">Shipping Rates</h2>
            <p className="mb-5">
              Shipping rates are calculated individually for each order based on your <strong>delivery location</strong> and the <strong>specific type, weight, and volume of the products</strong> you purchase. Because our catalog includes delicate glass jar candles, sculpted wax pieces, and heavier DIY raw materials, customized rate calculation ensures your package is protected properly while keeping courier costs fair and accurate.
            </p>

            <div className="space-y-6 mt-6">
              <div className="bg-olive/5 p-5 rounded-2xl border border-olive/10">
                <h3 className="font-semibold text-olive text-lg mb-2">1. Delivery Location & Distance</h3>
                <ul className="list-disc list-inside space-y-2 pl-2 text-olive/80">
                  <li>
                    <strong>Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur):</strong> Standard local courier rates apply based on your exact municipal area and distance from our workshop (inside vs. outside the Ring Road).
                  </li>
                  <li>
                    <strong>Major Out-of-Valley Cities (Pokhara, Chitwan, Butwal, Biratnagar, Dharan, etc.):</strong> Dispatched via regional express courier services with regional hub-to-door delivery.
                  </li>
                  <li>
                    <strong>Remote & District Headquarter Destinations:</strong> Dispatched via domestic transport partners. Delivery time and rates depend on local transport connectivity.
                  </li>
                </ul>
              </div>

              <div className="bg-olive/5 p-5 rounded-2xl border border-olive/10">
                <h3 className="font-semibold text-olive text-lg mb-2">2. Product Type, Weight & Fragility</h3>
                <ul className="list-disc list-inside space-y-2 pl-2 text-olive/80">
                  <li>
                    <strong>Signature Glass Jars & Multi-Wick Candles:</strong> These items require heavy glassware protective padding (bubble cushioning and shock-absorbent wrapping) to ensure zero breakage during transit, which influences volumetric package weight.
                  </li>
                  <li>
                    <strong>DIY Candle Making Kits & Raw Materials:</strong> Bulk wax (soy, gel, beeswax), melting pitchers, and material supplies carry greater deadweight, which falls into standard carrier weight tiers.
                  </li>
                  <li>
                    <strong>Sculpted Pillar & Floating Candles:</strong> Lightweight and compact, resulting in economical shipping tiers when ordered in standard quantities.
                  </li>
                  <li>
                    <strong>Bulk & Wholesale Consignments:</strong> Special freight rates are calculated based on total consignment volume and carton dimensions.
                  </li>
                </ul>
              </div>

              <div className="bg-olive/5 p-5 rounded-2xl border border-olive/10">
                <h3 className="font-semibold text-olive text-lg mb-2">3. How Your Shipping Rate is Confirmed</h3>
                <p className="text-olive/80">
                  When you finalize your cart and place your order via <strong>WhatsApp</strong>, our team calculates the exact courier fee according to your destination and parcel size. We share the total delivery amount with you for confirmation before packaging and dispatching your items.
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-olive/10 pb-8">
            <h2 className="text-2xl font-serif text-olive mb-4">Handcrafted Product Care & Weather Note</h2>
            <p>
              Because our candles are crafted from natural soy and gel waxes, they can be sensitive to extreme heat during transit. 
              We pack all items carefully in eco-friendly insulated packaging to prevent melting. 
              Please retrieve your package promptly upon delivery to prevent it from sitting in hot sun or outdoor letterboxes.
            </p>
          </section>

          <section className="pb-8">
            <h2 className="text-2xl font-serif text-olive mb-4">Damaged Packages & Returns</h2>
            <p>
              Your satisfaction is our priority. If your order arrives damaged, broken, or in an unusable state, please take a photo of the item and the packaging and contact us via WhatsApp at <strong>+977 9842003249</strong> within 48 hours of delivery. 
              We will gladly issue a replacement or store credit.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
