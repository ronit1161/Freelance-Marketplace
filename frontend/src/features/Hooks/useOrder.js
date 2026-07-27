import { useState, useEffect } from "react";
import { getOrder } from "../../Services/ordersApi";

export function useOrders({ userId, limit, page } = {}) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);
        try {
            const data = getOrder({ userId, limit, page, signal: controller.signal });
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        }
        catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message || "Failed to fetch orders");
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false);
            }
        };

        return () => controller.abort();
        // Pass primitive values directly to avoid infinite re-renders
    }, [userId, limit]);

    return { orders, totalPages, isLoading, error };
}