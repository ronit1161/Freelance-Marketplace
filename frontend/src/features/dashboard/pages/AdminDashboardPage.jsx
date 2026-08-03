
import { useState, useEffect } from "react";
import { getAdminUsers, blockUser, unblockUser } from "../../../Services/adminApi";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
      setError("Failed to load user management data. Ensure you are logged in as Admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      setActionLoadingId(user.id);
      if (user.isBlocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update user block status:", err);
      alert("Failed to update user status. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Static chart data for visual layout
  const revenueData = [
    { day: "01", amount: 2400 },
    { day: "05", amount: 4100 },
    { day: "10", amount: 7200 },
    { day: "15", amount: 5400 },
    { day: "20", amount: 8600 },
    { day: "25", amount: 6400 },
    { day: "30", amount: 9800 },
  ];

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="uppercase text-sm text-gray-500 font-semibold">Executive Suite</p>
          <h1 className="text-4xl font-bold mt-2 text-gray-900">Platform Overview</h1>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-900">₹1,28,430</h2>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">Total Users</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-900">
            {loading ? "..." : users.length}
          </h2>
        </div>

        {/* Active Gigs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">Active Gigs</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-900">4,892</h2>
        </div>

        {/* Blocked Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">Blocked Accounts</p>
          <h2 className="text-3xl font-bold mt-2 text-red-600">
            {loading ? "..." : users.filter((u) => u.isBlocked).length}
          </h2>
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction Volume</h2>
            <p className="text-gray-500 text-sm">Last 30 days performance</p>
          </div>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold">
            Daily
          </button>
        </div>

        <div className="flex items-end gap-4 h-64">
          {revenueData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <span className="text-xs mb-2 font-semibold text-blue-900">
                ₹{item.amount}
              </span>
              <div
                className="bg-[#0058be] hover:bg-blue-700 w-full rounded-t-xl transition-all duration-300 shadow-sm"
                style={{ height: `${item.amount / 40}px` }}
              ></div>
              <span className="text-sm mt-2 text-gray-600 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <p className="text-gray-500 text-sm">Overview and account control for all platform users</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-500 font-medium">
            Loading user list from backend...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No users registered in the database yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="py-4 font-semibold">User</th>
                <th className="py-4 font-semibold">Email</th>
                <th className="py-4 font-semibold">Role</th>
                <th className="py-4 font-semibold">Status</th>
                <th className="py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-sm uppercase">
                      {user.fullName ? user.fullName[0] : user.userName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.fullName || user.userName}</p>
                      <p className="text-xs text-gray-400">@{user.userName}</p>
                    </div>
                  </td>

                  <td className="py-4 text-sm text-gray-600">{user.email}</td>

                  <td className="py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4">
                    {user.isBlocked ? (
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                        Blocked
                      </span>
                    ) : user.isActive !== false ? (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                        Active
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      disabled={actionLoadingId === user.id}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      } ${actionLoadingId === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {actionLoadingId === user.id
                        ? "Processing..."
                        : user.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
