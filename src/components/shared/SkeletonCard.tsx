export function SkeletonCard() {
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
