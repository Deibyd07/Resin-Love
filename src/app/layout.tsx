import type { Metadata } from "next";
import { Be_Vietnam_Pro, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const headline = Be_Vietnam_Pro({
  variable: "--font-headline",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const brand = Great_Vibes({
  variable: "--font-brand",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resinlove.co"),
  title: {
    default: "Resin Love | Catálogo de resina artesanal",
    template: "%s | Resin Love",
  },
  description: "Catálogo de productos en resina artesanal: bandejas, llaveros y piezas personalizadas hechas a mano.",
  keywords: [
    "resina artesanal",
    "catálogo resina",
    "productos en resina",
    "decoración en resina",
    "emprendimiento de resina",
  ],
  applicationName: "Resin Love",
  category: "shopping",
  authors: [{ name: "Resin Love" }],
  creator: "Resin Love",
  publisher: "Resin Love",
  alternates: {
    canonical: "/",
    languages: {
      "es-CO": "/",
      es: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Resin Love",
    title: "Resin Love | Catálogo de resina artesanal",
    description: "Descubre piezas únicas en resina para hogar, decoración y regalos personalizados.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Resin Love - Catálogo de resina artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resin Love | Catálogo de resina artesanal",
    description: "Piezas de resina artesanal para regalar y decorar.",
    images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

import { ProductDrawer } from "@/components/ui/product-drawer";
import { CartDrawer } from "@/components/ui/cart-drawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${headline.variable} ${body.variable} ${brand.variable} bg-surface font-body text-on-surface antialiased`}>
        {children}
        <ProductDrawer />
        <CartDrawer />
      </body>
    </html>
  );
}
