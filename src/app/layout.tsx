import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { AppProvider } from "@/context/AppContext";
import CartDrawer from "@/components/CartDrawer";

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
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AppProvider>
          {children}
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
