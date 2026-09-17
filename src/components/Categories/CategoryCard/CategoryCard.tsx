import "./CategoryCard.css";

interface CategoryCardProps {
    title: string;
    description: string;
    buttonText: string;
}

function CategoryCard({
    title,
    description,
    buttonText
}: CategoryCardProps) {
    return (
        <article className="category-card">
            <h3>{title}</h3>

            <p>{description}</p>

            <button type="button">
                {buttonText}
            </button>
        </article>
    );
}

export default CategoryCard;