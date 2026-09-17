function ProductCardSkeleton() {
  return (
    <article className="flex h-100 w-54 shrink-0 flex-col rounded-md border border-border bg-background p-3 pb-3 shadow-sm">
      {/* Image */}
      <div className="relative mb-2 flex h-30 w-full shrink-0 items-center justify-center overflow-hidden">
        <div className="h-30 w-36 max-w-full rounded bg-gray-200" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center text-center">
        {/* Product Name */}
        <div className="mb-2 h-10 w-full shrink-0 rounded bg-gray-200" />

        {/* Price */}
        <div className="my-1.5 h-6 w-28 shrink-0 rounded bg-gray-200" />

        {/* SKU */}
        <div className="mb-2 h-4 w-24 shrink-0 rounded bg-gray-200" />

        {/* Rating */}
        <div className="mb-3 h-5 w-28 shrink-0 rounded bg-gray-200" />

        {/* Quantity */}
        <div className="mb-3 h-8 w-24 shrink-0 rounded bg-gray-200" />

        {/* Button */}
        <div className="mt-auto h-9 w-full shrink-0 rounded bg-gray-200" />
      </div>
    </article>
  );
}

export default ProductCardSkeleton;