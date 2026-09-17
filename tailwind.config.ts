import type { Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            colors: {
                primary: "#f97316",
                "primary-hover": "#ea580c",

                background: "#ffffff",
                surface: "#f9fafb",

                border: "#d1d5db",

                text: "#1f2937",
                "text-secondary": "#6b7280",

                rating: "#facc15",
            },
        },
    },
};

export default config;