import { useEffect, useState } from "react";

import ProductGrid from "../ProductGrid/ProductGrid";
import Pagination from "../Pagination/Pagination";
import RadioOption from "../RadioOption/RadioOption";
import EmptyState from "../EmptyState/EmptyState";

import { useProducts } from "../../hooks/useProducts";
import useDebounce from "../../hooks/useDebounce";
import useFetch from "../../hooks/useFetch";

import { CATEGORIES_API_URL } from "../../services/categoryServices";

import type { Product } from "../../data/products";

const SORT_OPTIONS: Record<string, { sortBy: string; order: string }> = {
  "price-low-high": {
    sortBy: "price",
    order: "asc",
  },
  "price-high-low": {
    sortBy: "price",
    order: "desc",
  },
  "name-a-z": {
    sortBy: "title",
    order: "asc",
  },
  rating: {
    sortBy: "rating",
    order: "desc",
  },
};

const SORT_LABELS: Record<string, string> = {
  default: "Default",
  "price-low-high": "Price: Low to High",
  "price-high-low": "Price: High to Low",
  "name-a-z": "Name: A to Z",
  rating: "Rating",
};

interface ProductListingProps {
  initialSearch?: string;
  onAddToCart: (product: Product, quantity: number) => void;
}

const PRODUCT_PAGE_SIZE = 9;
const INITIAL_CATEGORY_COUNT = 7;

function ProductListing({
  initialSearch = "",
  onAddToCart,
}: ProductListingProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [sortOption, setSortOption] = useState("default");

  const [showAllCategories, setShowAllCategories] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  /*
   * Generic data fetching for categories.
   * useFetch handles:
   * - API request
   * - loading state
   * - error state
   * - AbortController
   * - cleanup
   * - refetch
   */
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch<string[]>(CATEGORIES_API_URL);

  const {
    products,
    loading,
    error,
    currentPage,
    totalResults,
    totalPages,
    goToPage,
    refresh,
  } = useProducts(PRODUCT_PAGE_SIZE);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      return;
    }

    refresh(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const getSortParams = () =>
    SORT_OPTIONS[sortOption] ?? {
      sortBy: "",
      order: "",
    };

  const refreshProducts = (
    search: string = searchTerm,
    category: string = selectedCategory,
  ) => {
    const { sortBy, order } = getSortParams();

    refresh(search, category === "all" ? "" : category, sortBy, order);
  };

  const handleSortChange = (value: string) => {
    const { sortBy, order } = SORT_OPTIONS[value] ?? {
      sortBy: "",
      order: "",
    };

    setSortOption(value);

    refresh(
      searchTerm,
      selectedCategory === "all" ? "" : selectedCategory,
      sortBy,
      order,
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    refreshProducts(searchTerm, value);
  };

  const categoryList = categories ?? [];

  const visibleCategories = showAllCategories
    ? categoryList
    : categoryList.slice(0, INITIAL_CATEGORY_COUNT);

  const startResult =
    totalResults === 0 ? 0 : (currentPage - 1) * PRODUCT_PAGE_SIZE + 1;

  const endResult = Math.min(currentPage * PRODUCT_PAGE_SIZE, totalResults);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Category Sidebar */}
        <aside className="h-fit rounded-lg border border-border bg-background p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="mb-5 text-lg font-bold tracking-wide text-text">
            CATEGORY
          </h2>

          <div>
            {/* All Categories */}
            <div className="mb-3">
              <RadioOption
                name="category"
                value="all"
                label="All Categories"
                checked={selectedCategory === "all"}
                onChange={handleCategoryChange}
              />
            </div>

            {/* Category Loading */}
            {categoriesLoading && (
              <p className="text-sm text-text-secondary">
                Loading categories...
              </p>
            )}

            {/* Category Error */}
            {!categoriesLoading && categoriesError && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">{categoriesError}</p>

                <button
                  type="button"
                  onClick={refetchCategories}
                  className="text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Category List */}
            {!categoriesLoading && !categoriesError && (
              <>
                <div
                  className={
                    showAllCategories
                      ? "max-h-64 space-y-3 overflow-y-auto pr-2"
                      : "space-y-3"
                  }
                >
                  {visibleCategories.map((category) => (
                    <RadioOption
                      key={category}
                      name="category"
                      value={category}
                      label={
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }
                      checked={selectedCategory === category}
                      onChange={handleCategoryChange}
                    />
                  ))}
                </div>

                {/* View All / Show Less */}
                {categoryList.length > INITIAL_CATEGORY_COUNT && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllCategories((previous) => !previous)
                    }
                    className="mt-4 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {showAllCategories ? "Show Less" : "View All"}
                  </button>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Product Content */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="mb-5 min-h-10">
            {!loading && !error && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Result Count */}
                <p className="text-sm text-text-secondary">
                  Showing {startResult}–{endResult} of {totalResults}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>

                {/* Sort + Refresh */}
                <div className="flex items-center gap-3">
                  <label htmlFor="sort-products" className="sr-only">
                    Sort products
                  </label>

                  <select
                    id="sort-products"
                    value={sortOption}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  >
                    {Object.entries(SORT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() =>
                      refreshProducts(searchTerm, selectedCategory)
                    }
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => refreshProducts(searchTerm, selectedCategory)}
                className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && <EmptyState />}

          {/* Product Grid */}
          {!error && (
            <ProductGrid
              products={products}
              loading={loading}
              skeletonCount={PRODUCT_PAGE_SIZE}
              onAddToCart={onAddToCart}
            />
          )}

          {/* Pagination */}
          {!error && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              disabled={loading}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductListing;
