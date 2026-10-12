import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import FeaturedParts from "../components/FeaturedParts/FeaturedParts";
import PopularCategories from "../components/PopularCategories/PopularCategories";
import PageContainer from "../components/Layout/PageContainer/PageContainer";
import SEO from "../components/SEO/SEO";

import { useCart } from "../hooks/useCart";

function Home() {
  const navigate = useNavigate();

  const { addItem } = useCart();

  const handleAddToCart = useCallback(
    (product: Parameters<typeof addItem>[0], quantity: number) => {
      addItem(product, quantity);
    },
    [addItem],
  );

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    navigate(`/products?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <>
      <SEO
        title="Home - E-Commerce"
        description="Welcome to our E-Commerce store. Discover a wide range of products and enjoy seamless shopping experience."
        canonicalPath="/"
      />
      
      <Hero onSearch={handleSearch} />

      <main>
        <PageContainer>
          <Categories />

          <FeaturedParts onAddToCart={handleAddToCart} />

          <PopularCategories />
        </PageContainer>
      </main>
    </>
  );
}

export default Home;
