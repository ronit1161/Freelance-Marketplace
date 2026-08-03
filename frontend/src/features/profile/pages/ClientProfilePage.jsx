import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getClientOrders } from "../../../services/orderApi";
import { getWalletByUserId } from "../../../services/walletApi";
import { Link } from "react-router-dom";
import { User, Mail, Wallet, ShoppingBag, Edit3, ArrowRight, ShieldCheck } from "lucide-react";

export default function ClientProfile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                getClientOrders(user.id).catch(() => []),
                getWalletByUserId(user.id).catch(() => null),
            ])
                .then(([ordersData, walletData]) => {
                    setOrders(ordersData || []);
                    setWallet(walletData);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    const avatar = user?.profileAvatarURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80";

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Profile Banner Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <img
                        src={avatar}
                        alt={user?.fullName || "Client"}
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-50 shadow-md"
                    />

                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-slate-900">
                                {user?.fullName || "Client Profile"}
                            </h1>
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider self-center md:self-auto border border-emerald-100">
                                <ShieldCheck size={12} /> {user?.role || "CLIENT"}
                            </span>
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            @{user?.userName || "client"} • {user?.email}
                        </p>

                        <p className="text-slate-600 text-sm max-w-2xl">
                            {user?.bioData || "No company bio specified yet."}
                        </p>

                        <div className="pt-2">
                            <Link
                                to="/freelancer/edit-profile"
                                className="inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004bb0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
                            >
                                <Edit3 size={16} />
                                <span>Edit Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Metrics & Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Wallet Summary */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Wallet className="text-[#0058be]" size={20} />
                                <h3 className="font-bold text-slate-900 text-base">Wallet Balance</h3>
                            </div>
                            <Link to="/client/wallet" className="text-xs font-bold text-[#0058be] hover:underline flex items-center gap-1">
                                Manage <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Available Coins</p>
                            <p className="text-2xl font-bold text-slate-900 mt-0.5">
                                ₹{wallet?.availableBalance ? Number(wallet.availableBalance).toLocaleString("en-IN") : "0"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Escrow Held</p>
                            <p className="text-base font-bold text-amber-600 mt-0.5">
                                ₹{wallet?.heldBalance ? Number(wallet.heldBalance).toLocaleString("en-IN") : "0"}
                            </p>
                        </div>
                    </div>

                    {/* Orders Overview */}
                    <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="text-[#0058be]" size={20} />
                                <h3 className="font-bold text-slate-900 text-base">Active Orders</h3>
                            </div>
                            <Link to="/client/orders" className="text-xs font-bold text-[#0058be] hover:underline flex items-center gap-1">
                                View All ({orders.length}) <ArrowRight size={12} />
                            </Link>
                        </div>

                        {loading && <div className="text-center py-6 text-slate-500 text-sm">Loading orders...</div>}

                        {!loading && orders.length === 0 && (
                            <div className="text-center py-6 text-slate-500 text-sm">No active orders placed yet.</div>
                        )}

                        {!loading && orders.length > 0 && (
                            <div className="divide-y divide-gray-100">
                                {orders.slice(0, 3).map(o => (
                                    <div key={o.id} className="py-3 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-bold text-slate-900">#{o.id} - {o.gigTitle || "Gig Service"}</p>
                                            <p className="text-xs text-slate-500">Freelancer: {o.freelancerName || "Freelancer"}</p>
                                        </div>
                                        <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg text-xs">
                                            {o.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
