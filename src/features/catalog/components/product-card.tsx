"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

import { useProductDrawerStore } from "@/store/useProductDrawerStore";

// Support both CatalogProduct and FeaturedProduct (which has 'tag' instead of 'category')
export type UniversalProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  tag?: string;
  description?: string;
};

type ProductCardProps = {
  product: UniversalProduct;
  className?: string;
  width?: number | string;
};

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

export function ProductCard({ product, className, width = "100%" }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const openDrawer = useProductDrawerStore((state) => state.openDrawer);
  const favorite = isFavorite(product.id);

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    // TODO: Add toast notification
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <article className={cn("relative flex-shrink-0", className)} style={{ width }}>
      <div 
        onClick={() => openDrawer(product)}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-variant shadow-xl cursor-pointer group"
      >
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 320px" draggable={false} />
        
        {/* Badge */}
        {(product.tag || product.category) && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary-container px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container shadow-sm">
            {product.tag || product.category}
          </span>
        )}

        {/* Favorite Button */}
        <button 
          onClick={handleToggleFavorite}
          className="glass-card absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:bg-white/80 active:scale-90" 
          aria-label={favorite ? "Quitar de Favoritos" : "Agregar a Favoritos"}
        >
          <Icon name="favorite" filled={favorite} className={cn("text-lg", favorite ? "text-pink-500" : "text-slate-600")} />
        </button>

        {/* Info Gradient Bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-5 pt-14 text-white">
          <h3 className="font-headline text-lg font-bold drop-shadow-sm leading-tight mb-1">{product.name}</h3>
          <p className="text-base font-black text-secondary-fixed drop-shadow-sm">{currency.format(product.price)}</p>
        </div>
      </div>

      {/* Add to Cart Floating Button */}
      <button 
        onClick={handleAddToCart}
        className="absolute -bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500 text-on-primary shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95" 
        aria-label="Agregar al carrito"
      >
        <Icon name="add_shopping_cart" filled className="text-xl" />
      </button>
    </article>
  );
}
