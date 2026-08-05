import { useState, useEffect } from "react";
import { getWallet } from "../Services/walletapi";

export const useWallet = (userId) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getWallet()
      .then((data) => {
        if (isMounted) {
          setWallet(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to fetch wallet");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { wallet, loading, error };
};
