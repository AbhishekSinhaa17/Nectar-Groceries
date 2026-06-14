import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon, SlidersHorizontal, X, Clock, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { ProductCard } from "@/components/shared/ProductCard";
import { SearchSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_app/search")({
  head: () => ({
    meta: [
      { title: "Search — Nectar" },
      { name: "description", content: "Search the Nectar grocery store." },
    ],
  }),
  component: SearchPage,
});

const TRENDING_SEARCHES = ["Organic Bananas", "Fresh Milk", "Whole Wheat Bread", "Eggs", "Avocado"];

function SearchPage() {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(input, 500);

  const isSearching = input !== debouncedQuery; // True while waiting for debounce

  useEffect(() => {
    if (products.length === 0) void fetchProducts();
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (debouncedQuery.trim() && !isSearching) {
      addRecentSearch(debouncedQuery);
    }
  }, [debouncedQuery, isSearching, addRecentSearch]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return products.filter((p) => p.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
  }, [products, debouncedQuery]);

  const suggestions = useMemo(() => {
    if (!input.trim() || input === debouncedQuery) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5)
      .map((p) => p.name);
  }, [products, input, debouncedQuery]);

  const handleSelectSearch = (query: string) => {
    setInput(query);
    setIsFocused(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-8 pb-24">
      <div className="flex items-center gap-3 relative z-20">
        <div className="flex h-14 flex-1 items-center gap-2 rounded-2xl bg-[#F2F3F2] px-4 border border-transparent focus-within:border-[#53B175] transition-colors shadow-sm">
          <SearchIcon className="h-5 w-5 text-[#181725]" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search store"
            className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[#7C7C7C] text-[#181725]"
          />
          {input && (
            <button
              onClick={() => {
                setInput("");
              }}
              aria-label="Clear"
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <X className="h-4 w-4 text-[#7C7C7C]" />
            </button>
          )}
        </div>
        <button
          aria-label="Filter"
          className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F2F3F2] hover:bg-[#E2E2E2] transition shadow-sm"
        >
          <SlidersHorizontal className="h-5 w-5 text-[#181725]" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isFocused && !debouncedQuery && !input && (
          <motion.div
            key="idle-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 space-y-8"
          >
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#181725]">Recent Searches</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm font-semibold text-red-500 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleSelectSearch(query)}
                      className="flex items-center gap-1.5 rounded-full border border-[#E2E2E2] bg-white px-4 py-2 text-sm font-medium text-[#7C7C7C] hover:bg-[#F2F3F2] transition"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {query}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-lg font-bold text-[#181725] mb-3">Trending Searches</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleSelectSearch(query)}
                    className="flex items-center gap-1.5 rounded-full border border-[#E2E2E2] bg-white px-4 py-2 text-sm font-medium text-[#53B175] hover:bg-[#53B175]/5 transition"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {query}
                  </button>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {isFocused && input && suggestions.length > 0 && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-4 right-20 z-30 mt-2 rounded-2xl border border-[#E2E2E2] bg-white shadow-xl overflow-hidden"
          >
            <ul className="py-2">
              {suggestions.map((sug) => (
                <li key={sug}>
                  <button
                    onClick={() => handleSelectSearch(sug)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-[#181725] hover:bg-[#F2F3F2] flex items-center gap-3"
                  >
                    <SearchIcon className="h-4 w-4 text-[#7C7C7C]" />
                    {sug}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {input && (
          <motion.div
            key="results-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            {isSearching ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E2E2E2] border-t-[#53B175] mb-4" />
                <p className="text-sm font-semibold text-[#7C7C7C]">Searching...</p>
              </div>
            ) : isLoading ? (
              <SearchSkeleton />
            ) : error ? (
              <ErrorState title="Search failed" description={error} onRetry={fetchProducts} />
            ) : results.length === 0 ? (
              <EmptyState
                title="No products found"
                description={`We couldn't find anything matching "${debouncedQuery}"`}
                icon={<SearchIcon className="h-10 w-10" />}
                actionLabel="Clear Search"
                onAction={() => handleSelectSearch("")}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
