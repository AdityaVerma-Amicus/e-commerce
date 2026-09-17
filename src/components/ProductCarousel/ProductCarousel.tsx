import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  A11y,
  Navigation,
  Pagination as SwiperPagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ProductCard from "../FeaturedParts/ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCardSkeleton/ProductCardSkeleton";

import type { Product } from "../../data/products";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductCarouselProps {
    products: Product[];
    loading?: boolean;
    skeletonCount?: number;
    onAddToCart: (
        product: Product,
        quantity: number
    ) => void;
}

function ProductCarousel({
  products,
  loading = false,
  skeletonCount = 4,
  onAddToCart,
}: ProductCarouselProps) {
  if (loading) {
    return (
      <div className="flex justify-center gap-6 overflow-hidden">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="mx-auto w-54 sm:w-114 lg:w-234">
        <Swiper
          modules={[Navigation, SwiperPagination, A11y]}
          slidesPerView="auto"
          spaceBetween={24}
          slidesPerGroup={1}
          loop={true}
          centeredSlides={false}
          navigation={{
            prevEl: ".featured-parts-prev",
            nextEl: ".featured-parts-next",
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-border !opacity-100",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-primary",
          }}
          className="featured-parts-swiper pb-10!"
        >
          {products.map((product) => (
            <SwiperSlide
              key={product.sku}
              className="flex! w-54! shrink-0! justify-center!"
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        type="button"
        aria-label="Previous featured products"
        className="featured-parts-prev absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-md transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Next featured products"
        className="featured-parts-next absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-md transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>
    </div>
  );
}

export default ProductCarousel;
