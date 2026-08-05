import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getFreelancerOrders,
  acceptOrder,
  startOrder,
  completeOrder,
} from "../../../services/orderApi";
import { getGigsByFreelancer } from "../../../services/gigApi";
import { getWalletByUserId } from "../../../services/walletapi";
import { getReviewsForFreelancer } from "../../../services/reviewApi";
import FreelancerHeader from "../components/FreelancerHeader";
import QuickAccessBar from "../components/QuickAccessBar";
import FreelancerStatsGrid from "../components/FreelancerStatsGrid";
import RecentOrdersTable from "../components/RecentOrdersTable";

export default function FreelancerDashboard() {
  const { user } = useAuth();

  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadFreelancerDashboard();
    }
  }, [user]);

  const loadFreelancerDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [gigsData, ordersData, walletData, reviewsData] = await Promise.all([
        getGigsByFreelancer(user.id).catch(() => []),
        getFreelancerOrders(user.id).catch(() => []),
        getWalletByUserId(user.id).catch(() => null),
        getReviewsForFreelancer(user.id).catch(() => []),
      ]);

      setGigs(gigsData || []);
      setOrders(ordersData || []);
      setWallet(walletData);
      setReviews(reviewsData || []);
    } catch (err) {
      console.error("Error loading freelancer dashboard:", err);
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // Order Actions
  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId, user.id);
      showNotify(`Order #${orderId} accepted successfully!`);
      await loadFreelancerDashboard();
    } catch (err) {
      alert(err?.message || "Failed to accept order.");
    }
  };

  const handleStartOrder = async (orderId) => {
    try {
      await startOrder(orderId, user.id);
      showNotify(`Work started on Order #${orderId}!`);
      await loadFreelancerDashboard();
    } catch (err) {
      alert(err?.message || "Failed to start order.");
    }
  };

  const handleDeliverWork = async (orderId) => {
    try {
      await completeOrder(orderId, user.id);
      showNotify(`Work delivered for Order #${orderId}. Funds added to wallet!`);
      await loadFreelancerDashboard();
    } catch (err) {
      alert(err?.message || "Failed to complete order.");
    }
  };

  // Calculated Metrics
  const totalGigs = gigs.length;
  const activeGigs = gigs.filter((g) => !g.isDeleted).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => (o.status || "").toUpperCase() === "PENDING"
  ).length;
  const completedOrders = orders.filter(
    (o) => (o.status || "").toUpperCase() === "COMPLETED"
  ).length;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  const walletBalance = wallet
    ? (wallet.availableBalance ?? wallet.totalBalance ?? wallet.balance ?? "0.00")
    : "0.00";

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Header Banner Component */}
      <FreelancerHeader
        userName={user?.fullName || user?.userName}
        onRefresh={loadFreelancerDashboard}
        loading={loading}
      />

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold">
          {notification}
        </div>
      )}

      {/* Error Message Banner */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Quick Access Bar Component */}
      <QuickAccessBar />

      {/* Statistics Grid Component */}
      <FreelancerStatsGrid
        totalGigs={totalGigs}
        activeGigs={activeGigs}
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        completedOrders={completedOrders}
        avgRating={avgRating}
        reviewsCount={reviews.length}
        walletBalance={walletBalance}
      />

      {/* Recent Client Orders Table Component */}
      <RecentOrdersTable
        orders={orders}
        onAcceptOrder={handleAcceptOrder}
        onStartOrder={handleStartOrder}
        onDeliverWork={handleDeliverWork}
      />
    </div>
  );
}
