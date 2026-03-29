"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useAnimationFrame, type Easing } from "framer-motion";

import { categories, featuredProducts, swatches, trustBadges, testimonials } from "@/features/landing/data/landing-content";
import { cn } from "@/lib/utils/cn";
import { ProductCard } from "@/features/catalog/components/product-card";
import { CartButton } from "@/components/ui/cart-button";

const heroImage = "/images/Fondo Hero.png";
const logoImage = "/images/logo-resin-love.png";
const heroHighlights = ["Hecho a mano", "Personalizable", "Envíos nacionales"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as Easing } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

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


/* ──────────────── INFINITE PRODUCT CAROUSEL ──────────────── */

const CARD_W = 280;
const GAP = 16;
const AUTO_SPEED = -40; // px per second

function InfiniteProductCarousel() {
  // 4 sets to ensure we have enough buffer to scroll seamlessly in both directions
  const items = [...featuredProducts, ...featuredProducts, ...featuredProducts, ...featuredProducts];
  
  const setWidth = featuredProducts.length * (CARD_W + GAP);
  const min = -setWidth * 2;
  const max = -setWidth;

  const x = useMotionValue(max);
  const [paused, setPaused] = useState(false);

  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  useAnimationFrame((_, delta) => {
    if (paused) return; // Handled by drag

    let currentX = x.get();
    currentX += (AUTO_SPEED * delta) / 1000;
    x.set(wrap(min, max, currentX));
  });

  return (
    <div
      className="overflow-hidden pb-14 pt-4 -mt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{ x, gap: GAP, width: "max-content" }}
        drag="x"
        dragMomentum={false}
        onDragStart={() => setPaused(true)}
        onDragEnd={() => {
          x.set(wrap(min, max, x.get()));
          setPaused(false);
        }}
      >
        {items.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} width={CARD_W} />
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */

import { useCartStore } from "@/store/useCartStore";
import { useCartUIStore } from "@/components/ui/cart-drawer";

export function MobileHome() {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartUIStore((state) => state.openCart);

  // Form State
  const [customPiece, setCustomPiece] = useState("Llavero Inicial");
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState(swatches[0].id);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      id: `custom-${Date.now()}`,
      name: customPiece,
      price: customPiece.includes("Placa") ? 35000 : 25000, // Estimated pricing
      imageUrl: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=400&auto=format&fit=crop", // generic custom image
      quantity: 1,
      customization: {
        letter: customText || "Sin texto",
        color: customColor,
      }
    });
    openCart();
  };

  return (
    <div className="bg-surface text-on-surface">
      {/* ── HEADER ── */}
      <header className="gradient-border-bottom sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-screen-2xl px-4 py-3.5 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon name="favorite" filled className="text-2xl text-pink-500" />
              <span className="translate-y-2 font-brand text-[30px] leading-none text-black md:text-[36px]">
                Resin Love
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CartButton className="text-pink-500 hover:bg-pink-50 text-slate-700" />
              
              <details className="group relative text-pink-500">
                <summary
                  className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full transition duration-300 hover:bg-pink-50 hover:scale-110 hover:drop-shadow-[0_0_5px_#fe7faa] active:scale-95"
                  aria-label="Menú"
                >
                  <Icon name="menu" className="text-2xl" />
                </summary>

              <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-pink-100 bg-white/95 p-4 shadow-2xl backdrop-blur-lg">
                <nav className="mb-4 flex flex-col gap-1 border-b border-pink-100 pb-4">
                  <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-pink-50 hover:text-pink-600">
                    <Icon name="home" /> Inicio
                  </Link>
                  <Link href="/catalogo" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-pink-50 hover:text-pink-600">
                    <Icon name="grid_view" /> Catálogo
                  </Link>
                  <Link href="/favoritos" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-pink-50 hover:text-pink-600">
                    <Icon name="favorite" /> Mis Favoritos
                  </Link>
                </nav>
                
                <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Categorías</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category, index) => (
                    <Link
                      href={`/catalogo?cat=${encodeURIComponent(category.label)}`}
                      key={category.id}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-center text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center",
                        index === 0
                          ? "border border-pink-300 bg-pink-100/60 text-pink-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                      )}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[62dvh] min-h-[480px] w-full md:h-[70dvh] lg:h-[78dvh]">
          <Image
            src={heroImage}
            alt="Arte en resina con brillos"
            fill
            priority
            className="object-cover opacity-85"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/8 to-background/90" />
          <div className="pointer-events-none absolute inset-x-0 top-[8%] z-[1] flex justify-center">
            <motion.div
              className="relative h-[20rem] w-[22rem] md:h-[26rem] md:w-[28rem] lg:h-[30rem] lg:w-[32rem]"
              animate={{ y: [0, -10, 0], scale: [1, 1.02, 1], rotate: [0, 0.5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-6 rounded-full bg-black/15 blur-3xl" />
              <div className="absolute inset-10 rounded-full bg-white/20 blur-2xl" />
              <Image
                src={logoImage}
                alt="Logo Resin Love"
                fill
                className="object-contain contrast-125 saturate-125 drop-shadow-[0_14px_34px_rgba(255,105,180,0.45)]"
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 384px, 448px"
              />
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <motion.div
          className="relative z-10 -mt-44 px-4 pb-8 md:-mt-48 md:px-6 lg:-mt-52 lg:px-8"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <div className="glass-card mx-auto max-w-xl rounded-3xl border border-white/50 p-6 shadow-2xl md:mx-0 md:max-w-2xl md:p-8 lg:p-10">
            <motion.div variants={fadeIn} className="mb-5 flex flex-wrap gap-2">
              {heroHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-slate-600 shadow-sm"
                >
                  {highlight}
                </span>
              ))}
            </motion.div>

            <motion.h1 variants={fadeUp} className="mb-3 font-headline text-[2.4rem] font-black leading-[1.1] md:text-5xl lg:text-6xl">
              Arte que <span className="shimmer-text">Brilla</span> Contigo
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-7 max-w-xl text-[15px] font-medium leading-relaxed text-on-surface-variant">
              Piezas únicas hechas a mano con amor y magia en cada detalle.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-full bg-gradient-to-r from-primary to-pink-500 py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40 md:w-auto md:px-8"
              >
                Explorar Colección
              </motion.button>

              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span>⭐ 4.9</span>
                <span className="text-slate-300">•</span>
                <span>+120 pedidos entregados</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
        <div className="flex items-center justify-around rounded-2xl border border-pink-100/60 bg-white/60 px-3 py-4 shadow-sm backdrop-blur-sm">
          {trustBadges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center gap-1.5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary-container/15">
                <Icon name={badge.iconName} filled className="text-xl text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8 md:px-6 lg:px-8">
        <h2 className="mb-5 font-headline text-2xl font-black md:text-3xl">Categorías ✨</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              whileTap={{ scale: 0.96 }}
              className="cursor-pointer rounded-2xl bg-surface-container-low p-4 shadow-sm transition-shadow duration-300 hover:shadow-md active:shadow-inner"
            >
              <div className="flex flex-col items-center justify-center gap-3 py-2 text-center">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl md:h-16 md:w-16 transition-transform duration-200",
                    category.tone === "primary" && "bg-primary-container/25",
                    category.tone === "secondary" && "bg-secondary-container/25",
                    category.tone === "tertiary" && "bg-tertiary-container/25",
                    category.tone === "error" && "bg-error-container/25",
                  )}
                >
                  <Icon
                    name={category.iconName}
                    filled={category.iconFilled}
                    className={cn(
                      "text-3xl",
                      category.tone === "primary" && "text-primary",
                      category.tone === "secondary" && "text-secondary",
                      category.tone === "tertiary" && "text-tertiary",
                      category.tone === "error" && "text-error",
                    )}
                  />
                </div>
                <span className="text-sm font-bold md:text-base">{category.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="rounded-t-[2rem] bg-surface-container-low py-10">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-headline text-3xl font-black md:text-4xl">Lo más Nuevo</h2>
            <button className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20">
              Ver Todo
            </button>
          </div>
        </div>

        <InfiniteProductCarousel />
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-surface-container-low px-4 pb-10 pt-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <h2 className="mb-5 text-center font-headline text-2xl font-black">Lo que dicen 💬</h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="min-w-[260px] max-w-[280px] flex-shrink-0 rounded-2xl border border-white/50 bg-white/70 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-2 flex gap-0.5 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-sm">⭐</span>
                  ))}
                </div>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">&quot;{t.text}&quot;</p>
                <p className="text-xs font-bold text-slate-800">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZATION FORM ── */}
      <section className="mx-auto max-w-screen-2xl px-4 py-12 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-pink-50/50 to-secondary-container/20 p-6 md:p-8 lg:p-10">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-secondary-container/25 blur-3xl" />

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 font-headline text-3xl font-black"
          >
            Crea tu <span className="text-primary">Magia</span>
          </motion.h2>
          <p className="mb-7 text-sm leading-relaxed text-on-surface-variant">
            Personaliza cada detalle: colores, escarchas y accesorios.
          </p>

          <form className="relative z-10 space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0" onSubmit={handleCustomSubmit}>
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold">¿Qué pieza quieres?</label>
              <select 
                value={customPiece}
                onChange={(e) => setCustomPiece(e.target.value)}
                className="w-full rounded-xl border-0 bg-surface-container-highest px-5 py-3.5 text-sm shadow-inner focus:ring-2 focus:ring-primary/30"
              >
                <option>Llavero Inicial</option>
                <option>Placa Mascota</option>
                <option>Separador de Libros</option>
                <option>Portavasos</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold">Texto o Inicial</label>
              <input
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full rounded-xl border-0 bg-surface-container-highest px-5 py-3.5 text-sm shadow-inner focus:ring-2 focus:ring-primary/30"
                placeholder="Ej: M o Luna"
                type="text"
                maxLength={15}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="ml-1 text-sm font-bold">Tono Principal</label>
              <div className="no-scrollbar flex gap-3 overflow-x-auto py-2">
                {swatches.map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setCustomColor(swatch.id)}
                    className={cn(
                      "h-12 w-12 flex-shrink-0 rounded-full border-[3px] border-white shadow-md transition-all duration-200 active:scale-90",
                      swatch.className,
                      customColor === swatch.id && "ring-2 ring-primary ring-offset-2",
                    )}
                    aria-label={`Color ${swatch.id}`}
                  />
                ))}
              </div>
            </div>

            <div className="preview-glow rounded-2xl border border-white/50 bg-white/60 p-5 text-center backdrop-blur-sm md:col-span-1">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Vista Previa</p>
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 text-4xl font-black text-white shadow-lg shadow-pink-400/30">
                {customText.charAt(0).toUpperCase() || "M"}
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-on-surface-variant">Los colores y brillos pueden variar</p>
            </div>

            <div className="md:col-span-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-full bg-gradient-to-r from-primary to-pink-500 py-4 font-bold text-on-primary shadow-xl shadow-primary/25 transition-shadow hover:shadow-2xl md:w-auto md:px-8"
              >
                Añadir al Carrito
              </motion.button>
            </div>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-4 rounded-t-[3rem] bg-pink-50/80 px-4 pb-10 pt-2 text-center backdrop-blur-md md:px-6 lg:px-8">
        <div className="space-y-2">
          <div className="relative mx-auto mb-1 h-44 w-48 overflow-hidden md:h-52 md:w-56">
            <Image src={logoImage} alt="Logo Resin Love" fill className="scale-[1.35] object-contain" sizes="(max-width: 768px) 192px, 224px" />
          </div>
          <p className="font-brand text-[38px] leading-none text-black">Resin Love</p>
          <p className="text-sm italic text-pink-600">Hecho a mano en Valle del Cauca, Colombia 💕</p>
        </div>

        <div className="mx-auto mt-6 h-px w-3/4 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

        <div className="mx-auto mt-6 w-full max-w-xs">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Únete a la Magia</p>
          <div className="relative">
            <input
              className="w-full rounded-full border-0 bg-white px-5 py-3.5 text-sm shadow-sm focus:ring-2 focus:ring-pink-300"
              placeholder="Tu email mágico..."
              type="email"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-gradient-to-r from-primary to-pink-500 px-4 text-on-primary shadow-sm"
              aria-label="Enviar email"
            >
              <Icon name="send" className="text-base" />
            </motion.button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6 text-slate-500">
          <a
            href="#"
            aria-label="Instagram"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-pink-500 hover:shadow-md active:scale-90"
          >
            <Icon name="camera" className="text-2xl" />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-pink-500 hover:shadow-md active:scale-90"
          >
            <Icon name="play_circle" className="text-2xl" />
          </a>
          <a
            href="#"
            aria-label="WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-emerald-500 hover:shadow-md active:scale-90"
          >
            <Icon name="chat" filled className="text-2xl" />
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
          <a href="#" className="transition-colors hover:text-pink-500">Instagram</a>
          <a href="#" className="transition-colors hover:text-pink-500">TikTok</a>
          <a href="#" className="transition-colors hover:text-pink-500">WhatsApp</a>
          <a href="#" className="transition-colors hover:text-pink-500">Newsletter</a>
        </div>

        <p className="mt-6 text-[10px] text-slate-300">© 2026 Resin Love. Todos los derechos reservados.</p>
      </footer>

      {/* ── FLOATING ACTION BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="pulse-glow iridescent-bg flex h-14 w-14 items-center justify-center rounded-full text-on-primary"
          aria-label="Soporte"
        >
          <Icon name="chat_bubble" filled className="text-3xl" />
        </motion.button>
      </div>
    </div>
  );
}
