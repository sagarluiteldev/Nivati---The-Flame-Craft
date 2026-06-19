import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { AppProvider } from "@/context/AppContext";
import CartDrawer from "@/components/CartDrawer";
import SmoothScroller from "@/components/SmoothScroller";

export const metadata: Metadata = {
  title: "Nivati - The Flame Craft",
  description: "Hand-poured scented candles and beginner-friendly craft kits.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${jakarta.variable} ${cormorant.variable} antialiased`}>
        <AppProvider>
          <SmoothScroller />
          {children}
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
