import { Star } from "lucide-react";
import type { ChangeEvent } from "react";
import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import type { Product } from "../../../data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      if (Number.isInteger(value) && value >= 1) {
        setQuantity(value);
      }
    },
    [],
  );

  const handleAddToCart = useCallback(() => {
    onAddToCart(product, quantity);
  }, [onAddToCart, product, quantity]);

  return (
    <div className="flex h-100 w-54 shrink-0 flex-col rounded-md border border-border bg-background p-3 pb-3 shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <Link
        to={`/products/${product.id}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
      >
        <div className="relative mb-2 flex h-30 w-full shrink-0 items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            width={144}
            height={120}
            loading="lazy"
            decoding="async"
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
        <p className="mb-2 text-xs text-text-secondary">SKU: {product.sku}</p>

        <div
          className="mb-3 flex min-h-5 items-center justify-center gap-1"
          role="img"
          aria-label={`Rating: ${product.rating} out of 5`}
        >
          {Array.from({ length: product.rating }).map((_, index) => (
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
            Quantity
          </label>

          <input
            id={`quantity-${product.sku}`}
            type="number"
            value={quantity}
            min={1}
            step={1}
            required
            onChange={handleQuantityChange}
            className="w-14 rounded border border-border p-1.5 text-center text-sm outline-none transition-shadow duration-200 focus-visible:border-primary-text focus-visible:ring-2 focus-visible:ring-primary-text/30"
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-auto w-full rounded border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
