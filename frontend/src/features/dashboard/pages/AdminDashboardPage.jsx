
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminUsers, blockUser, unblockUser, getRevenueGraph } from "../../../Services/adminApi";
import CategoryManagement from "../components/CategoryManagement";
import { Users, Layers } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch users & graph on component mount
  useEffect(() => {
    fetchUsers();
    fetchRevenue();
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

  const fetchRevenue = async () => {
    try {
      const data = await getRevenueGraph();
      setRevenueData(data || []);
    } catch (err) {
      console.error("Failed to fetch revenue graph data:", err);
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

  const getProfileLink = (user) => {
    if (user?.role === "FREELANCER") return "/freelancer/profile";
    return "/client/profile";
  };

  // Calculate max revenue value for proportional bar height scaling
  const maxRevenue = revenueData.length > 0
    ? Math.max(...revenueData.map((item) => Number(item.revenue) || 1), 150000)
    : 150000;

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold mt-2 text-gray-900">Freelance Marketplace Platform Overview</h1>
        </div>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">Total Revenue</p>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2 text-gray-900">
            ₹{revenueData.length > 0 ? Number(revenueData[revenueData.length - 1].revenue).toLocaleString('en-IN') : '1,28,430'}
          </h2>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">Total Users</p>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2 text-gray-900">
            {loading ? "..." : users.length}
          </h2>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">Categories</p>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2 text-blue-600">
            {categoryCount}
          </h2>
        </div>

        {/* Active Gigs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">Active Gigs</p>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2 text-gray-900">4,892</h2>
        </div>

        {/* Blocked Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">Blocked Accounts</p>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2 text-red-600">
            {loading ? "..." : users.filter((u) => u.isBlocked).length}
          </h2>
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Revenue Performance Graph - Live Amount flowing through application</h2>
            <p className="text-gray-500 text-sm">Monthly breakdown & live ongoing transaction totals</p>
          </div>
       
        </div>

        <div className="flex items-end gap-4 h-64">
          {revenueData.map((item, index) => {
            const revNum = Number(item.revenue) || 0;
            const barHeight = Math.max(Math.round((revNum / maxRevenue) * 180), 20);
            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <span className="text-xs mb-2 font-semibold text-blue-900">
                  ₹{revNum.toLocaleString('en-IN')}
                </span>
                <div
                  className="bg-[#0058be] hover:bg-blue-700 w-full rounded-t-xl transition-all duration-300 shadow-sm"
                  style={{ height: `${barHeight}px` }}
                ></div>
                <span className="text-sm mt-2 text-gray-600 font-medium">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Tab Switcher */}
      <div className="flex items-center gap-3 mb-6 bg-white p-2 rounded-2xl border border-gray-100 shadow-2xs w-fit">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "users"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "categories"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
          Category Management
        </button>
      </div>

      {activeTab === "users" ? (
        /* User Management Section */
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
                    <td className="py-4">
                      <Link to={getProfileLink(user)} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-sm uppercase group-hover:bg-blue-200 transition-colors">
                          {user.fullName ? user.fullName[0] : user.userName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors">
                            {user.fullName || user.userName}
                          </p>
                          <p className="text-xs text-gray-400">@{user.userName}</p>
                        </div>
                      </Link>
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
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm ${user.isBlocked
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
      ) : (
        <CategoryManagement onCategoryCountChange={setCategoryCount} />
      )}
    </div>
  );
};

export default Dashboard;
