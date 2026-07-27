import { getStatusBadgeColor } from "../../../utils/statusUtils";

// ----------------------------------------------------------------------
// Sub-component for dynamic status timestamp (Kept in same file)
// ----------------------------------------------------------------------
function OrderStatusTimestamp({ status, completedAt, cancelledAt, formatDate }) {
    if (status === "COMPLETED" && completedAt) {
        return (
            <div className="completed-timestamp">
                <span>Completed At:</span>
                <time dateTime={completedAt}>{formatDate(completedAt)}</time>
            </div>
        );
    }

    if (status === "CANCELLED" && cancelledAt) {
        return (
            <div className="cancelled-timestamp">
                <span>Cancelled At:</span>
                <time dateTime={cancelledAt}>{formatDate(cancelledAt)}</time>
            </div>
        );
    }

    return null;
}

// ----------------------------------------------------------------------
// Main Order Component
// ----------------------------------------------------------------------
export default function OrderCard({ order }) {
    if (!order) return null;

    const statusBadgeClass = getStatusBadgeColor(order.status);

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
    };

    // Displays direct Rupee amount safely
    const displayPrice = typeof order.price_snapshot === "number"
        ? `₹${order.price_snapshot.toLocaleString("en-IN")}`
        : "₹0";

    return (
        <article className="order-card">
            {/* Header */}
            <header className="order-header">
                <div>
                    <span>Order ID</span>
                    <h3>#{order.id}</h3>
                </div>
                <span className={`status-badge ${statusBadgeClass}`}>
                    {order.status}
                </span>
            </header>

            {/* Order Details Grid */}
            <dl className="order-details">
                <div>
                    <dt>Client ID</dt>
                    <dd>{order.client_id ?? "N/A"}</dd>
                </div>
                <div>
                    <dt>Freelancer ID</dt>
                    <dd>{order.freelancer_id ?? "N/A"}</dd>
                </div>
                <div>
                    <dt>Gig ID</dt>
                    <dd>{order.gig_id ?? "N/A"}</dd>
                </div>
                <div>
                    <dt>Package ID</dt>
                    <dd>{order.package_id ?? "N/A"}</dd>
                </div>
            </dl>

            {/* Price Snapshot */}
            <section className="order-price">
                <span>Price Snapshot</span>
                <span>{displayPrice}</span>
            </section>

            {/* Requirements */}
            <section className="order-requirements">
                <span>Requirements</span>
                <p>{order.requirements || "No special requirements provided."}</p>
            </section>

            {/* Timestamps */}
            <footer className="order-timestamps">
                <div>
                    <span>Created At:</span>
                    <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
                </div>

                <OrderStatusTimestamp
                    status={order.status}
                    completedAt={order.completed_at}
                    cancelledAt={order.cancelled_at}
                    formatDate={formatDate}
                />
            </footer>
        </article>
    );
}