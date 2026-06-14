import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Heart } from "lucide-react";
import { useFavouritesStore } from "@/store/useFavouritesStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/helpers";
import { EmptyState } from "@/components/shared/EmptyState";

export const Route = createFileRoute("/_app/favourites")({
  head: () => ({
    meta: [
      { title: "Favourites — Nectar" },
      { name: "description", content: "Your favourite grocery items." },
    ],
  }),
  component: Favourites,
});

function Favourites() {
  const navigate = useNavigate();
  const favourites = useFavouritesStore((s) => s.favourites);
  const addItem = useCartStore((s) => s.addItem);

  const addAll = () => {
    favourites.forEach((p) => addItem(p));
    navigate({ to: "/cart" });
  };

  return (
    <>
      <div className="animate-page-in mx-auto max-w-3xl px-4 pt-6 pb-24 lg:px-8 lg:pb-8">
        <h1 className="border-b border-[#E2E2E2] pb-4 text-center text-xl font-bold text-[#181725]">
          Favourouite
        </h1>
        {favourites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Start exploring and heart your favorite items to see them here."
            icon={<Heart className="h-10 w-10" />}
            actionLabel="Browse store"
            onAction={() => navigate({ to: "/home" })}
          />
        ) : (
          <>
            <ul className="divide-y divide-[#E2E2E2]">
              {favourites.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="flex items-center gap-4 py-4"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-16 w-16 rounded-xl bg-transparent object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#181725]">{p.name}</p>
                      <p className="text-xs text-[#7C7C7C]">{p.weight}, Price</p>
                    </div>
                    <span className="font-bold text-[#181725]">{formatPrice(p.price)}</span>
                    <ChevronRight className="h-5 w-5 text-[#7C7C7C]" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden lg:block lg:pt-6">
              <button
                onClick={addAll}
                className="h-14 w-full rounded-full bg-[#53B175] font-semibold text-white transition active:scale-95"
              >
                Add All To Cart
              </button>
            </div>
          </>
        )}
      </div>

      {favourites.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-[#E2E2E2] bg-white p-4 lg:hidden">
          <button
            onClick={addAll}
            className="h-14 w-full rounded-full bg-[#53B175] font-semibold text-white transition active:scale-95"
          >
            Add All To Cart
          </button>
        </div>
      )}
    </>
  );
}
