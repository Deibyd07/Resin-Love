"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { ProductCard } from "@/features/catalog/components/product-card";
import { featuredProducts } from "@/features/landing/data/landing-content";
import { mockProducts } from "@/features/catalog/data/mock-products";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { CartButton } from "@/components/ui/cart-button";
import { cn } from "@/lib/utils/cn";

// We'll merge featured products and mock products to map IDs
const allProducts = [
  ...featuredProducts.map((p) => ({ ...p, category: p.tag || "Otros" })),
  ...mockProducts.map((p) => ({ ...p, tag: p.category })),
];

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("material-symbols-outlined", className)} aria-hidden>
      {name}
    </span>
  );
}

export default function FavoritosPage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteProducts = allProducts.filter((product) => favoriteIds.includes(product.id));

  return (
    <main className="min-h-screen bg-surface pb-24 pt-4">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 mb-6 bg-surface/80 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant transition-colors hover:bg-surface-container active:scale-95">
            <Icon name="arrow_back" className="text-on-surface" />
          </Link>
          <h1 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <Icon name="favorite" className="text-pink-500" />
            Favoritos
          </h1>
          <CartButton />
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        {/* ── PRODUCT GRID ── */}
        {mounted && favoriteProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {favoriteProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : mounted ? (
          <div className="mt-24 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50 text-5xl text-pink-300">
              <Icon name="favorite_border" className="text-5xl" />
            </div>
            <h3 className="font-headline text-2xl font-black text-on-surface">Aún no tienes favoritos</h3>
            <p className="mt-3 max-w-xs text-on-surface-variant">
              Guarda tus piezas de resina preferidas tocando el corazón para verlas aquí más tarde.
            </p>
            <Link 
              href="/catalogo"
              className="mt-8 rounded-full bg-gradient-to-r from-primary to-pink-500 px-8 py-3.5 font-bold text-on-primary shadow-lg transition-transform active:scale-95"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
