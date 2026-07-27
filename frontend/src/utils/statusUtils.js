/**
 * Returns Tailwind CSS badge color classes depending on order status:
 * - PENDING: Yellow / Amber
 * - COMPLETED: Green
 * - CANCELLED: Red
 */
export const getStatusBadgeColor = (status) => {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "COMPLETED":
            return "bg-green-100 text-green-800 border-green-300";
        case "CANCELLED":
            return "bg-red-100 text-red-800 border-red-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-300";
    }
};
