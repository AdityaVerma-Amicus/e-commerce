import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import type { ProductApiResponse } from "../../data/products";
import useFetch from "../../hooks/useFetch";
import { useCart } from "../../hooks/useCart";
import { mapApiProductToProduct } from "../../utils/productMapper";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";

function ProductDetail() {
    const { id } = useParams();
    const { addItem } = useCart();

    const [quantity, setQuantity] = useState(1);

    const {
        data,
        loading,
        error,
    } = useFetch<ProductApiResponse>(
        `https://dummyjson.com/products/${id}`,
    );

    if (loading) {
        return (
            <PageContainer>
                <main className="flex min-h-100 items-center justify-center">
                    <p className="text-text-secondary">
                        Loading product...
                    </p>
                </main>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <main className="flex min-h-100 items-center justify-center">
                    <p className="text-text-secondary">
                        {error}
                    </p>
                </main>
            </PageContainer>
        );
    }

    if (!data) {
        return (
            <PageContainer>
                <main className="flex min-h-100 items-center justify-center">
                    <p className="text-text-secondary">
                        Product not found.
                    </p>
                </main>
            </PageContainer>
        );
    }

    const product = mapApiProductToProduct(data);

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    return (
        <PageContainer>
            <main className="py-8">
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Product Image */}
                    <div className="flex min-h-100 items-center justify-center rounded-md border border-border bg-background p-8">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-96 max-w-full object-contain"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col">

                        <div className="mb-4 flex gap-2">
                            {product.isSale && (
                                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                                    SALE
                                </span>
                            )}

                            {product.isNew && (
                                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                                    NEW
                                </span>
                            )}
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-text">
                            {product.name}
                        </h1>

                        <p className="mb-2 text-sm text-text-secondary">
                            SKU: {product.sku}
                        </p>

                        {/* Rating */}
                        <div
                            className="mb-5 flex items-center gap-1"
                            aria-label={`Rating: ${product.rating} out of 5`}
                        >
                            {Array.from({
                                length: product.rating,
                            }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={18}
                                    strokeWidth={2}
                                    fill="currentColor"
                                    className="text-rating"
                                    aria-hidden="true"
                                />
                            ))}
                        </div>

                        <p className="mb-6 text-3xl font-bold text-primary">
                            ${product.price}
                        </p>

                        {/* Quantity */}
                        <div className="mb-5 flex items-center gap-3">
                            <label
                                htmlFor="product-quantity"
                                className="text-sm font-bold text-text"
                            >
                                QTY
                            </label>

                            <input
                                id="product-quantity"
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(
                                        Math.max(
                                            1,
                                            Number(event.target.value),
                                        ),
                                    )
                                }
                                className="w-16 rounded border border-border p-2 text-center text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Add to Cart */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex w-full items-center justify-center gap-2 rounded border border-primary bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:border-primary-hover hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:w-60"
                        >
                            <ShoppingCart
                                size={18}
                                aria-hidden="true"
                            />

                            ADD TO CART
                        </button>
                    </div>
                </div>
            </main>
        </PageContainer>
    );
}

export default ProductDetail;