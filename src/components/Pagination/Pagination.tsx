interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

const DESKTOP_VISIBLE_PAGES = 7;
const MOBILE_VISIBLE_PAGES = 3;

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const getPageNumbers = (
        maxVisiblePages: number,
    ): (number | "...")[] => {
        if (totalPages <= maxVisiblePages) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1,
            );
        }

        if (maxVisiblePages === MOBILE_VISIBLE_PAGES) {
            if (currentPage === 1) {
                return [1, 2, "...", totalPages];
            }

            if (currentPage === totalPages) {
                return [1, "...", totalPages - 1, totalPages];
            }

            return [1, "...", currentPage, "...", totalPages];
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    const handlePrevious = () => {
        if (isFirstPage || disabled) {
            return;
        }

        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (isLastPage || disabled) {
            return;
        }

        onPageChange(currentPage + 1);
    };

    const handlePageChange = (page: number) => {
        if (page === currentPage || disabled) {
            return;
        }

        onPageChange(page);
    };

    const renderPageNumbers = (pages: (number | "...")[]) =>
        pages.map((page, index) =>
            page === "..." ? (
                <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm font-semibold text-text-secondary sm:px-2"
                    aria-hidden="true"
                >
                    ...
                </span>
            ) : (
                <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    disabled={disabled}
                    aria-current={
                        page === currentPage ? "page" : undefined
                    }
                    className={`min-w-9 rounded-md border px-2 py-2 text-sm font-semibold transition-colors duration-200 sm:min-w-10 sm:px-3 ${
                        page === currentPage
                            ? "border-primary bg-primary text-white"
                            : "border-border text-text hover:border-primary hover:text-primary"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                    {page}
                </button>
            ),
        );

    const desktopPages = getPageNumbers(DESKTOP_VISIBLE_PAGES);
    const mobilePages = getPageNumbers(MOBILE_VISIBLE_PAGES);

    return (
        <nav
            className="flex items-center justify-center gap-1 py-8 sm:gap-2"
            aria-label="Product pagination"
        >
            <button
                type="button"
                onClick={handlePrevious}
                disabled={isFirstPage || disabled}
                className="rounded-md border border-border px-2.5 py-2 text-xs font-semibold text-text transition-colors duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
            >
                Previous
            </button>

            {/* Mobile Pagination */}
            <div className="flex items-center gap-1 sm:hidden">
                {renderPageNumbers(mobilePages)}
            </div>

            {/* Desktop Pagination */}
            <div className="hidden items-center gap-1 sm:flex">
                {renderPageNumbers(desktopPages)}
            </div>

            <button
                type="button"
                onClick={handleNext}
                disabled={isLastPage || disabled}
                className="rounded-md border border-border px-2.5 py-2 text-xs font-semibold text-text transition-colors duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
            >
                Next
            </button>
        </nav>
    );
}

export default Pagination;