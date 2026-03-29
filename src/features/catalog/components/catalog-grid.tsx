"use client";

import { motion } from "framer-motion";

import { ProductCard } from "@/features/catalog/components/product-card";
import { CatalogProduct } from "@/features/catalog/types";

type CatalogGridProps = {
  products: CatalogProduct[];
};

export function CatalogGrid({ products }: CatalogGridProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Listado de productos">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.06 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </section>
  );
}
