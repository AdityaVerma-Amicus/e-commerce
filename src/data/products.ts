export interface Product {
    id: number;
    image: string;
    name: string;
    price: number;
    sku: string;
    rating: number;
    category: string;
    isNew: boolean;
    isSale: boolean;
}

export interface ProductApiResponse {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    sku: string;
    rating: number;
    thumbnail: string;
    stock: number;
    discountPercentage: number;
}