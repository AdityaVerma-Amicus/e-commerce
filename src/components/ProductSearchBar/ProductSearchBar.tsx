import { Search } from "lucide-react";
import type { KeyboardEvent } from "react";

interface ProductSearchBarProps {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    className?: string;
}

function ProductSearchBar({
    value,
    placeholder,
    onChange,
    onSearch,
    className = "",
}: ProductSearchBarProps) {
    const handleKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className={`relative flex ${className}`}>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button
                type="button"
                aria-label="Search products"
                onClick={onSearch}
            >
                <Search
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </button>
        </div>
    );
}

export default ProductSearchBar;