"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCartUIStore } from "@/components/ui/cart-drawer";
import { cn } from "@/lib/utils/cn";

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

export function CartButton({ className }: { className?: string }) {
  const items = useCartStore((state) => state.items);
  const openCart = useCartUIStore((state) => state.openCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={openCart}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-slate-100 active:scale-95",
        className
      )}
      aria-label={`Abrir carrito (${count} artículos)`}
    >
      <Icon name="shopping_bag" className="text-[26px]" />
      
      {mounted && count > 0 && (
        <span className="absolute right-0 top-0 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-surface bg-pink-500 px-1 text-[10px] font-bold text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
