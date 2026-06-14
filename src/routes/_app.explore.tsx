import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { CategorySkeleton } from "@/components/shared/Skeletons";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Nectar" },
      {
        name: "description",
        content: "Explore grocery categories: fruits, dairy, beverages, meat, and more.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const isLoading = useDelayedLoading(1000);

  return (
    <div className="animate-page-in mx-auto max-w-7xl px-4 pt-6 pb-16 lg:pb-8 lg:px-8">
      <h1 className="text-center text-xl font-bold text-[#181725] lg:text-left lg:text-3xl">
        Find Products
      </h1>
      <Link
        to="/search"
        className="mt-6 flex h-14 items-center gap-2 rounded-2xl bg-[#F2F3F2] px-4"
      >
        <Search className="h-5 w-5 text-[#181725]" />
        <span className="text-sm text-[#7C7C7C]">Search Store</span>
      </Link>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
          : CATEGORIES.map((c) => <CategoryCard key={c.name} category={c} />)}
      </div>
    </div>
  );
}
