import { create } from "zustand";
import { UniversalProduct } from "@/features/catalog/components/product-card";

interface ProductDrawerState {
  isOpen: boolean;
  selectedProduct: UniversalProduct | null;
  openDrawer: (product: UniversalProduct) => void;
  closeDrawer: () => void;
}

export const useProductDrawerStore = create<ProductDrawerState>((set) => ({
  isOpen: false,
  selectedProduct: null,

  openDrawer: (product) => set({ isOpen: true, selectedProduct: product }),
  
  closeDrawer: () => set({ isOpen: false, selectedProduct: null }),
}));
