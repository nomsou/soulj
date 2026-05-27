import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  priceNGN: number;
  priceUSD: number;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  currency: "NGN" | "USD";
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: "NGN" | "USD") => void;
  total: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: "NGN",

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          }));
        } else {
          set((s) => ({
            items: [...s.items, { ...item, quantity: 1 }],
          }));
        }
      },

      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

      setCurrency: (currency) => set({ currency }),

      total: () => {
        const { items, currency } = get();
        return items.reduce(
          (sum, i) =>
            sum + (currency === "NGN" ? i.priceNGN : i.priceUSD) * i.quantity,
          0,
        );
      },
    }),
    { name: "soulj-cart" },
  ),
);
