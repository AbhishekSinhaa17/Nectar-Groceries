import { Link } from "@tanstack/react-router";
import type { CategoryInfo } from "@/data/mockData";
import { slugify } from "@/utils/helpers";

interface Props {
  category: CategoryInfo;
  variant?: "vertical" | "horizontal";
}

export function CategoryCard({ category, variant = "vertical" }: Props) {
  const isHorizontal = variant === "horizontal";

  return (
    <Link
      to="/category/$name"
      params={{ name: slugify(category.name) }}
      className={`flex ${isHorizontal ? "flex-row gap-4 px-6 py-4" : "flex-col justify-center h-[180px] p-4"} items-center rounded-2xl border ${category.border || "border-[#E2E2E2]"} transition active:scale-95 ${category.bg}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className={`${isHorizontal ? "h-14 w-14" : "h-[90px] w-[110px]"} object-contain mix-blend-multiply`}
        loading="lazy"
      />
      <p className={`${!isHorizontal && "mt-6 text-center"} text-[15px] font-bold text-[#181725]`}>
        {category.name}
      </p>
    </Link>
  );
}
