// components/PaginationControls.jsx
import React from "react";
import { generatePaginationRange } from "../../utils/pagination";

/**
 * Reusable, accessible Pagination Controls component.
 */
export function PaginationControls({
    page,
    totalPages,
    onPageChange,
    isLoading = false,
    siblingCount = 1,
}) {
    // Hide pagination if there is only 1 page or zero data
    if (totalPages <= 1) return null;

    const paginationRange = generatePaginationRange(page, totalPages, siblingCount);

    return (
        <nav
            aria-label="Pagination Navigation"
            className="pagination-container"
            style={{ display: "flex", alignItems: "center", gap: "6px", margin: "20px 0" }}
        >
            {/* Previous Page Button */}
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || isLoading}
                aria-label="Go to previous page"
                className="pagination-btn nav-btn"
            >
                ‹ Prev
            </button>

            {/* Page Numbers & Ellipsis */}
            {paginationRange.map((pageNumber, index) => {
                // Render Ellipsis
                if (pageNumber === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="pagination-ellipsis"
                            style={{ padding: "0 6px", color: "#888" }}
                        >
                            &#8230;
                        </span>
                    );
                }

                const isCurrent = pageNumber === page;

                // Render Page Number Button
                return (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() => onPageChange(pageNumber)}
                        disabled={isLoading}
                        aria-current={isCurrent ? "page" : undefined}
                        aria-label={`Go to page ${pageNumber}`}
                        className={`pagination-btn ${isCurrent ? "active" : ""}`}
                        style={{
                            padding: "6px 12px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontWeight: isCurrent ? "bold" : "normal",
                            backgroundColor: isCurrent ? "#0066cc" : "#fff",
                            color: isCurrent ? "#fff" : "#333",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Next Page Button */}
            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
                aria-label="Go to next page"
                className="pagination-btn nav-btn"
            >
                Next ›
            </button>
        </nav>
    );
}