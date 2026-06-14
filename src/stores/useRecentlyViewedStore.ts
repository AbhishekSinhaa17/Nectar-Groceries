import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface RecentlyViewedState {
  viewedItems: Product[];
  addViewedProduct: (product: Product) => void;
  clearViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      viewedItems: [],
      addViewedProduct: (product) =>
        set((state) => {
          const filtered = state.viewedItems.filter((p) => p.id !== product.id);
          return {
            viewedItems: [product, ...filtered].slice(0, 15),
          };
        }),
      clearViewed: () => set({ viewedItems: [] }),
    }),
    {
      name: "nectar-recently-viewed",
    },
  ),
);
