"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

// Global state specifically for UI visibility of the cart drawer
import { create } from "zustand";

interface CartUIState {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartUIStore = create<CartUIState>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

export function CartDrawer() {
  const { isOpen, closeCart } = useCartUIStore();
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

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

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Build the WhatsApp message
    const phoneNumber = "573000000000"; // Replace with real phone number
    let message = "Hola Resin Love! 💕\n\nQuiero hacer el siguiente pedido:\n\n";

    items.forEach((item) => {
      message += `▪ ${item.quantity}x ${item.name} (${currency.format(item.price)})\n`;
      if (item.customization) {
        if (item.customization.letter) message += `   Letra: ${item.customization.letter}\n`;
        if (item.customization.color) message += `   Tono: ${item.customization.color}\n`;
      }
    });

    const totalStr = currency.format(getCartTotal());
    message += `\n*TOTAL: ${totalStr}*\n\n`;
    message += "Por favor indícame los pasos para el pago y envío. ¡Gracias! ✨";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Close cart and clear it (optional: wait for them to pay first before clearing)
    // clearCart(); 

    window.open(whatsappUrl, "_blank");
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
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Sheet (Slide from right on desktop, bottom on mobile if preferred, let's do right for all to feel like a real cart) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
              <h2 className="font-headline text-xl font-bold flex items-center gap-2">
                <Icon name="shopping_bag" />
                Tu Carrito
              </h2>
              <button 
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label="Cerrar carrito"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
                  <Icon name="shopping_cart" className="mb-4 text-5xl text-outline" />
                  <p className="font-semibold text-lg text-on-surface">Tu carrito está vacío</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    ¡Agrega tus piezas favoritas para empezar!
                  </p>
                  <button 
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-primary-container px-6 py-2.5 font-bold text-on-primary-container transition-transform active:scale-95"
                  >
                    Seguir explorando
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex gap-4 border-b border-outline-variant/20 pb-6 last:border-0 last:pb-0">
                      {/* Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-surface-variant">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-bold text-on-surface leading-tight">{item.name}</p>
                          <p className="mt-1 font-brand text-primary">{currency.format(item.price)}</p>
                          
                          {/* Customization Details if any */}
                          {item.customization && (
                            <div className="mt-1 flex gap-2 text-xs text-on-surface-variant">
                              {item.customization.letter && <span className="rounded bg-surface-variant px-1.5 py-0.5">Letra: {item.customization.letter}</span>}
                              {item.customization.color && <span className="rounded bg-surface-variant px-1.5 py-0.5">Color: {item.customization.color}</span>}
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full bg-surface-container-low px-2 py-1">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) removeItem(item.id);
                                else updateQuantity(item.id, item.quantity - 1);
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm text-slate-600 active:scale-90"
                              aria-label="Disminuir cantidad"
                            >
                              <Icon name="remove" className="text-sm" />
                            </button>
                            <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm text-slate-600 active:scale-90"
                              aria-label="Aumentar cantidad"
                            >
                              <Icon name="add" className="text-sm" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-outline hover:text-error transition-colors"
                            aria-label="Eliminar artículo"
                          >
                            <Icon name="delete" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-outline-variant/30 bg-surface px-6 pb-8 pt-6 safe-bottom">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-bold text-lg">{currency.format(getCartTotal())}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-bold text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95"
                >
                  Continuar en WhatsApp
                </button>
                <p className="mt-3 text-center text-[11px] text-on-surface-variant">
                  Te conectaremos con nuestra línea de atención para coordinar el pago y envío.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
