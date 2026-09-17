import { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";

import "./NavigationMenu.css";
import SignInButton from "../SignInButton/SignInButton";

const menuItems = [
  { label: "Parts", href: "https://example.com" },
  { label: "Equipment", href: "https://example.com" },
  { label: "Service", href: "https://example.com" },
  {
    label: "Warranty / Safety",
    href: "/warranty-safety",
  },
  {
    label: "Training",
    href: "/training",
  },
  {
    label: "Resources",
    href: "/resources",
  },
];

function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger / Close Button */}
      <button
        className="hamburger-btn"
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={22} strokeWidth={2} />
        ) : (
          <Menu size={22} strokeWidth={2} />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Drawer */}
      <aside
        className={`navigation-drawer ${
          isOpen ? "navigation-drawer-open" : ""
        }`}
        aria-hidden={!isOpen}
      >
        <div className="drawer-menu">
          {menuItems.map((item) => (
            <a key={item.label} className="drawer-menu-item" href={item.href}>
              <span>{item.label}</span>

              <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ))}

          <div className="drawer-signin">
            <SignInButton />
          </div>
        </div>
      </aside>
    </>
  );
}

export default NavigationMenu;
