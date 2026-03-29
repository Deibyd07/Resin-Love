"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import type { AdminProduct } from "@/features/admin/types";

type AdminProductCardProps = {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, field: "disponible" | "destacado", value: boolean) => Promise<void>;
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

export function AdminProductCard({ product, onEdit, onDelete, onToggle }: AdminProductCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await onDelete(product.id);
    });
  };

  const handleToggle = (field: "disponible" | "destacado") => {
    const currentValue = field === "disponible" ? product.available : product.isFeatured;
    startTransition(async () => {
      await onToggle(product.id, field, !currentValue);
    });
  };

  return (
    <motion.article
      layout
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-low shadow-md transition-shadow hover:shadow-xl",
        isPending && "pointer-events-none opacity-50",
        !product.available && "ring-2 ring-black/10",
      )}
    >
      {/* Image section */}
      <div className={cn(
        "relative aspect-[3/4] overflow-hidden bg-surface-variant",
        !product.available && "opacity-50 grayscale-[40%]",
      )}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 320px"
          draggable={false}
        />

        {/* Top badges row */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-2.5">
          {/* Category badge */}
          <span className="max-w-[60%] truncate rounded-full bg-secondary-container/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container shadow-sm backdrop-blur-sm">
            {product.category}
          </span>

          {/* Status badges column */}
          <div className="flex flex-col items-end gap-1">
            {product.isFeatured && (
              <span className="rounded-full bg-tertiary-container/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-tertiary-container backdrop-blur-sm">
                ★ Destacado
              </span>
            )}
            {!product.available && (
              <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                Oculto
              </span>
            )}
          </div>
        </div>

        {/* Gradient info bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-12 text-white">
          <h3 className="font-headline text-base font-bold leading-tight drop-shadow-md md:text-lg">{product.name}</h3>
          <p className="mt-0.5 text-sm font-black text-secondary-fixed drop-shadow-md">{currency.format(product.price)}</p>
        </div>
      </div>

      {/* ── Action bar — always visible ────────────────── */}
      <div className="flex items-center border-t border-surface-variant bg-surface/80">
        {/* Edit */}
        <button
          onClick={() => onEdit(product)}
          className="flex flex-1 items-center justify-center gap-1 py-2.5 text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
          aria-label="Editar"
        >
          <Icon name="edit" className="text-lg" />
          <span className="hidden text-xs font-semibold sm:inline">Editar</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-surface-variant" />

        {/* Toggle Available */}
        <button
          onClick={() => handleToggle("disponible")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1 py-2.5 transition-colors",
            product.available
              ? "text-green-600 hover:bg-green-50"
              : "text-on-surface-variant hover:bg-surface-variant",
          )}
          aria-label={product.available ? "Ocultar" : "Mostrar"}
        >
          <Icon
            name={product.available ? "visibility" : "visibility_off"}
            filled
            className="text-lg"
          />
          <span className="hidden text-xs font-semibold sm:inline">
            {product.available ? "Visible" : "Oculto"}
          </span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-surface-variant" />

        {/* Toggle Featured */}
        <button
          onClick={() => handleToggle("destacado")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1 py-2.5 transition-colors",
            product.isFeatured
              ? "text-amber-500 hover:bg-amber-50"
              : "text-on-surface-variant hover:bg-surface-variant",
          )}
          aria-label={product.isFeatured ? "Quitar destacado" : "Destacar"}
        >
          <Icon
            name="star"
            filled={product.isFeatured}
            className="text-lg"
          />
          <span className="hidden text-xs font-semibold sm:inline">
            {product.isFeatured ? "Destacado" : "Destacar"}
          </span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-surface-variant" />

        {/* Delete */}
        <button
          onClick={() => setShowConfirm(true)}
          className="flex flex-1 items-center justify-center gap-1 py-2.5 text-on-surface-variant transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="Eliminar"
        >
          <Icon name="delete" className="text-lg" />
          <span className="hidden text-xs font-semibold sm:inline">Borrar</span>
        </button>
      </div>

      {/* Delete confirmation overlay */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/75 p-5 backdrop-blur-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
            <Icon name="delete_forever" className="text-3xl text-red-400" />
          </div>
          <p className="text-center font-headline text-base font-bold text-white">¿Eliminar?</p>
          <p className="line-clamp-1 text-center text-sm text-white/70">{product.name}</p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              No
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                handleDelete();
              }}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-transform hover:scale-105 active:scale-95"
            >
              Sí, eliminar
            </button>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
