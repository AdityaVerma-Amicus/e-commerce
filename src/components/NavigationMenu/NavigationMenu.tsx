import { useState } from "react";
import {
    ChevronRight,
    Menu,
    X,
} from "lucide-react";
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
                aria-label={
                    isOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                }
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X
                        size={22}
                        strokeWidth={2}
                    />
                ) : (
                    <Menu
                        size={22}
                        strokeWidth={2}
                    />
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
                    isOpen
                        ? "navigation-drawer-open"
                        : ""
                }`}
                aria-hidden={!isOpen}
            >
                <div className="drawer-menu">
                    {menuItems.map((item) => {
                        if (item.type === "internal") {
                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `drawer-menu-item ${
                                            isActive
                                                ? "drawer-menu-item-active"
                                                : ""
                                        }`
                                    }
                                    onClick={handleClose}
                                >
                                    <span>
                                        {item.label}
                                    </span>

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
                                onClick={handleClose}
                            >
                                <span>
                                    {item.label}
                                </span>

                                <ChevronRight
                                    size={16}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </a>
                        );
                    })}

                    <div className="drawer-signin">
                        <SignInButton />
                    </div>
                </div>
            </aside>
        </>
    );
}

export default NavigationMenu;