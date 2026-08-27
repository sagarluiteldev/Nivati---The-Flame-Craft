import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Lora } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"));
const SmoothScroller = dynamic(() => import("@/components/SmoothScroller"));

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Cambria", "serif"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#5a6c37",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nivaticandles.com"),
  title: {
    default: "Nivati — The Flame Craft | Hand-Poured Scented Candles & Kits",
    template: "%s | Nivati — The Flame Craft",
  },
  description:
    "Discover Nivati's artisanal hand-poured soy and gel wax scented candles, concrete jar collections, mindful fragrance blends, and beginner-friendly candle making DIY kits.",
  keywords: [
    "Nivati",
    "Nivati candles",
    "hand poured candles Nepal",
    "scented candles Kathmandu",
    "soy wax candles",
    "candle making kit Nepal",
    "artisan candles",
    "luxury scented candles",
    "flame craft",
    "handmade soy candles",
  ],
  authors: [{ name: "Nivati — The Flame Craft", url: "https://nivaticandles.com" }],
  creator: "Nivati",
  publisher: "Nivati",
  applicationName: "Nivati",
  alternates: {
    canonical: "https://nivaticandles.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nivaticandles.com",
    siteName: "Nivati — The Flame Craft",
    title: "Nivati — Handcrafted Scented Candles & Crafting Kits",
    description:
      "Hand-poured artisan candles made from natural soy and gel wax. Explore signature scents, concrete jars, and DIY candle making kits.",
    images: [
      {
        url: "/images/IMG_4136.jpg",
        width: 1200,
        height: 630,
        alt: "Nivati Hand-Poured Scented Candles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nivati — The Flame Craft",
    description:
      "Artisanal hand-poured soy scented candles and mindful candle crafting kits in Nepal.",
    images: ["/images/IMG_4136.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nivaticandles.com/#organization",
      name: "Nivati — The Flame Craft",
      url: "https://nivaticandles.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nivaticandles.com/images/logo.png",
      },
      image: "https://nivaticandles.com/images/IMG_4136.jpg",
      description:
        "Artisanal candle studio creating hand-poured natural soy and gel wax candles, customized scents, and DIY candle making kits.",
      telephone: "+9779842003249",
      email: "nivaticandles@gmail.com",
      sameAs: [
        "https://www.instagram.com/nivati.np",
        "https://www.facebook.com/nivati.np",
        "https://www.tiktok.com/@nivati.np",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://nivaticandles.com/#website",
      url: "https://nivaticandles.com",
      name: "Nivati — The Flame Craft",
      publisher: {
        "@id": "https://nivaticandles.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className={`${jakarta.variable} ${cormorant.variable} ${lora.variable} antialiased`}>
        <AppProvider>
          <SmoothScroller />
          {children}
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
