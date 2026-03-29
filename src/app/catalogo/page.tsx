import { Suspense } from "react";

import { CatalogView } from "@/features/catalog/components/catalog-view";
import { getProducts } from "@/lib/supabase/queries";

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<main className="min-h-screen bg-surface" />}>
      <CatalogView products={products} />
    </Suspense>
  );
}
