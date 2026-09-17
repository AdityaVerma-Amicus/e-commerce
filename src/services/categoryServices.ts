const CATEGORIES_API_URL =
    "https://dummyjson.com/products/category-list";

export async function fetchCategories(
    signal: AbortSignal
): Promise<string[]> {

    const response = await fetch(
        CATEGORIES_API_URL,
        {
            signal,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    const categories: string[] =
        await response.json();

    return categories;
}