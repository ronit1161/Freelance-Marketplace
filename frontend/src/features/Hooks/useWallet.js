import { useState, useEffect } from 'react';
import { getClientWallet } from '../../Services/walletapi';

export const useWallet = (userId) => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        try {
            setLoading(true);
            setError(null);
            const data = getClientWallet(userId);
            setWallet(data);
        } catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message || "Failed to fetch wallet");
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        };

        return () => {
            controller.abort();
        };
    }, [userId]);

    return { wallet, loading, error };
};