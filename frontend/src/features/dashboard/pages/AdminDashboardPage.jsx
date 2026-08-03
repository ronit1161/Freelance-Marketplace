import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../../services/adminApi";
import { getAllUsers, toggleBlockUser } from "../../../services/userApi";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, usersData] = await Promise.all([
        getDashboardStats(),
        getAllUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData || []);
    } catch (err) {
      console.error("Failed to load admin data", err);
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      await toggleBlockUser(userId);
      loadAdminData();
    } catch (err) {
      alert(err?.message || "Failed to update block status.");
    }
  };

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="uppercase text-sm text-gray-500 font-semibold tracking-wider">Executive Suite</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Platform Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories"
            className="px-4 py-2.5 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 font-semibold rounded-xl text-xs shadow-sm transition"
          >
            Categories
          </Link>
          <Link
            to="/admin/gigs"
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-sm transition"
          >
            Manage Gigs →
          </Link>
        </div>
      </div>

      {loading && <div className="text-center py-10 text-slate-600 font-medium">Loading Admin Dashboard...</div>}
      {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl border border-red-200">{error}</div>}

      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Total Users */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">Total Users</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalUsers}</h2>
            <div className="text-xs text-slate-400 mt-1">
              Clients: {stats.totalClients} | Freelancers: {stats.totalFreelancers}
            </div>
          </div>

          {/* Active Gigs */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 font-medium">Active Gigs</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalGigs}</h2>
            </div>
            <Link to="/admin/gigs" className="text-xs text-[#0058be] font-bold hover:underline mt-2 inline-block">
              Manage Gigs →
            </Link>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Orders</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalOrders}</h2>
            </div>
            <Link to="/admin/orders" className="text-xs text-[#0058be] font-bold hover:underline mt-2 inline-block">
              Manage Orders →
            </Link>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 font-medium">Categories</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCategories}</h2>
            </div>
            <Link to="/admin/categories" className="text-xs text-[#0058be] font-bold hover:underline mt-2 inline-block">
              Manage Categories →
            </Link>
          </div>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">User Management</h2>
              <p className="text-gray-500 text-sm">Overview and blocking controls for platform users</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-slate-500 text-sm">
                  <th className="text-left py-4 px-2">ID</th>
                  <th className="text-left py-4">User</th>
                  <th className="text-left py-4">Email</th>
                  <th className="text-left py-4">Role</th>
                  <th className="text-left py-4">Status</th>
                  <th className="text-right py-4 px-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 transition-all hover:bg-gray-50/50">
                    <td className="py-4 px-2 font-mono text-sm text-slate-600">#{u.id}</td>
                    <td className="py-4 font-semibold text-slate-900">{u.fullName} ({u.userName})</td>
                    <td className="py-4 text-slate-600 text-sm">{u.email}</td>
                    <td className="py-4 text-sm font-medium text-slate-700">{u.role}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          u.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="text-right py-4 px-2">
                      <button
                        onClick={() => handleToggleBlock(u.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          u.isBlocked
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block User"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
