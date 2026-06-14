import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/helpers";
import { useState } from "react";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [pop, setPop] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setPop(true);
    window.setTimeout(() => setPop(false), 260);
  };

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="flex flex-col h-full rounded-2xl border border-[#E2E2E2] bg-white p-4 transition active:scale-95"
    >
      <div className="flex h-28 items-center justify-center shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-28 object-contain"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex-1">
        <h3 className="line-clamp-2 text-base font-bold text-[#181725] tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-[#7C7C7C]">{product.weight}, Price</p>
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#181725]">{formatPrice(product.price)}</span>
        <button
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className={`grid h-11 w-11 place-items-center rounded-[17px] bg-[#53B175] text-white transition hover:bg-[#53B175]/90 active:scale-90 ${pop ? "animate-badge-pop" : ""}`}
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>
    </Link>
  );
}
