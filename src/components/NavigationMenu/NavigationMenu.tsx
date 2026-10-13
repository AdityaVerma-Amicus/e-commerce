import { useEffect, useRef, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import "./NavigationMenu.css";
import SignInButton from "../SignInButton/SignInButton";

const menuItems = [
  { label: "Products", path: "/products", type: "internal" },
  { label: "Equipment", path: "https://example.com", type: "external" },
  { label: "Service", path: "https://example.com", type: "external" },
  { label: "Warranty / Safety", path: "/warranty-safety", type: "external" },
  { label: "Training", path: "/training", type: "external" },
  { label: "Resources", path: "/resources", type: "external" },
] as const;

function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const firstFocusableElement = drawerRef.current?.querySelector<HTMLElement>(
      "a[href], button:not([disabled])",
    );

    firstFocusableElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleFocus = () => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(document.activeElement)
      ) {
        // Keep keyboard focus inside the open navigation drawer.
        const firstFocusableElement =
          drawerRef.current.querySelector<HTMLElement>(
            "a[href], button:not([disabled])",
          );

        firstFocusableElement?.focus();
      }
    };

    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };
  }, [isOpen]);

  const handleItemClick = () => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={toggleButtonRef}
        className="hamburger-btn"
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation-drawer"
      >
        {isOpen ? (
          <X size={22} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Menu size={22} strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          className="menu-overlay"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={drawerRef}
        id="primary-navigation-drawer"
        className={`navigation-drawer ${
          isOpen ? "navigation-drawer-open" : ""
        }`}
        aria-label="Primary navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <nav className="drawer-menu" aria-label="Main menu">
          {menuItems.map((item) => {
            if (item.type === "internal") {
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `drawer-menu-item ${
                      isActive ? "drawer-menu-item-active" : ""
                    }`
                  }
                  onClick={handleItemClick}
                >
                  <span>{item.label}</span>

                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </NavLink>
              );
            }

            return (
              <a
                key={item.label}
                className="drawer-menu-item"
                href={item.path}
                onClick={handleItemClick}
              >
                <span>{item.label}</span>

                <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </a>
            );
          })}

          <div className="drawer-signin">
            <SignInButton />
          </div>
        </nav>
      </aside>
    </>
  );
}

export default NavigationMenu;
