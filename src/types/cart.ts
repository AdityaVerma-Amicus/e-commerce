export interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface CartApiProduct {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
}

export interface CartApiResponse {
    id: number;
    userId: number;
    products: CartApiProduct[];
    total: number;
    discountedTotal: number;
    totalProducts: number;
    totalQuantity: number;
}