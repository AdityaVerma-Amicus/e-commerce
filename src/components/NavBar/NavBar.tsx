import { useState } from "react";
import {
  Search,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./NavBar.css";
import logo from "../../assets/ole.e94be128.svg";
import ProductSearchBar from "../ProductSearchBar/ProductSearchBar";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import SignInButton from "../SignInButton/SignInButton";

import { useCart } from "../../hooks/useCart";

function NavBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const { totalItems } = useCart();

  const handleSearch = () => {
    const trimmedQuery = searchTerm.trim();

    if (!trimmedQuery) {
      return;
    }

    navigate(
      `/products?q=${encodeURIComponent(trimmedQuery)}`,
    );
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <nav className="navbar">
      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="Online Express" />
      </div>

      {/* Search */}
      <div className="navbar-search">
        {/* Mobile Search Icon */}
        <button
          className="mobile-search-btn"
          type="button"
          aria-label="Search"
        >
          <Search
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        {/* Search Bar */}
        <div className="search-input-wrapper">
          <ProductSearchBar
            value={searchTerm}
            placeholder="Search construction parts..."
            onChange={setSearchTerm}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="navbar-actions">
        <SignInButton className="navbar-signin" />

        {/* Cart */}
        <button
          className="cart-btn"
          type="button"
          onClick={handleCartClick}
          aria-label={`Shopping cart with ${totalItems} items`}
        >
          <ShoppingCart
            size={20}
            strokeWidth={2}
            aria-hidden="true"
          />

          <span className="cart-label">
            Cart
          </span>

          <span className="cart-count">
            {totalItems}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;