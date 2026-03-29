"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import { AdminProductCard } from "@/features/admin/components/admin-product-card";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";
import type { AdminProduct } from "@/features/admin/types";

// ── Helpers ──────────────────────────────────────────────────
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

// ── Props ────────────────────────────────────────────────────
type AdminDashboardProps = {
  products: AdminProduct[];
  signOutAction: () => Promise<void>;
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  toggleAction: (id: string, field: "disponible" | "destacado", value: boolean) => Promise<void>;
};

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: number; accent?: string }) {
  return (
    <div className="group relative overflow-hidden bg-surface p-3.5 transition-all md:p-4">
      <div className="absolute -right-2 -top-2 opacity-[0.05] transition-transform duration-500 group-hover:scale-110">
        <Icon name={icon} className={cn("text-6xl", accent)} />
      </div>
      <div className="relative">
        <div className="mb-0.5 flex items-center gap-1.5">
          <Icon name={icon} className={cn("text-base md:text-lg", accent ?? "text-primary")} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant md:text-xs">{label}</span>
        </div>
        <p className="font-headline text-2xl font-black text-on-surface md:text-3xl">{value}</p>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export function AdminDashboard({
  products,
  signOutAction,
  createAction,
  updateAction,
  deleteAction,
  toggleAction,
}: AdminDashboardProps) {
  const router = useRouter();
  const [, startSignOutTransition] = useTransition();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Derived data
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "Todos") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: products.length,
    categories: new Set(products.map((p) => p.category)).size,
    available: products.filter((p) => p.available).length,
    featured: products.filter((p) => p.isFeatured).length,
  }), [products]);

  // Handlers
  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (editingProduct) {
      await updateAction(formData);
    } else {
      await createAction(formData);
    }
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteAction(id);
    router.refresh();
  };

  const handleToggle = async (id: string, field: "disponible" | "destacado", value: boolean) => {
    await toggleAction(id, field, value);
    router.refresh();
  };

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      await signOutAction();
    });
  };

  const existingCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  return (
    <main className="min-h-screen bg-surface pb-24">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="gradient-border-bottom sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500 shadow-md shadow-primary/20">
              <Icon name="shield_person" className="text-xl text-white" />
            </div>
            <div>
              <span className="font-brand text-[28px] leading-none text-on-surface md:text-[32px]">Resin Love</span>
              <p className="hidden text-[10px] font-bold uppercase tracking-widest text-primary md:block">Panel Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/catalogo"
              className="hidden items-center gap-1.5 rounded-full border border-surface-variant bg-surface px-4 py-2 text-sm font-semibold text-on-surface transition-all hover:bg-surface-variant hover:shadow-sm md:inline-flex"
            >
              <Icon name="storefront" className="text-base" />
              Ver catálogo
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-2xl px-4 pt-6 md:px-8">
        {/* ── Hero Banner ────────────────────────────────── */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-surface-variant bg-surface-container-low shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary-container/20" aria-hidden />
          <div className="relative px-5 py-5 md:px-8 md:py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-surface px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary md:px-3 md:py-1 md:text-xs">
                  <Icon name="auto_awesome" className="text-sm md:text-base" /> Gestión privada
                </p>
                <h1 className="font-headline text-2xl font-black text-on-surface md:text-4xl">
                  Gestiona tu catálogo
                </h1>
                <p className="mt-0.5 text-xs text-on-surface-variant md:mt-1 md:text-sm">
                  Añade, edita y organiza tus productos de resina.
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-pink-500 px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-95 md:inline-flex"
              >
                <Icon name="add_circle" className="text-xl" />
                Nuevo producto
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 divide-x divide-surface-variant border-t border-surface-variant">
            <StatCard icon="inventory_2" label="Productos" value={stats.total} />
            <StatCard icon="category" label="Categorías" value={stats.categories} accent="text-secondary" />
            <StatCard icon="check_circle" label="Disponibles" value={stats.available} accent="text-green-600" />
            <StatCard icon="star" label="Destacados" value={stats.featured} accent="text-amber-500" />
          </div>
        </section>

        {/* ── Search + Filters ───────────────────────────── */}
        <section className="mb-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o categoría..."
              className="w-full rounded-2xl border border-surface-variant bg-surface-container-low py-3.5 pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              >
                <Icon name="close" className="text-base" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                  activeCategory === cat
                    ? "border-primary bg-primary text-on-primary shadow-md shadow-primary/20"
                    : "border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-variant",
                )}
              >
                {cat}
                {cat !== "Todos" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({products.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── Results Count ─────────────────────────────── */}
        {(searchQuery || activeCategory !== "Todos") && filteredProducts.length > 0 && (
          <p className="mb-3 text-xs font-semibold text-on-surface-variant">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
            {activeCategory !== "Todos" && ` en ${activeCategory}`}
            {searchQuery && ` · "${searchQuery}"`}
          </p>
        )}

        {/* ── Products Grid ──────────────────────────────── */}
        <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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
                <AdminProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Empty State ────────────────────────────────── */}
        {filteredProducts.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-variant text-4xl">
              {searchQuery ? "🔍" : "🌺"}
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface">
              {searchQuery ? "Sin resultados" : "No hay productos"}
            </h3>
            <p className="mt-2 max-w-xs text-on-surface-variant">
              {searchQuery
                ? `No encontramos productos que coincidan con "${searchQuery}".`
                : "Empieza añadiendo tu primer producto al catálogo."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-pink-500 px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/25 transition-transform active:scale-95"
              >
                <Icon name="add_circle" className="text-xl" />
                Crear producto
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── FAB mobile ────────────────────────────────────── */}
      <button
        onClick={handleCreate}
        className="admin-fab fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500 text-on-primary shadow-2xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95 md:hidden"
        aria-label="Nuevo producto"
      >
        <Icon name="add" className="text-3xl" />
      </button>

      {/* ── Product Form Modal ──────────────────────────── */}
      <AdminProductForm
        isOpen={formOpen}
        product={editingProduct}
        categories={existingCategories}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </main>
  );
}
