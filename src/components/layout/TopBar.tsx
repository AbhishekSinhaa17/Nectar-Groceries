import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingCart, MapPin, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const linkCls = (active: boolean) =>
    `text-sm font-medium transition hover:text-[#53B175] ${active ? "text-[#53B175]" : "text-[#181725]"}`;

  return (
    <header className="sticky top-0 z-40 hidden border-b border-[#E2E2E2] bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8 py-4">
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-2xl">🥕</span>
          <span className="text-xl font-bold text-[#53B175]">nectar</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/home" className={linkCls(pathname === "/home")}>
            Shop
          </Link>
          <Link to="/explore" className={linkCls(pathname === "/explore")}>
            Explore
          </Link>
        </nav>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1 text-sm text-[#7C7C7C]">
            <MapPin className="h-4 w-4 text-[#53B175]" />
            {mounted && user?.location ? user.location : "Dhaka, Bansree"}
          </span>
          <Link to="/search" aria-label="Search">
            <Search className="h-5 w-5 text-[#181725]" />
          </Link>
          <Link to="/favourites" aria-label="Favourites">
            <Heart className="h-5 w-5 text-[#181725]" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-[#181725]" />
            {mounted && count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#53B175] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link to="/account" aria-label="Account">
            <User className="h-5 w-5 text-[#181725]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
