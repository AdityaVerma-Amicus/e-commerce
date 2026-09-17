import ProductListing from "../components/ProductListing/ProductListing";
import PageContainer from "../components/Layout/PageContainer/PageContainer";

import type { Product } from "../data/products";

interface SearchResultsProps {
    searchQuery: string;
    onAddToCart: (
        product: Product,
        quantity: number
    ) => void;
}

function SearchResults({
    searchQuery,
    onAddToCart,
}: SearchResultsProps) {
    return (
        <main>
            <PageContainer>
                <ProductListing
                    initialSearch={searchQuery}
                    onAddToCart={onAddToCart}
                />
            </PageContainer>
        </main>
    );
}

export default SearchResults;