import { CatalogProduct } from "@/features/catalog/types";

export const mockProducts: CatalogProduct[] = [
  {
    id: "1",
    name: "Bandeja Mármol Rosa",
    description: "Bandeja decorativa para joyería o velas.",
    price: 85000,
    imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    available: true,
    category: "Decoración",
  },
  {
    id: "2",
    name: "Set Posavasos Ámbar",
    description: "Set de 4 posavasos con acabado brillante.",
    price: 65000,
    imageUrl: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop",
    available: true,
    category: "Hogar",
  },
  {
    id: "3",
    name: "Llavero Flor Secada",
    description: "Llavero personalizado con flor encapsulada.",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1200&auto=format&fit=crop",
    available: false,
    category: "Accesorios",
  },
];
