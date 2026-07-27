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
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 text-xs">
                <div>
                    <dt className="text-gray-400 font-medium">Client ID</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5">{order.client_id ?? "N/A"}</dd>
                </div>
                <div>
                    <dt className="text-gray-400 font-medium">Freelancer ID</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5">{order.freelancer_id ?? "N/A"}</dd>
                </div>
                <div>
                    <dt className="text-gray-400 font-medium">Gig ID</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5">{order.gig_id ?? "N/A"}</dd>
                </div>
                <div>
                    <dt className="text-gray-400 font-medium">Package ID</dt>
                    <dd className="font-semibold text-gray-800 mt-0.5">{order.package_id ?? "N/A"}</dd>
                </div>
            </dl>

            {/* Price Snapshot */}
            <section className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100/60">
                <span className="text-xs font-semibold text-blue-900">Price Snapshot</span>
                <span className="text-lg font-extrabold text-[#0058be]">{displayPrice}</span>
            </section>

            {/* Requirements */}
            <section className="text-xs space-y-1">
                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Requirements</span>
                <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed">
                    {order.requirements || "No special requirements provided."}
                </p>
            </section>

            {/* Timestamps */}
            <footer className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 gap-2">
                <div>
                    <span className="font-medium">Created: </span>
                    <time dateTime={order.created_at} className="font-semibold text-gray-600">{formatDate(order.created_at)}</time>
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