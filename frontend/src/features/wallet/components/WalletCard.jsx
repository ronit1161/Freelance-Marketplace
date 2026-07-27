import { useWallet } from '../../Hooks/useWallet';

export default function WalletCard({ userId }) {
    const { wallet, loading, error } = useWallet(userId);

    if (loading) return <div>Loading wallet...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!wallet) return <div>No wallet found.</div>;

    return (
        <div className="wallet-card">
            <h3>Wallet Balance</h3>
            <p>Available: Rs{wallet.availableBalance?.toFixed(2)}</p>
            <p>Held (Escrow): Rs{wallet.heldBalance?.toFixed(2)}</p>
            <p>Total: Rs{wallet.totalBalance?.toFixed(2)}</p>
        </div>
    );
};

export { WalletCard };