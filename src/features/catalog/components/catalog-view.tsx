"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { CartButton } from "@/components/ui/cart-button";
import { ProductCard } from "@/features/catalog/components/product-card";
import { cn } from "@/lib/utils/cn";

type CatalogViewProduct = {
  id: string;
  name: string;
  category: string;
  tag?: string;
  price: number;
  imageUrl: string;
};

type CatalogViewProps = {
  products: CatalogViewProduct[];
};

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("material-symbols-outlined", className)} aria-hidden>
      {name}
    </span>
  );
}

export function CatalogView({ products }: CatalogViewProps) {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  const allCategories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    if (catParam && allCategories.includes(catParam)) {
      setActiveCategory(catParam);
      return;
    }

    setActiveCategory("Todos");
  }, [catParam, allCategories]);

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <main className="min-h-screen bg-surface pb-24 pt-4">
      <header className="sticky top-0 z-40 mb-6 bg-surface/80 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant transition-colors hover:bg-surface-container active:scale-95"
          >
            <Icon name="arrow_back" className="text-on-surface" />
          </Link>
          <h1 className="font-headline text-xl font-bold text-on-surface">Catálogo</h1>
          <CartButton />
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="no-scrollbar mb-8 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                activeCategory === cat
                  ? "border-primary bg-primary text-on-primary shadow-md shadow-primary/20"
                  : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-variant",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
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

        {filteredProducts.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-variant text-4xl">
              🌺
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface">No hay productos</h3>
            <p className="mt-2 text-on-surface-variant">Pronto añadiremos más piezas a esta categoría.</p>
          </div>
        )}
      </div>
    </main>
  );
}