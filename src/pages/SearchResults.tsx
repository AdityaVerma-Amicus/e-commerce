import { useSearchParams } from "react-router-dom";

import ProductListing from "../components/ProductListing/ProductListing";
import PageContainer from "../components/Layout/PageContainer/PageContainer";

import { useCart } from "../hooks/useCart";

function SearchResults() {
    const [searchParams] = useSearchParams();

    const { addItem } = useCart();

    const searchQuery =
        searchParams.get("q") ?? "";

    return (
        <main>
            <PageContainer>
                <ProductListing
                    initialSearch={searchQuery}
                    onAddToCart={addItem}
                />
            </PageContainer>
        </main>
    );
}

export default SearchResults;