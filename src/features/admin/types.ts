export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  tag?: string;
  description?: string;
  price: number;
  imageUrl: string;
  available: boolean;
  isFeatured: boolean;
};
