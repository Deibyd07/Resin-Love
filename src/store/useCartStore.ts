import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  customization?: {
    color?: string;
    letter?: string;
  };
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if item exactly matches an existing one (including customization)
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.id === item.id &&
              JSON.stringify(i.customization) === JSON.stringify(item.customization)
          );

          if (existingItemIndex > -1) {
            // Immutable update
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity || 1;
            return { items: newItems };
          }

          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "resin-love-cart",
    }
  )
);
