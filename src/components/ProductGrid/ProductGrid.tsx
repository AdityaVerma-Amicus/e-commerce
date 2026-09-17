import ProductCard from "../FeaturedParts/ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCardSkeleton/ProductCardSkeleton";

import type { Product } from "../../data/products";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  onAddToCart: (
        product: Product,
        quantity: number
    ) => void;
}

function ProductGrid({
  products,
  loading = false,
  skeletonCount = 9,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-[13.5rem] justify-center gap-6 sm:grid-cols-[13.5rem_13.5rem] lg:grid-cols-[13.5rem_13.5rem_13.5rem]">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        : products.map((product) => (
            <ProductCard
              key={product.sku}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
    </div>
  );
}

export default ProductGrid;
