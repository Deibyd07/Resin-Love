"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { useProductDrawerStore } from "@/store/useProductDrawerStore";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils/cn";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function Icon({ name, filled = false, className }: { name: string; filled?: boolean; className?: string }) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24` }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function ProductDrawer() {
  const { isOpen, selectedProduct, closeDrawer } = useProductDrawerStore();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when opened with a new product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      imageUrl: selectedProduct.imageUrl,
      quantity,
    });
    closeDrawer();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                closeDrawer();
              }
            }}
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[90vh] overflow-y-auto rounded-t-[2rem] bg-surface pb-6 shadow-2xl safe-bottom md:left-auto md:right-4 md:top-24 md:max-h-[85vh] md:w-[28rem] md:rounded-3xl"
          >
            {/* Drag Handle */}
            <div className="sticky top-0 z-10 flex h-10 w-full cursor-grab items-center justify-center bg-surface/90 pt-2 backdrop-blur-sm active:cursor-grabbing md:hidden">
              <div className="h-1.5 w-12 rounded-full bg-slate-300" />
            </div>

            {/* Desktop Close Button */}
            <button 
              onClick={closeDrawer}
              className="absolute right-4 top-4 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black backdrop-blur-md transition-colors hover:bg-black/20 md:flex"
            >
              <Icon name="close" />
            </button>

            {/* Product Content */}
            <div className="px-5 md:px-6">
              <div className="relative mt-2 aspect-square w-full overflow-hidden rounded-2xl bg-surface-variant">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
                {(selectedProduct.tag || selectedProduct.category) && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-sm">
                    {selectedProduct.tag || selectedProduct.category}
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-headline text-2xl font-black text-on-surface md:text-3xl">
                    {selectedProduct.name}
                  </h2>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {selectedProduct.description || "Pieza única de resina, hecha a mano con amor."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-brand text-2xl text-primary md:text-3xl">
                    {currency.format(selectedProduct.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-surface-container-low p-4">
                <span className="font-semibold text-on-surface">Cantidad</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform active:scale-95"
                  >
                    <Icon name="remove" />
                  </button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform active:scale-95"
                  >
                    <Icon name="add" />
                  </button>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-pink-500 py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40 active:scale-95"
              >
                <Icon name="shopping_bag" filled className="text-xl" />
                Añadir por {currency.format(selectedProduct.price * quantity)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
