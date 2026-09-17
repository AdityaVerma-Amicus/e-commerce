import { useState } from "react";

import "./Hero.css";
import Container from "../Layout/PageContainer/PageContainer";
import ProductSearchBar from "../ProductSearchBar/ProductSearchBar";

interface HeroProps {
  onSearch: (query: string) => void;
}

function Hero({ onSearch }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <section className="hero">
      <Container>
        <div className="hero-content">
          <h1>FIND CONSTRUCTION PARTS</h1>

          <ProductSearchBar
            value={searchTerm}
            placeholder="Search construction parts..."
            onChange={setSearchTerm}
            onSearch={handleSearch}
            className="hero-search"
          />
        </div>
      </Container>
    </section>
  );
}

export default Hero;