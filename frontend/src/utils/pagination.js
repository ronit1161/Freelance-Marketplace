// utils/pagination.js

/**
 * Generates an array of page numbers with ellipsis for pagination UI.
 * @param {number} currentPage - Active page.
 * @param {number} totalPages - Total available pages.
 * @param {number} siblingCount - Number of page buttons on each side of the current page (default: 1).
 * @returns {(number|string)[]} Array containing page numbers and '...' separators.
 */
export function generatePaginationRange(currentPage, totalPages, siblingCount = 1) {
    // If page count is small, show all pages without ellipsis
    const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*ellipsis

    if (totalPageNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 1: Show right ellipsis only
    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        let leftItemCount = 3 + 2 * siblingCount;
        let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, "...", totalPages];
    }

    // Case 2: Show left ellipsis only
    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        let rightItemCount = 3 + 2 * siblingCount;
        let rightRange = Array.from(
            { length: rightItemCount },
            (_, i) => totalPages - rightItemCount + i + 1
        );
        return [firstPageIndex, "...", ...rightRange];
    }

    // Case 3: Show both left and right ellipsis
    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        let middleRange = Array.from(
            { length: rightSiblingIndex - leftSiblingIndex + 1 },
            (_, i) => leftSiblingIndex + i
        );
        return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
}