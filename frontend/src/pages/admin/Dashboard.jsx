import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const formatCurrency = (amount) =>
    `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StatCard = ({ label, value }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <h2 className="text-3xl font-extrabold text-slate-950 mt-2">{value}</h2>
    </div>
);

// Sample data for the chart below — swap in a real transactions endpoint
// later, this just keeps the visual in place for now.
const revenueData = [
    { day: "01", amount: 2400 },
    { day: "05", amount: 4100 },
    { day: "10", amount: 7200 },
    { day: "15", amount: 5400 },
    { day: "20", amount: 8600 },
    { day: "25", amount: 6400 },
    { day: "30", amount: 9800 },
];

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, gigsRes] = await Promise.all([
                axios.get(`${API_BASE}/auth/users`),
                axios.get(`${API_BASE}/gigs`),
            ]);
            setUsers(usersRes.data);
            setGigs(gigsRes.data);
        } catch (err) {
            console.error("Error loading admin dashboard data:", err);
            setError("Couldn't load dashboard data. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${API_BASE}/auth/users/${id}`);
            loadData();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        }
    };

    const handleDeleteGig = async (id) => {
        if (!confirm("Are you sure you want to delete this gig?")) return;
        try {
            await axios.delete(`${API_BASE}/gigs/${id}`);
            loadData();
        } catch (err) {
            console.error("Error deleting gig:", err);
            alert("Failed to delete gig.");
        }
    };

    // Total Volume = sum of every user's wallet balance. A real, computed
    // number instead of a hardcoded one, using data already being fetched.
    const totalVolume = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);
    const adminCount = users.filter((u) => u.role?.toLowerCase() === "admin").length;
    const roles = ["All", ...new Set(users.map((u) => u.role).filter(Boolean))];

    const filteredUsers = users.filter((u) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
        const matchesRole = roleFilter === "All" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl m-auto min-h-screen bg-gray-50 p-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <p className="uppercase text-xs font-bold text-blue-600 tracking-widest">
                        Executive Suite
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-tight mt-2 text-slate-900">
                        Platform Overview
                    </h1>
                </div>
                <button
                    onClick={loadData}
                    className="bg-white border border-gray-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs shadow-sm hover:bg-gray-50 transition"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl p-4 mb-8">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Volume" value={formatCurrency(totalVolume)} />
                <StatCard label="Total Users" value={users.length} />
                <StatCard label="Active Gigs" value={gigs.length} />
                <StatCard label="Admins" value={adminCount} />
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 shadow-sm mb-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Transaction Volume</h2>
                        <p className="text-gray-500 text-sm">Last 30 days (sample data)</p>
                    </div>
                    <button className="bg-white border border-blue-200 text-blue-600 font-bold px-4 py-2 rounded-xl text-xs shadow-sm">
                        Daily
                    </button>
                </div>

                <div className="flex items-end gap-4 h-72">
                    {revenueData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs mb-2 font-semibold">
                                ₹{item.amount}
                            </span>
                            <div
                                className="bg-[#0058be] w-full rounded-t-xl transition-all duration-300"
                                style={{ height: `${item.amount / 40}px` }}
                            ></div>
                            <span className="text-xs font-bold text-slate-400 mt-2">{item.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                        <p className="text-gray-500 text-sm">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm capitalize"
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-4">User Details</th>
                            <th>Status</th>
                            <th>Wallet Balance</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-gray-500">
                                    {users.length === 0 ? "No users yet." : "No users match your search."}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b hover:bg-gray-50/50 transition duration-150">
                                    <td className="py-4">
                                        <div className="font-bold text-slate-950">{u.name}</div>
                                        <div className="text-xs text-gray-400">{u.email}</div>
                                    </td>
                                    <td>
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                            Active
                                        </span>
                                    </td>
                                    <td className="font-semibold text-slate-900">
                                        {formatCurrency(u.walletBalance)}
                                    </td>
                                    <td className="capitalize font-bold text-slate-500">{u.role}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Gig Management</h2>
                        <p className="text-gray-500 text-sm">Overview of posted gigs</p>
                    </div>
                </div>

                {/* Adjust title/price/status below if your Gig entity uses
                    different field names. */}
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-4">Gig</th>
                            <th>Budget</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {gigs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-6 text-center text-gray-500">
                                    No gigs posted yet.
                                </td>
                            </tr>
                        ) : (
                            gigs.map((g) => (
                                <tr key={g.id} className="border-b hover:bg-gray-50/50 transition duration-150">
                                    <td className="py-4 font-bold text-slate-950">
                                        {g.title || g.name || "Untitled Gig"}
                                    </td>
                                    <td className="font-semibold text-slate-900">
                                        {formatCurrency(g.price ?? g.budget ?? g.amount)}
                                    </td>
                                    <td>
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold capitalize">
                                            {g.status || "Open"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteGig(g.id)}
                                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
