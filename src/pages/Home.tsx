import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import FeaturedParts from "../components/FeaturedParts/FeaturedParts";
import PopularCategories from "../components/PopularCategories/PopularCategories";
import PageContainer from "../components/Layout/PageContainer/PageContainer";

import type { Product } from "../data/products";

interface HomeProps {
    onSearch: (query: string) => void;
    onAddToCart: (
        product: Product,
        quantity: number
    ) => void;
}

function Home({
    onSearch,
    onAddToCart,
}: HomeProps) {
    return (
        <>
            <Hero onSearch={onSearch} />

            <main>
                <PageContainer>
                    <Categories />

                    <FeaturedParts
                        onAddToCart={onAddToCart}
                    />

                    <PopularCategories />
                </PageContainer>
            </main>
        </>
    );
}

export default Home;