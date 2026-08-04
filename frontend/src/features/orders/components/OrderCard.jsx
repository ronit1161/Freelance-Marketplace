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

    const numericPrice = order.agreedPrice !== undefined
        ? order.agreedPrice
        : (order.price_snapshot !== undefined ? order.price_snapshot : (order.amount || 0));

    const displayPrice = typeof numericPrice === "number"
        ? `₹${numericPrice.toLocaleString("en-IN")}`
        : `₹${numericPrice}`;

    const clientId = order.clientId || order.client_id || (order.client?.id) || "N/A";
    const freelancerId = order.freelancerId || order.freelancer_id || order.freelancerName || "N/A";
    const gigInfo = order.gigTitle || (order.gigId ? `#${order.gigId}` : (order.gig_id ? `#${order.gig_id}` : "N/A"));
    const createdDate = order.createdOn || order.created_at || order.createdAt;

    return (
        <article className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                    <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Order ID</span>
                    <h3 className="text-base font-bold text-gray-900">#{order.id}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusBadgeClass}`}>
                    {order.status}
                </span>
            </header>

            {/* Order Details Grid */}
            <dl className="grid grid-cols-3 gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 text-xs">
                <div>
                    <dt className="text-gray-400 font-medium">Client</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5 truncate">{clientId}</dd>
                </div>
                <div>
                    <dt className="text-gray-400 font-medium">Freelancer</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5 truncate">{freelancerId}</dd>
                </div>
                <div>
                    <dt className="text-gray-400 font-medium">Gig Service</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5 truncate">{gigInfo}</dd>
                </div>
            </dl>

            {/* Price Snapshot */}
            <section className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100/60">
                <span className="text-xs font-semibold text-blue-900">Order Amount</span>
                <span className="text-lg font-extrabold text-[#0058be]">{displayPrice}</span>
            </section>

            {/* Requirements */}
            <section className="text-xs space-y-1">
                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Requirements & Brief</span>
                <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed">
                    {order.requirements || order.description || "No special requirements provided."}
                </p>
            </section>

            {/* Action Triggers */}
            {order.status === "IN_PROGRESS" && (
                <div className="pt-2">
                    <button
                        onClick={async () => {
                            if (window.confirm(`Accept delivery and release payment for Order #${order.id}?`)) {
                                try {
                                    const { completeOrder } = await import("../../../services/orderApi");
                                    await completeOrder(order.id);
                                    window.location.reload();
                                } catch (e) {
                                    alert(e.message || "Failed to complete order.");
                                }
                            }
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                        Accept Delivery & Release Escrow
                    </button>
                </div>
            )}

            {order.status === "PENDING" && (
                <div className="pt-2">
                    <button
                        onClick={async () => {
                            if (window.confirm(`Are you sure you want to cancel Order #${order.id}? Funds will be refunded to your wallet.`)) {
                                try {
                                    const { cancelOrder } = await import("../../../services/orderApi");
                                    await cancelOrder(order.id);
                                    window.location.reload();
                                } catch (e) {
                                    alert(e.message || "Failed to cancel order.");
                                }
                            }
                        }}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl transition"
                    >
                        Cancel Order
                    </button>
                </div>
            )}

            {/* Timestamps */}
            <footer className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 gap-2">
                <div>
                    <span className="font-medium">Created: </span>
                    <time dateTime={createdDate} className="font-semibold text-gray-600">{formatDate(createdDate)}</time>
                </div>

                <OrderStatusTimestamp
                    status={order.status}
                    completedAt={order.completed_at || order.lastUpdated}
                    cancelledAt={order.cancelled_at}
                    formatDate={formatDate}
                />
            </footer>
        </article>
    );
}