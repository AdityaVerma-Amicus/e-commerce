import "./Categories.css";
import Container from "../layout/PageContainer/PageContainer";
import CategoryCard from "./CategoryCard/CategoryCard";
import { categories } from "../../data/categories";

function Categories() {
  return (
    <section className="categories">
      <Container>
        <h2>WHAT WE OFFER</h2>

        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              buttonText={category.buttonText}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Categories;
