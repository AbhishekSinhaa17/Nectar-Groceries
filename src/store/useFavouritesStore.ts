import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface FavState {
  favourites: Product[];
  addFavourite: (p: Product) => void;
  removeFavourite: (id: string) => void;
  toggleFavourite: (p: Product) => void;
  isFavourite: (id: string) => boolean;
}

export const useFavouritesStore = create<FavState>()(
  persist(
    (set, get) => ({
      favourites: [],
      addFavourite: (p) =>
        set((s) =>
          s.favourites.some((f) => f.id === p.id) ? s : { favourites: [...s.favourites, p] },
        ),
      removeFavourite: (id) =>
        set((s) => ({ favourites: s.favourites.filter((f) => f.id !== id) })),
      toggleFavourite: (p) =>
        set((s) =>
          s.favourites.some((f) => f.id === p.id)
            ? { favourites: s.favourites.filter((f) => f.id !== p.id) }
            : { favourites: [...s.favourites, p] },
        ),
      isFavourite: (id) => get().favourites.some((f) => f.id === id),
    }),
    { name: "nectar-favourites" },
  ),
);
