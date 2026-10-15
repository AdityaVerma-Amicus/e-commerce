import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import type { ProductApiResponse } from "../../data/products";
import useFetch from "../../hooks/useFetch";
import { useCart } from "../../hooks/useCart";
import { mapApiProductToProduct } from "../../utils/productMapper";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import SEO from "../../components/SEO/SEO";

function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  const { data, loading, error } = useFetch<ProductApiResponse>(
    `https://dummyjson.com/products/${id}`,
  );

  if (loading) {
    return (
      <PageContainer>
        <main
          className="flex min-h-100 items-center justify-center"
          aria-busy="true"
          aria-live="polite"
        >
          <p className="text-text-secondary">Loading product...</p>
        </main>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <main className="flex min-h-100 items-center justify-center">
          <p className="text-text-secondary" role="alert">
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
          <p className="text-text-secondary">Product not found.</p>
        </main>
      </PageContainer>
    );
  }

  const product = mapApiProductToProduct(data);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <>
      <SEO
        title={`${product.name} | E-Commerce`}
        description={`Explore ${product.name}, priced at $${product.price}. View product details and add it to your cart.`}
        canonicalPath={`/products/${id}`}
        structuredData={[
          {
            "@type": "Product",
            name: product.name,
            description: data.description,
            image: [product.image],
            sku: product.sku,
            category: product.category,
            url: `https://e-commerce-orpin-pi-23.vercel.app/products/${id}`,
            offers: {
              "@type": "Offer",
              url: `https://e-commerce-orpin-pi-23.vercel.app/products/${id}`,
              priceCurrency: "USD",
              price: product.price.toFixed(2),
              availability:
                data.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://e-commerce-orpin-pi-23.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Shop Products",
                item: "https://e-commerce-orpin-pi-23.vercel.app/products",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: `https://e-commerce-orpin-pi-23.vercel.app/products/${id}`,
              },
            ],
          },
        ]}
      />

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
              <div className="mb-4 flex gap-2" aria-label="Product badges">
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
                role="img"
                aria-label={`Rating: ${product.rating} out of 5`}
              >
                {Array.from({ length: product.rating }).map((_, index) => (
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
                  Quantity
                </label>

                <input
                  id="product-quantity"
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={quantity}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    if (Number.isInteger(value) && value >= 1) {
                      setQuantity(value);
                    }
                  }}
                  className="w-16 rounded border border-border p-2 text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
                />
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded border border-primary bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text md:w-60"
              >
                <ShoppingCart size={18} aria-hidden="true" />
                ADD TO CART
              </button>
            </div>
          </div>
        </main>
      </PageContainer>
    </>
  );
}

export default ProductDetail;
