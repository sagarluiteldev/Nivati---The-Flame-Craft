import Link from "next/link";
import { Instagram, PinIcon as Pinterest, TwitterIcon as TikTok } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-olive pt-20 pb-10 text-creme border-t border-creme/10 dark:bg-transparent dark:text-olive dark:border-olive/10 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="mb-6 bg-creme dark:bg-transparent dark:border dark:border-olive/20 p-4 rounded-full inline-block transition-colors duration-700">
              <img src="/images/logo.png" alt="Nivati Logo" className="h-32 w-32 object-contain dark:invert dark:brightness-0 transition-all" />
            </div>
            <p className="text-creme/60 dark:text-olive/60 font-sans font-light max-w-sm leading-relaxed mb-6 transition-colors duration-700">
              Empowering your sanctuary with hand-poured scents and mindful crafting. Find your glow.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-creme/5 flex items-center justify-center hover:bg-creme/10 dark:bg-olive/5 dark:hover:bg-olive/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-creme/5 flex items-center justify-center hover:bg-creme/10 dark:bg-olive/5 dark:hover:bg-olive/10 transition-colors">
                <Pinterest className="w-4 h-4" />
              </a>
              {/* Optional TikTok SVG */}
              <a href="#" className="w-10 h-10 rounded-full bg-creme/5 flex items-center justify-center hover:bg-creme/10 dark:bg-olive/5 dark:hover:bg-olive/10 transition-colors">
                <TikTok className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Shop</h4>
            <ul className="flex flex-col gap-3 font-light text-creme/60 dark:text-olive/60 transition-colors duration-700">
              <li><Link href="#shop" className="hover:text-creme dark:hover:text-olive transition-colors">Signature Candles</Link></li>
              <li><Link href="#kits" className="hover:text-creme dark:hover:text-olive transition-colors">DIY Kits</Link></li>
              <li><Link href="#workshops" className="hover:text-creme dark:hover:text-olive transition-colors">Workshops</Link></li>
              <li><Link href="#shop" className="hover:text-creme dark:hover:text-olive transition-colors">Raw Materials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Support</h4>
            <ul className="flex flex-col gap-3 font-light text-creme/60 dark:text-olive/60 transition-colors duration-700">
              <li><Link href="/shipping-policy" className="hover:text-creme dark:hover:text-olive transition-colors">Shipping Policy</Link></li>
              <li><Link href="/wholesale" className="hover:text-creme dark:hover:text-olive transition-colors">Wholesale & Bulk</Link></li>
              <li><Link href="#" className="hover:text-creme dark:hover:text-olive transition-colors">FAQ</Link></li>
              <li><a href="tel:+9842003249" className="hover:text-creme dark:hover:text-olive transition-colors">Contact Us: +9842003249</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-creme/10 dark:border-olive/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-creme/40 dark:text-olive/40 transition-colors duration-700">
          <p>© {new Date().getFullYear()} Nivati — The Flame Craft. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-creme dark:hover:text-olive transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-creme dark:hover:text-olive transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
