import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import ProductListing from "../components/ProductListing/ProductListing";
import PageContainer from "../components/Layout/PageContainer/PageContainer";

import { useCart } from "../hooks/useCart";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const { addItem } = useCart();

  const handleAddToCart = useCallback(
    (product: Parameters<typeof addItem>[0], quantity: number) => {
      addItem(product, quantity);
    },
    [addItem],
  );

  const searchQuery = searchParams.get("q") ?? "";

  return (
    <main>
      <PageContainer>
        <ProductListing
          initialSearch={searchQuery}
          onAddToCart={handleAddToCart}
        />
      </PageContainer>
    </main>
  );
}

export default SearchResults;
