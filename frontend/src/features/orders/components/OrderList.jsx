import OrderCard from "./OrderCard";

export default function OrdersList({ isLoading, error, orders = [] }) {
    if (isLoading) return <p aria-busy="true">Loading recent orders...</p>;
    if (error) return <p role="alert">Error: {error}</p>;
    if (!orders.length) return <p>No recent orders found.</p>;

    return (
        <>
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </>
    );
}


