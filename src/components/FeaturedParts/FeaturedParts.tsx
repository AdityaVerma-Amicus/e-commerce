import ProductCarousel from "../ProductCarousel/ProductCarousel";
import EmptyState from "../EmptyState/EmptyState";

import { useProducts } from "../../hooks/useProducts";

import type { Product } from "../../data/products";

const FEATURED_PRODUCT_COUNT = 12;

interface FeaturedPartsProps {
    onAddToCart: (
    product: Product,
    quantity: number
) => void;
}
function FeaturedParts({
    onAddToCart,
}: FeaturedPartsProps) {
    const {
        products,
        loading,
        error,
        refresh,
    } = useProducts(FEATURED_PRODUCT_COUNT);

    return (
        <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-text sm:text-3xl">
                        Featured Parts
                    </h2>

                    <p className="mt-2 text-sm text-text-secondary sm:text-base">
                        Explore our most popular construction parts
                    </p>
                </div>

                {error ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <p className="text-sm text-text-secondary">
                            Unable to load featured products.
                        </p>

                        <button
                            type="button"
                            onClick={() => refresh()}
                            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 && !loading ? (
                    <EmptyState />
                ) : (
                    <ProductCarousel
                        products={products}
                        loading={loading}
                        onAddToCart={onAddToCart}
                    />
                )}
            </div>
        </section>
    );
}

export default FeaturedParts;