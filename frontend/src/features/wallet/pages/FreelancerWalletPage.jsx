import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getWalletByUserId, getWalletTransactions } from "../../../services/walletapi";
import FreelancerWalletGrid from "../components/FreelancerWalletGrid";
import TransactionTable from "../components/TransactionTable";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Info,
} from "lucide-react";

export default function FreelancerWalletPage() {
  const { user } = useAuth();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [searchTxnId, setSearchTxnId] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (user?.id) {
      loadFreelancerWalletData();
    }
  }, [user?.id]);

  const loadFreelancerWalletData = async () => {
    setLoading(true);
    setError("");
    try {
      const [walletData, txnsData] = await Promise.all([
        getWalletByUserId(user.id).catch(() => null),
        getWalletTransactions(user.id).catch(() => []),
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(txnsData) ? txnsData : (txnsData?.content || []));
    } catch (err) {
      console.error("Failed to load freelancer wallet:", err);
      setError(err?.message || "Failed to fetch wallet and transaction history.");
    } finally {
      setLoading(false);
    }
  };

  // Safely extract balance metrics
  const availableBal =
    wallet?.availableBalance !== undefined
      ? wallet.availableBalance
      : wallet?.balance || 0;
  const heldBal = wallet?.heldBalance !== undefined ? wallet.heldBalance : 0;
  const totalBal =
    wallet?.totalBalance !== undefined
      ? wallet.totalBalance
      : availableBal + heldBal;

  // Filtered transactions logic
  const filteredTransactions = transactions.filter((txn) => {
    const txnIdString = String(txn.id || "").toLowerCase();
    const matchesSearch =
      searchTxnId.trim() === "" ||
      txnIdString.includes(searchTxnId.toLowerCase().trim()) ||
      `txn-${txnIdString}`.includes(searchTxnId.toLowerCase().trim()) ||
      `#txn-${txnIdString}`.includes(searchTxnId.toLowerCase().trim());

    const txnType = String(txn.transactionType || "").toUpperCase();
    const matchesType =
      typeFilter === "ALL" ||
      (typeFilter === "CREDIT" && (txnType === "DEPOSIT" || txnType === "RELEASE" || txnType === "CREDIT")) ||
      (typeFilter === "DEBIT" && (txnType === "WITHDRAWAL" || txnType === "DEBIT")) ||
      (typeFilter === "HOLD" && (txnType === "ESCROW_HOLD" || txnType === "HOLD")) ||
      (typeFilter === "RELEASE" && txnType === "RELEASE") ||
      (typeFilter === "REFUND" && txnType === "REFUND");

    const txnStatus = String(txn.transactionStatus || "COMPLETED").toUpperCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "COMPLETED" && (txnStatus === "COMPLETED" || txnStatus === "SUCCESS")) ||
      (statusFilter === "PENDING" && txnStatus === "PENDING") ||
      (statusFilter === "FAILED" && (txnStatus === "FAILED" || txnStatus === "CANCELLED"));

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs text-[#0058be] font-bold uppercase tracking-wider block mb-1">
            Freelancer Finance
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Freelancer Wallet</h1>
          <p className="text-gray-500 text-sm mt-1">
            Read-only wallet balance summary and completed order transactions ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/freelancer"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Console</span>
          </Link>
          <button
            onClick={loadFreelancerWalletData}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS (Available, Held, Total Balance) */}
      <FreelancerWalletGrid
        availableBal={availableBal}
        heldBal={heldBal}
        totalBal={totalBal}
      />

      {/* TRANSACTION HISTORY SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Read-only ledger of client order releases and earnings
            </p>
          </div>

          {/* Search Bar & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search by Transaction ID..."
                value={searchTxnId}
                onChange={(e) => setSearchTxnId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3 border border-gray-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="CREDIT">Credit / Earnings</option>
                <option value="DEBIT">Debit / Payout</option>
                <option value="HOLD">Hold (Escrow)</option>
                <option value="RELEASE">Release</option>
                <option value="REFUND">Refund</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3 border border-gray-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading transaction history...</span>
          </div>
        ) : (
          <TransactionTable transactions={filteredTransactions} />
        )}
      </div>
    </div>
  );
}
