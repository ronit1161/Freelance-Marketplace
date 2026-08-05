import { useState } from "react";
import { useOrders } from "../../../hooks/useOrder";
import { useReviews } from "../../reviews/hooks/useReviews";
import { useSearchParams } from "react-router-dom";
import OrdersList from "../components/OrderList";
import { PaginationControls } from "../../../components/common/PaginationControl";
import { ShoppingBag, Search } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function OrdersPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const { orders, totalPages, isLoading, error } = useOrders({ userId: user?.id, page: currentPage, limit: 10 });
    const { clientReviewsMap, refreshReviews } = useReviews({ userId: user?.id, role: "CLIENT" });

    const handlePageChange = (newPage) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSearchParams({ page: newPage });
    };

    // Filter orders locally by status and search query
    const filteredOrders = orders.filter((ord) => {
        const st = (ord.status || "").toUpperCase();
        if (selectedStatus !== "ALL" && st !== selectedStatus) {
            return false;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const idMatch = String(ord.id).toLowerCase().includes(query);
            const titleMatch = (ord.gigTitle || "").toLowerCase().includes(query);
            const freelancerMatch = (ord.freelancerName || "").toLowerCase().includes(query);
            return idMatch || titleMatch || freelancerMatch;
        }

        return true;
    });

    const statusTabs = [
        { id: "ALL", label: "All Orders" },
        { id: "PENDING", label: "Pending" },
        { id: "IN_PROGRESS", label: "In Progress" },
        { id: "COMPLETED", label: "Completed" },
        { id: "CANCELLED", label: "Cancelled" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center font-bold">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">All Orders</h1>
                            <p className="text-sm text-gray-500">Track and manage all your purchased services & requests</p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Filter orders by ID or Title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedStatus(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                selectedStatus === tab.id
                                    ? "bg-[#0058be] text-white shadow-sm"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    <OrdersList
                        orders={filteredOrders}
                        isLoading={isLoading}
                        error={error}
                        clientReviewsMap={clientReviewsMap}
                        onOrderUpdated={() => {
                            refreshReviews();
                            window.location.reload();
                        }}
                    />
                    
                    <div className="pt-4 flex justify-center">
                        <PaginationControls
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}