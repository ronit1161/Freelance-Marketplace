import { useState, useEffect } from "react";
import { getOrders } from "../Services/orderApi";

export function useOrders({ userId, limit = 10, page = 1 } = {}) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    getOrders({ userId, limit, page })
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setOrders(data);
            setTotalPages(1);
          } else {
            setOrders(data?.orders || []);
            setTotalPages(data?.totalPages || 1);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to fetch orders");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId, limit, page]);

  return { orders, totalPages, isLoading, error };
}
