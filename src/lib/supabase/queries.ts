import { createSupabaseServerClient } from "./server";

export type DBProduct = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  imagen_url: string;
  descripcion: string | null;
  disponible: boolean;
  destacado: boolean;
  fecha_creacion: string;
};

function mapProductToUI(product: DBProduct) {
  return {
    id: product.id,
    name: product.nombre,
    category: product.categoria,
    tag: product.categoria, // Legacy support for featuredProducts
    description: product.descripcion ?? undefined,
    price: product.precio,
    imageUrl: product.imagen_url,
    available: product.disponible,
    isFeatured: product.destacado,
  };
}

export async function getProducts() {
  const supabase = await createSupabaseServerClient();
  
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (productos as DBProduct[]).map(mapProductToUI);
}

export async function getFeaturedProducts() {
  const supabase = await createSupabaseServerClient();
  
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .eq("destacado", true)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return (productos as DBProduct[]).map(mapProductToUI);
}
