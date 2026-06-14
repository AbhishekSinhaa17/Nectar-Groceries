export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E2E2] bg-white p-4">
      <div className="h-28 animate-pulse rounded-xl bg-gray-200" />
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E2E2] p-6 bg-gray-50/50">
      <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />
      <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <li className="flex gap-4 py-4">
      <div className="h-20 w-20 animate-pulse rounded-xl bg-gray-200 shrink-0" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-2 w-full">
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200 shrink-0" />
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </li>
  );
}

export function OrderSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E2E2] p-5 shadow-sm">
      <div className="flex items-start justify-between border-b border-[#E2E2E2] pb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="space-y-1">
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl pb-32 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-8 lg:pb-12">
      <div className="bg-[#F2F3F2] h-64 lg:h-[500px] animate-pulse rounded-b-3xl lg:rounded-3xl" />
      <div className="px-6 pt-6 lg:pt-0 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-12 w-32 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-2 border-t border-[#E2E2E2] pt-6">
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <div className="flex-1 space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E2E2] p-6 space-y-4">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-gray-200" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="w-full lg:w-[400px]">
        <div className="rounded-2xl border border-[#E2E2E2] p-6 space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-8 w-full animate-pulse rounded bg-gray-200 mt-4" />
          <div className="h-14 w-full animate-pulse rounded-full bg-gray-200 mt-6" />
        </div>
      </div>
    </div>
  );
}
