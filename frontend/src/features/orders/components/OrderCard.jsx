import React, { useState } from "react";
import { getStatusBadgeColor } from "../../../utils/statusUtils";
import WriteReviewModal from "../../reviews/components/WriteReviewModal";
import RatingStars from "../../reviews/components/RatingStars";
import { completeOrder, cancelOrder } from "../../../services/orderApi";

function OrderStatusTimestamp({ status, completedAt, cancelledAt, formatDate }) {
    if (status === "COMPLETED" && completedAt) {
        return (
            <div className="completed-timestamp">
                <span>Completed: </span>
                <time dateTime={completedAt}>{formatDate(completedAt)}</time>
            </div>
        );
    }

    if (status === "CANCELLED" && cancelledAt) {
        return (
            <div className="cancelled-timestamp">
                <span>Cancelled: </span>
                <time dateTime={cancelledAt}>{formatDate(cancelledAt)}</time>
            </div>
        );
    }

    return null;
}

export default function OrderCard({ order, clientReview, onOrderUpdated }) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    const handleAcceptDelivery = async () => {
        if (window.confirm(`Accept delivery and release escrow payment for Order #${order.id}?`)) {
            setIsProcessing(true);
            try {
                await completeOrder(order.id);
                if (onOrderUpdated) onOrderUpdated();
            } catch (e) {
                alert(e.message || "Failed to complete order.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleCancelOrder = async () => {
        if (window.confirm(`Are you sure you want to cancel Order #${order.id}? Funds will be refunded to your wallet.`)) {
            setIsProcessing(true);
            try {
                await cancelOrder(order.id);
                if (onOrderUpdated) onOrderUpdated();
            } catch (e) {
                alert(e.message || "Failed to cancel order.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <article className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
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
                        disabled={isProcessing}
                        onClick={handleAcceptDelivery}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : "Accept Delivery & Release Escrow"}
                    </button>
                </div>
            )}

            {order.status === "PENDING" && (
                <div className="pt-2">
                    <button
                        disabled={isProcessing}
                        onClick={handleCancelOrder}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl transition disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : "Cancel Order"}
                    </button>
                </div>
            )}

            {order.status === "COMPLETED" && (
                <div className="pt-2">
                    {clientReview ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                            <span className="text-xs font-bold text-emerald-800">✓ Reviewed</span>
                            <RatingStars rating={clientReview.rating} size={14} />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsReviewOpen(true)}
                            className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#0058be] border border-blue-200 font-bold text-xs rounded-xl transition"
                        >
                            Leave Review for Freelancer
                        </button>
                    )}
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

            {/* Write Review Modal */}
            <WriteReviewModal
                order={order}
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onReviewSubmitted={() => {
                    if (onOrderUpdated) onOrderUpdated();
                }}
            />
        </article>
    );
}