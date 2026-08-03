import { useOrders } from "../../Hooks/useOrder";
import { useSearchParams } from "react-router-dom";
import OrdersList from "../components/OrderList";
import { PaginationControls } from "../../../components/common/PaginationControl";
import ClientNavBar from "../../Client/Components/ClientNavBar";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function OrdersPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const { orders, totalPages, isLoading, error } = useOrders({ userId: user?.id, page: currentPage, limit: 10 });
    
    const handlePageChange = (newPage) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSearchParams({ page: newPage });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Navigation Bar */}
                <ClientNavBar />

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center font-bold">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">All Orders</h1>
                            <p className="text-sm text-gray-500">Track and manage all your purchased services & requests</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    <OrdersList orders={orders} isLoading={isLoading} error={error} />
                    
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