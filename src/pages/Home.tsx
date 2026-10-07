import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import FeaturedParts from "../components/FeaturedParts/FeaturedParts";
import PopularCategories from "../components/PopularCategories/PopularCategories";
import PageContainer from "../components/Layout/PageContainer/PageContainer";

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
