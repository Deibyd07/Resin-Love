import type { Metadata } from "next";

import { featuredProducts } from "@/features/landing/data/landing-content";
import { MobileHome } from "@/features/landing/components/mobile-home";
import { getSiteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Catálogo de productos en resina",
  description:
    "Explora el catálogo de Resin Love con piezas artesanales en resina: bandejas, accesorios y opciones personalizadas.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const siteUrl = getSiteUrl();
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo Resin Love",
    itemListElement: featuredProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: `Producto artesanal en resina: ${product.name}`,
        image: product.imageUrl,
        category: "Resina artesanal",
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "COP",
          availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: siteUrl,
        },
      },
    })),
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Resin Love",
    url: siteUrl,
    sameAs: [siteUrl],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <MobileHome />
    </>
  );
}
