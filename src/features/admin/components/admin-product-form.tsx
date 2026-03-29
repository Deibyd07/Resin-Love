"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import type { AdminProduct } from "@/features/admin/types";

type AdminProductFormProps = {
  isOpen: boolean;
  product: AdminProduct | null; // null = create mode
  categories: string[];
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("material-symbols-outlined", className)} aria-hidden>
      {name}
    </span>
  );
}

export function AdminProductForm({ isOpen, product, categories, onClose, onSubmit }: AdminProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string>("");

  const isEditing = product !== null;

  useEffect(() => {
    if (isOpen && product) {
      setImagePreview(product.imageUrl);
    } else if (isOpen) {
      setImagePreview("");
    }
  }, [isOpen, product]);

  // Lock body scroll
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (isEditing) {
      formData.set("id", product.id);
    }

    startTransition(async () => {
      await onSubmit(formData);
      onClose();
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
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
            onClick={onClose}
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
            onDragEnd={(_e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-surface pb-8 shadow-2xl md:left-auto md:right-4 md:top-16 md:max-h-[90vh] md:w-[32rem] md:rounded-3xl"
          >
            {/* Drag Handle (mobile) */}
            <div className="sticky top-0 z-10 flex h-10 w-full cursor-grab items-center justify-center bg-surface/90 pt-2 backdrop-blur-sm active:cursor-grabbing md:hidden">
              <div className="h-1.5 w-12 rounded-full bg-slate-300" />
            </div>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black backdrop-blur-md transition-colors hover:bg-black/20 md:flex"
            >
              <Icon name="close" />
            </button>

            {/* Form Content */}
            <div className="px-5 md:px-7">
              {/* Header */}
              <div className="mb-6 mt-2 md:mt-6">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Icon name={isEditing ? "edit" : "add_circle"} className="text-sm" />
                  {isEditing ? "Editar" : "Nuevo"} producto
                </div>
                <h2 className="font-headline text-2xl font-black text-on-surface md:text-3xl">
                  {isEditing ? product.name : "Crear producto"}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {isEditing
                    ? "Modifica los datos del producto y guarda los cambios."
                    : "Completa los datos para añadir un nuevo producto al catálogo."}
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-variant shadow-md">
                  <Image
                    src={imagePreview}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 512px"
                    onError={() => setImagePreview("")}
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
              )}

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Nombre del producto
                  </label>
                  <input
                    name="nombre"
                    required
                    defaultValue={isEditing ? product.name : ""}
                    placeholder="Ej: Llavero Floral"
                    className="w-full rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Categoría + Precio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Categoría
                    </label>
                    <input
                      name="categoria"
                      required
                      list="admin-form-categories"
                      defaultValue={isEditing ? product.category : ""}
                      placeholder="Ej: Llaveros"
                      className="w-full rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <datalist id="admin-form-categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Precio (COP)
                    </label>
                    <input
                      name="precio"
                      type="number"
                      min={1}
                      required
                      defaultValue={isEditing ? product.price : ""}
                      placeholder="35000"
                      className="w-full rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* URL de imagen */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    URL de imagen
                  </label>
                  <input
                    name="imagen_url"
                    type="url"
                    required
                    defaultValue={isEditing ? product.imageUrl : ""}
                    onChange={handleImageUrlChange}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Descripción
                    <span className="ml-1 font-normal normal-case tracking-normal text-on-surface-variant/60">(opcional)</span>
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    defaultValue={isEditing ? product.description ?? "" : ""}
                    placeholder="Pieza única de resina hecha a mano..."
                    className="w-full resize-none rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Toggle switches */}
                <div className="flex gap-6 rounded-2xl bg-surface-container-low p-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-on-surface cursor-pointer">
                    <span className="relative inline-flex">
                      <input
                        name="disponible"
                        type="checkbox"
                        defaultChecked={isEditing ? product.available : true}
                        className="peer sr-only"
                      />
                      <span className="h-6 w-11 rounded-full bg-surface-variant transition-colors peer-checked:bg-green-500" />
                      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                    </span>
                    Disponible
                  </label>

                  <label className="flex items-center gap-3 text-sm font-semibold text-on-surface cursor-pointer">
                    <span className="relative inline-flex">
                      <input
                        name="destacado"
                        type="checkbox"
                        defaultChecked={isEditing ? product.isFeatured : false}
                        className="peer sr-only"
                      />
                      <span className="h-6 w-11 rounded-full bg-surface-variant transition-colors peer-checked:bg-amber-500" />
                      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                    </span>
                    Destacado
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-pink-500 py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]",
                    isPending && "opacity-60",
                  )}
                >
                  <Icon name={isEditing ? "save" : "add_circle"} className="text-xl" />
                  {isPending
                    ? "Guardando..."
                    : isEditing
                      ? "Guardar cambios"
                      : "Crear producto"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
