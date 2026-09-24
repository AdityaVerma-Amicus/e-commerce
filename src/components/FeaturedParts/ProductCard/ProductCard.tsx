import { Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import type { Product } from "../../../data/products";

interface ProductCardProps {
    product: Product;
    onAddToCart: (
        product: Product,
        quantity: number
    ) => void;
}

function ProductCard({
    product,
    onAddToCart,
}: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex h-100 w-54 shrink-0 flex-col rounded-md border border-border bg-background p-3 pb-3 shadow-sm transition-shadow duration-200 hover:shadow-lg">

            <Link
                to={`/products/${product.id}`}
                className="block"
            >
                <div className="relative mb-2 flex h-30 w-full shrink-0 items-center justify-center overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="block h-30 w-36 max-w-full object-contain transition-transform duration-300 hover:scale-105"
                    />

                    {product.isSale && (
                        <span className="absolute right-0.5 top-1.5 z-10 rounded-full bg-primary px-2 py-1 text-[8px] font-bold leading-none tracking-wide text-white shadow-sm">
                            SALE
                        </span>
                    )}

                    {product.isNew && (
                        <span className="absolute -left-5 top-3 z-10 w-16 -rotate-45 bg-primary py-1 text-center text-[8px] font-bold leading-none tracking-tight text-white shadow-sm">
                            NEW
                        </span>
                    )}
                </div>

                <div className="flex flex-col items-center text-center">
                    <h3 className="mb-2 min-h-10 overflow-hidden text-sm font-semibold leading-tight text-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        {product.name}
                    </h3>

                    <p className="my-1.5 text-xl font-bold text-primary">
                        ${product.price}
                    </p>
                </div>
            </Link>

            <div className="flex flex-1 flex-col items-center text-center">

                <p className="mb-2 text-xs text-text-secondary">
                    SKU: {product.sku}
                </p>

                <div
                    className="mb-3 flex min-h-5 items-center justify-center gap-1"
                    aria-label={`Rating: ${product.rating} out of 5`}
                >
                    {Array.from({
                        length: product.rating,
                    }).map((_, index) => (
                        <Star
                            key={index}
                            size={16}
                            strokeWidth={2}
                            fill="currentColor"
                            className="text-rating"
                            aria-hidden="true"
                        />
                    ))}
                </div>

                <div className="mb-3 flex items-center justify-center gap-2">
                    <label
                        htmlFor={`quantity-${product.sku}`}
                        className="text-sm font-bold text-text"
                    >
                        QTY
                    </label>

                    <input
                        id={`quantity-${product.sku}`}
                        type="number"
                        value={quantity}
                        min={1}
                        onChange={(event) =>
                            setQuantity(
                                Math.max(
                                    1,
                                    Number(event.target.value),
                                ),
                            )
                        }
                        className="w-14 rounded border border-border p-1.5 text-center text-sm outline-none transition-shadow duration-200 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <button
                    type="button"
                    onClick={() =>
                        onAddToCart(product, quantity)
                    }
                    title="Click to add this product to your shopping cart"
                    className="mt-auto w-full rounded border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary-hover hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    ADD TO CART
                </button>
            </div>
        </div>
    );
}

export default ProductCard;