import Link from "next/link";
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.69 3.89-1.92 5.37-1.24 1.48-3.08 2.45-5.04 2.62-1.96.17-3.95-.27-5.55-1.3-1.6-1.04-2.73-2.67-3.12-4.57-.39-1.91-.05-3.92.93-5.59.98-1.67 2.57-2.9 4.46-3.41 1.88-.51 3.92-.3 5.64.55.24.12.47.26.7.41V8.42c-.93-.41-1.96-.63-3-.63-1.39 0-2.76.43-3.92 1.2-1.16.78-2.07 1.9-2.58 3.19-.51 1.3-.67 2.72-.45 4.1.22 1.39.88 2.66 1.87 3.65.99.98 2.27 1.63 3.65 1.86 1.39.22 2.81.05 4.1-.45 1.3-.51 2.41-1.42 3.19-2.58.78-1.17 1.2-2.54 1.2-3.93V.02h-3.91z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 pt-12 md:pt-20 pb-8 md:pb-10 text-creme border-t border-creme/10 transition-colors duration-700 overflow-hidden">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0 opacity-30 grayscale pointer-events-none bg-[url('/images/footer-bg.png')] bg-cover bg-center bg-no-repeat mix-blend-luminosity" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          <div className="md:col-span-2">
            <div className="mb-4 inline-block transition-colors duration-700">
              <img src="/images/logo.png" alt="Nivati Logo" className="h-20 w-20 md:h-20 md:w-20 object-contain transition-all" />
            </div>
            <p className="text-creme/60 font-sans font-light max-w-sm leading-relaxed mb-4 text-sm md:text-base transition-colors duration-700">
              Empowering your sanctuary with hand-poured scents and mindful crafting. Find your glow.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/nivati.np" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-creme/5 flex items-center justify-center hover:bg-creme/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/nivati.np" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-creme/5 flex items-center justify-center hover:bg-creme/10 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@nivati.np" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-creme/5 flex items-center justify-center hover:bg-creme/10 transition-colors">
                <TikTok className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop & Support side by side on mobile */}
          <div className="grid grid-cols-2 md:contents gap-6">
            <div>
              <h4 className="font-serif text-base md:text-lg mb-3 md:mb-4">Shop</h4>
              <ul className="flex flex-col gap-2 md:gap-3 font-light text-creme/60 text-sm transition-colors duration-700">
                <li><Link href="/shop?category=Signature Candles" className="hover:text-creme transition-colors">Signature Candles</Link></li>
                <li><Link href="/shop?category=Candle Making Kit" className="hover:text-creme transition-colors">DIY Kits</Link></li>
                <li><Link href="/#workshops" className="hover:text-creme transition-colors">Workshops</Link></li>
                <li><Link href="/shop?category=Candle Making Materials" className="hover:text-creme transition-colors">Raw Materials</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-base md:text-lg mb-3 md:mb-4">Support</h4>
              <ul className="flex flex-col gap-2 md:gap-3 font-light text-creme/60 text-sm transition-colors duration-700">
                <li><Link href="/shipping-policy" className="hover:text-creme transition-colors">Shipping Policy</Link></li>
                <li><Link href="/wholesale" className="hover:text-creme transition-colors">Wholesale & Bulk</Link></li>
                <li><a href="tel:+9779842003249" className="hover:text-creme transition-colors">Contact Us: +977 9842003249</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-creme/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-creme/40 transition-colors duration-700">
          <p>© {new Date().getFullYear()} Nivati — The Flame Craft. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-creme transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-creme transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
