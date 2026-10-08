import "./PopularCategories.css";
import { popularCategories } from "../../data/popularCategories";
import Container from "../Layout/PageContainer/PageContainer";

function PopularCategories() {
  return (
    <section className="popular-categories">
      <Container>
        <h2>POPULAR CATEGORIES</h2>

        <div className="popular-categories-list">
          {popularCategories.map((category) => (
            <button key={category} type="button">
              {category}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default PopularCategories;
