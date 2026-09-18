import { useState } from "react";

import "./App.css";

import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
// import ShippingForm from "./components/ShippingForm/ShippingForm";
import CartPage from "./pages/CartPage/CartPage";

import { useCart } from "./hooks/useCart";

function App() {
  // const [showCheckout, setShowCheckout] = useState(false);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [showCart, setShowCart] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const {
    items,
    addItem,
    removeItem,
    updateQty,
    totalItems,
  } = useCart();

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setSearchQuery(trimmedQuery);
    setShowSearchResults(true);
    setShowCart(false);
  };

  const renderPage = () => {
    // if (showCheckout) {
    //     return <ShippingForm />;
    // }

    if (showCart) {
      return (
        <CartPage
          items={items}
          onUpdateQuantity={updateQty}
          onRemoveItem={removeItem}
        />
      );
    }

    if (showSearchResults) {
      return (
        <SearchResults
          searchQuery={searchQuery}
          onAddToCart={addItem}
        />
      );
    }

    return (
      <Home
        onSearch={handleSearch}
        onAddToCart={addItem}
      />
    );
  };

  return (
    <div className="app">
      <Navbar
        // onCheckout={() => setShowCheckout(true)}
        onSearch={handleSearch}
        onCartClick={() => {
          setShowCart(true);
          setShowSearchResults(false);
        }}
        cartItemCount={totalItems}
      />

      <main className="app-content">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

export default App;