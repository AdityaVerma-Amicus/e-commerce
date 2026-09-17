import { useEffect, useRef, useState } from "react";

import type { Product } from "../data/products";
import { fetchProducts } from "../services/productServices";
import { mapApiProductToProduct } from "../utils/productMapper";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
  totalPages: number;
  goToPage: (page: number) => void;
  refresh: (
    searchTerm?: string,
    category?: string,
    sortBy?: string,
    order?: string,
  ) => void;
}

interface CachedPage {
  products: Product[];
  hasMore: boolean;
}

export function useProducts(pageSize: number): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const filtersRef = useRef({
    searchTerm: "",
    category: "",
    sortBy: "",
    order: "",
  });

  const pageCacheRef = useRef<Map<number, CachedPage>>(new Map());

  const filterCategorySearch = (
    products: Product[],
    searchTerm: string,
  ): Product[] => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedSearch),
    );
  };

  const loadPage = async (
    page: number,
    searchTerm: string,
    category: string,
    sortBy: string,
    order: string,
    requestId: number,
  ) => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const cachedPage = pageCacheRef.current.get(page);

      if (cachedPage) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setProducts(cachedPage.products);
        setCurrentPage(page);
        setHasMore(cachedPage.hasMore);

        return;
      }

      if (!category || !searchTerm.trim()) {
        const skip = (page - 1) * pageSize;

        const response = await fetchProducts(
          controller.signal,
          searchTerm,
          category,
          sortBy,
          order,
          pageSize,
          skip,
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        const transformedProducts = response.products.map(
          mapApiProductToProduct,
        );

        const pageHasMore = response.skip + response.limit < response.total;

        pageCacheRef.current.set(page, {
          products: transformedProducts,
          hasMore: pageHasMore,
        });

        setTotalResults(response.total);
        setProducts(transformedProducts);
        setCurrentPage(page);
        setHasMore(pageHasMore);

        return;
      }

      let matchingProducts: Product[] = [];
      let currentSkip = 0;
      let moreProductsAvailable = true;

      while (moreProductsAvailable) {
        const response = await fetchProducts(
          controller.signal,
          searchTerm,
          category,
          sortBy,
          order,
          pageSize,
          currentSkip,
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        const transformedProducts = response.products.map(
          mapApiProductToProduct,
        );

        const pageMatches = filterCategorySearch(
          transformedProducts,
          searchTerm,
        );

        matchingProducts = [...matchingProducts, ...pageMatches];

        moreProductsAvailable = response.skip + response.limit < response.total;

        currentSkip = response.skip + response.limit;
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      const startIndex = (page - 1) * pageSize;

      const pageProducts = matchingProducts.slice(
        startIndex,
        startIndex + pageSize,
      );

      const pageHasMore = startIndex + pageSize < matchingProducts.length;

      pageCacheRef.current.set(page, {
        products: pageProducts,
        hasMore: pageHasMore,
      });

      setTotalResults(matchingProducts.length);
      setProducts(pageProducts);
      setCurrentPage(page);
      setHasMore(pageHasMore);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error(error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const loadProducts = async (
    searchTerm = "",
    category = "",
    sortBy = "",
    order = "",
  ) => {
    const requestId = ++requestIdRef.current;

    filtersRef.current = {
      searchTerm,
      category,
      sortBy,
      order,
    };

    setCurrentPage(1);
    setProducts([]);
    setError(null);
    setHasMore(true);
    setTotalResults(0);

    pageCacheRef.current.clear();

    await loadPage(1, searchTerm, category, sortBy, order, requestId);
  };

  const goToPage = async (page: number) => {
    if (page < 1 || (page > currentPage && !hasMore)) {
      return;
    }

    const requestId = ++requestIdRef.current;

    const { searchTerm, category, sortBy, order } = filtersRef.current;

    await loadPage(page, searchTerm, category, sortBy, order, requestId);
  };

  useEffect(() => {
    loadProducts();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const totalPages = Math.ceil(totalResults / pageSize);

  return {
    products,
    loading,
    error,
    hasMore,
    currentPage,
    totalResults,
    totalPages,
    goToPage,
    refresh: loadProducts,
  };
}
