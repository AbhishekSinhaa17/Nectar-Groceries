import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

const tabs = [
  { to: "/home", label: "Shop", icon: Home },
  { to: "/explore", label: "Explore", icon: Search },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/favourites", label: "Favourite", icon: Heart },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCartStore((s) => s.totalItems());

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.includes("/product/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E2E2E2] bg-white lg:hidden">
      <ul className="mx-auto flex max-w-3xl items-center justify-around px-2 pb-2 pt-2">
        {tabs.map((tab) => {
          const active = pathname === tab.to || (tab.to === "/home" && pathname === "/home");
          const Icon = tab.icon;
          return (
            <li key={tab.to} className="flex-1">
              <Link
                to={tab.to}
                className={`relative w-full flex flex-col items-center gap-1 py-1.5 text-[10px] sm:text-xs ${active ? "text-[#53B175]" : "text-[#181725]"}`}
              >
                <span className="relative">
                  <Icon className={`h-6 w-6 ${active ? "stroke-[#53B175]" : ""}`} />
                  {tab.to === "/cart" && mounted && count > 0 && (
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#53B175] px-1 text-[10px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </span>
                <span className="font-medium">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
