import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        set((state) => {
          const filtered = state.recentSearches.filter(
            (q) => q.toLowerCase() !== trimmed.toLowerCase(),
          );
          return {
            recentSearches: [trimmed, ...filtered].slice(0, 5),
          };
        });
      },
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: "search-storage",
    },
  ),
);
