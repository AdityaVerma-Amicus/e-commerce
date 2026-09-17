export interface Category {
    title: string;
    description: string;
    buttonText: string;
}

export const categories: Category[] = [
    {
        title: "Order Now",
        description:
            "Find and order the construction parts you need quickly and easily.",
        buttonText: "ORDER NOW"
    },
    {
        title: "Aftermarket Products",
        description:
            "Explore quality aftermarket products for your construction equipment.",
        buttonText: "EXPLORE PRODUCTS"
    },
    {
        title: "Interactive Parts Manuals",
        description:
            "Access interactive parts manuals to identify the right components.",
        buttonText: "VIEW MANUALS"
    },
    {
        title: "Technical Publications",
        description:
            "Find technical publications and information to support your equipment.",
        buttonText: "VIEW PUBLICATIONS"
    }
];