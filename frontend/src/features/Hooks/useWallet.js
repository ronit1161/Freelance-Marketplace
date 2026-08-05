import { useState, useEffect } from 'react';
import { getClientWallet } from '../../Services/walletapi';

export const useWallet = (userId) => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        async function fetchWallet() {
            try {
                const data = await getClientWallet(userId);
                if (!controller.signal.aborted) {
                    setWallet(data);
                }
            } catch (err) {
                if (err.name !== "AbortError" && !controller.signal.aborted) {
                    setError(err.message || "Failed to fetch wallet");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchWallet();

        return () => {
            controller.abort();
        };
    }, [userId]);

    return { wallet, loading, error };
};