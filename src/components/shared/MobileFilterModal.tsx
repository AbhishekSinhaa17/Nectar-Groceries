import { X } from "lucide-react";
import { CATEGORIES, BRANDS } from "@/data/mockData";
import { useFilterStore } from "@/store/useFilterStore";
import { ProductCategory } from "@/types";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILTER_BRANDS = BRANDS;

export function MobileFilterModal({ isOpen, onClose }: MobileFilterModalProps) {
  const {
    selectedCategories,
    selectedBrands,
    toggleCategory,
    toggleBrand,
  } = useFilterStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-center relative px-5 py-4 border-b border-[#E2E2E2]">
        <button
          onClick={onClose}
          className="absolute left-5 bg-transparent border-none cursor-pointer p-1"
        >
          <X className="h-5 w-5 text-[#181725]" />
        </button>
        <span className="text-lg font-bold text-[#181725]">Filters</span>
      </div>

      <div className="bg-[#F2F3F2] rounded-t-[20px] flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-lg font-semibold text-[#181725] mb-4">Categories</div>
          {CATEGORIES.map((c) => {
            const active = selectedCategories.includes(c.name);
            return (
              <div
                key={c.name}
                onClick={() => toggleCategory(c.name as ProductCategory)}
                className="flex items-center gap-2.5 mb-3.5 cursor-pointer"
              >
                <div
                  className={`w-[22px] h-[22px] rounded-md border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-[#53B175] bg-[#53B175]" : "border-[#B1B1B1] bg-white"
                  }`}
                >
                  {active && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[15px] font-medium ${
                    active ? "text-[#53B175]" : "text-[#181725]"
                  }`}
                >
                  {c.name}
                </span>
              </div>
            );
          })}

          <div className="text-lg font-semibold text-[#181725] mb-4 mt-6">Brand</div>
          {FILTER_BRANDS.map((b) => {
            const active = selectedBrands.includes(b);
            return (
              <div
                key={b}
                onClick={() => toggleBrand(b)}
                className="flex items-center gap-2.5 mb-3.5 cursor-pointer"
              >
                <div
                  className={`w-[22px] h-[22px] rounded-md border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-[#53B175] bg-[#53B175]" : "border-[#B1B1B1] bg-white"
                  }`}
                >
                  {active && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[15px] font-medium ${
                    active ? "text-[#53B175]" : "text-[#181725]"
                  }`}
                >
                  {b}
                </span>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 pb-8 shrink-0">
          <button
            onClick={onClose}
            className="block w-full h-14 rounded-[19px] bg-[#53B175] text-white text-[17px] font-semibold border-none cursor-pointer hover:bg-[#489d67] transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
