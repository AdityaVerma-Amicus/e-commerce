import type {
    CartApiProduct,
    CartApiResponse,
    CartItem,
} from "../types/cart";

const CART_API_URL = "https://dummyjson.com/carts/1";
const CART_STORAGE_KEY = "cart";

const mapCartProductToCartItem = (
    product: CartApiProduct
): CartItem => ({
    id: product.id,
    name: product.title,
    image: product.thumbnail,
    price: product.price,
    quantity: product.quantity,
});

export const fetchCart = async (): Promise<CartItem[]> => {
    const response = await fetch(CART_API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch cart");
    }

    const data: CartApiResponse =
        await response.json();

    return data.products.map(
        mapCartProductToCartItem
    );
};

export const getStoredCart = (): CartItem[] => {
    const storedCart =
        localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
        return [];
    }

    try {
        return JSON.parse(storedCart) as CartItem[];
    } catch {
        localStorage.removeItem(
            CART_STORAGE_KEY
        );

        return [];
    }
};

export const saveCart = (
    cart: CartItem[]
): void => {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );
};