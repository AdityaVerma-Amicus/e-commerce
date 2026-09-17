import { useEffect, useState } from "react";

import "./App.css";

import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
// import ShippingForm from "./components/ShippingForm/ShippingForm";
import CartPage from "./pages/CartPage/CartPage";
import type { CartItem } from "./types/cart";
import type { Product } from "./data/products";
import { fetchCart, getStoredCart, saveCart } from "./services/cartServices";

function App() {
  // const [showCheckout, setShowCheckout] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setSearchQuery(trimmedQuery);
    setShowSearchResults(true);
    setShowCart(false);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find((item) => item.id === product.id);

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...previousCart,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  };

  const renderPage = () => {
    // if (showCheckout) {
    //     return <ShippingForm />;
    // }

    if (showCart) {
      return (
        <CartPage
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      );
    }

    if (showSearchResults) {
      return (
        <SearchResults
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
        />
      );
    }

    return <Home onSearch={handleSearch} onAddToCart={handleAddToCart} />;
  };

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = getStoredCart();

      if (storedCart.length > 0) {
        setCart(storedCart);
        setIsCartLoading(false);
        return;
      }

      try {
        const apiCart = await fetchCart();

        setCart(apiCart);
        saveCart(apiCart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsCartLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (isCartLoading) {
      return;
    }

    saveCart(cart);
  }, [cart, isCartLoading]);

  return (
    <div className="app">
      <Navbar
        // onCheckout={() => setShowCheckout(true)}
        onSearch={handleSearch}
        onCartClick={() => {
          setShowCart(true);
          setShowSearchResults(false);
        }}
        cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
      />

      <main className="app-content">{renderPage()}</main>

      <Footer />
    </div>
  );
}

export default App;
