import OrderCard from "./OrderCard";
import { AlertCircle, ShoppingBag } from "lucide-react";

export default function OrdersList({ isLoading, error, orders = [] }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        </div>
                        <div className="h-16 bg-gray-100 rounded-xl"></div>
                        <div className="h-10 bg-gray-100 rounded-xl"></div>
                        <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sm">Failed to load orders</h4>
                    <p className="text-xs text-red-500 mt-0.5">{error}</p>
                </div>
            </div>
        );
    }

    if (!orders || !orders.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0058be] flex items-center justify-center mx-auto">
                    <ShoppingBag size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900">No orders found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    You haven't placed any order yet or no matching orders were found.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}

export { OrdersList };


