import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Nivati",
  description: "Review Nivati's policy regarding the collection, use, protection, and sharing of customer and order data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col pt-32 bg-creme">
      <Navbar />
      
      <div className="grow max-w-3xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-olive mb-4">
            Privacy Policy
          </h1>
          <p className="text-olive/60 font-serif italic text-sm md:text-base">
            Last updated: June 19, 2026
          </p>
        </div>

        <div className="space-y-8 font-sans text-olive/80 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when placing an order, subscribing to our newsletter, participating in a workshop, or contacting us for inquiries. 
              This information may include your name, email address, delivery address, phone number, and customization details (such as names or messages for customized candles).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">2. How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
              <li>Process, package, and deliver your orders.</li>
              <li>Communicate with you regarding order confirmations, updates, or support inquiries.</li>
              <li>Coordinate workshop logistics and send relevant materials.</li>
              <li>Send periodic promotional emails or newsletters if you have opted in (you can opt out at any time).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">3. Sharing of Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. 
              We only share your data with trusted partners necessary to run our service, such as delivery couriers (to deliver your packages) and payment processors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">4. Cookies & Site Analytics</h2>
            <p>
              Our website uses cookies to enhance your browsing experience, such as keeping items in your shopping cart. 
              We may also use analytics services to understand how visitors interact with our catalog and improve user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-olive mb-3">5. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or ask us to delete your personal details. 
              If you have any questions or requests regarding your privacy, please reach out to us at <strong>hello@nivati.com</strong>.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
