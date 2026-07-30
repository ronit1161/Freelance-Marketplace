import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import ClientNavBar from "../components/ClientNavBar";
import { useOrders } from "../../../hooks/useOrder";
import OrdersList from "../../orders/components/OrderList";
import WalletCard from "../../wallet/components/WalletCard";
import { PlusCircle, Search, ArrowRight } from "lucide-react";

export default function ClientDashboardPage() {
    const navigate = useNavigate();
    const { orders, isLoading, error } = useOrders({ userId: null, limit: 3, page: 1 });
    const [isOpenCreateProjectModal, setIsOpenCreateProjectModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Hero Header Banner */}
                <div className="bg-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="space-y-2 relative z-10">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back!</h1>
                        <p className="text-sm text-blue-100/80 max-w-lg">
                            Manage active orders, post new project requests, and track your wallet escrow balance.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 relative z-10">
                        <button
                            onClick={() => setIsOpenCreateProjectModal(true)}
                            className="px-4 py-2.5 bg-white text-[#0058be] font-bold rounded-xl text-sm shadow-md hover:bg-blue-50 transition flex items-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Post New Request</span>
                        </button>

                        <button
                            onClick={() => navigate('/gigs')}
                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition flex items-center gap-2 backdrop-blur-md"
                        >
                            <Search className="w-4 h-4" />
                            <span>Browse Marketplace</span>
                        </button>
                    </div>
                </div>

                {/* Sub Navbar */}
                <ClientNavBar />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* Wallet Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-bold text-gray-900">Wallet Overview</h2>
                            <Link to="/client/wallet" className="text-xs font-semibold text-[#0058be] hover:underline flex items-center gap-1">
                                Details <ArrowRight size={12} />
                            </Link>
                        </div>
                        <WalletCard userId={null} />
                    </div>

                    {/* Recent Orders Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Recent Projects & Orders</h2>
                                <p className="text-xs text-gray-500">Your latest orders and their status</p>
                            </div>
                            <Link to="/client/orders" className="text-xs font-semibold text-[#0058be] hover:underline flex items-center gap-1">
                                View All Orders <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <OrdersList isLoading={isLoading} error={error} orders={orders} />
                        </div>
                    </div>

                </div>

                {/* Create Project Modal */}
                <CreateProjectModal
                    isOpen={isOpenCreateProjectModal}
                    onClose={() => setIsOpenCreateProjectModal(false)}
                />

            </div>
        </div>
    );
}
