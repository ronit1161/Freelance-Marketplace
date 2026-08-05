import { useState, useEffect } from "react";
import { getOrder } from "../../Services/ordersApi";

export function useOrders({ userId, limit = 10, page = 1 } = {}) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        async function fetchOrdersData() {
            try {
                const data = await getOrder({ userId, limit, page, signal: controller.signal });
                if (!controller.signal.aborted) {
                    setOrders(data.orders || []);
                    setTotalPages(data.totalPages || 1);
                }
            } catch (err) {
                if (err.name !== "AbortError" && !controller.signal.aborted) {
                    setError(err.message || "Failed to fetch orders");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchOrdersData();

        return () => controller.abort();
    }, [userId, limit, page]);

    return { orders, totalPages, isLoading, error };
}