import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getWalletByUserId, topUpWallet } from "../../../services/walletapi";
import apiClient from "../../../services/apiClient";
import {
  Wallet,
  Lock,
  Coins,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  PlusCircle,
  X,
} from "lucide-react";

export default function WalletPage() {
  const { user } = useAuth();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Add Money Form State
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadWalletAndTransactions();
    }
  }, [user?.id]);

  const loadWalletAndTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const [walletData, txnsResponse] = await Promise.all([
        getWalletByUserId(user.id).catch(() => null),
        apiClient.get("/api/transactions").catch(() => ({ data: { data: [] } })),
      ]);

      setWallet(walletData);
      setTransactions(txnsResponse?.data?.data || []);
    } catch (err) {
      console.error("Failed to load wallet data:", err);
      setError(err?.message || "Failed to load wallet transaction details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    const parsedAmount = parseFloat(topUpAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Please enter a valid positive amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      await topUpWallet({
        userId: user.id,
        amount: parsedAmount,
      });

      setSuccessMsg(`₹${parsedAmount.toFixed(2)} successfully added to your wallet!`);
      setTopUpAmount("");
      setShowAddFundsModal(false);
      await loadWalletAndTransactions();
    } catch (err) {
      console.error("Error adding wallet funds:", err);
      setFormError(err?.message || "Failed to add funds to wallet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract balances safely
  const availableBal = wallet?.availableBalance !== undefined ? wallet.availableBalance : (wallet?.balance || 0);
  const heldBal = wallet?.heldBalance !== undefined ? wallet.heldBalance : 0;
  const totalBal = wallet?.totalBalance !== undefined ? wallet.totalBalance : availableBal + heldBal;

  const isFreelancer = user?.role?.toLowerCase() === "freelancer";
  const consoleLink = isFreelancer ? "/freelancer" : "/client";

  return (
    <div className="max-w-7xl m-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <Wallet size={16} />
            <span>Escrow & Digital Wallet</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isFreelancer ? "Freelancer" : "Client"} Wallet
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View available balances, escrow holds, and top up your virtual funds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={consoleLink}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Console</span>
          </Link>
          <button
            onClick={() => setShowAddFundsModal(true)}
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle size={16} />
            <span>Add Funds</span>
          </button>
          <button
            onClick={loadWalletAndTransactions}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS (Available, Held, Total Balance) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Available Balance</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              ₹{Number(availableBal).toFixed(2)}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Liquid funds for placing orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Coins size={22} />
          </div>
        </div>

        {/* Held Balance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Held (Escrow) Balance</p>
            <h2 className="text-3xl font-extrabold text-amber-600 mt-1">
              ₹{Number(heldBal).toFixed(2)}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Locked in active project orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Lock size={22} />
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Total Balance</p>
            <h2 className="text-3xl font-extrabold text-[#0058be] mt-1">
              ₹{Number(totalBal).toFixed(2)}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Combined digital assets</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0058be] flex items-center justify-center shrink-0">
            <Wallet size={22} />
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Read-only ledger of payments, escrow holds, and top-ups
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading ledger entries...</span>
          </div>
        )}

        {/* Responsive Transaction Table */}
        {!loading && (
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 text-xs font-medium">
                No transaction records found in ledger.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-3">Transaction ID</th>
                    <th className="py-3.5">Type</th>
                    <th className="py-3.5">Description</th>
                    <th className="py-3.5">Amount</th>
                    <th className="py-3.5">Status</th>
                    <th className="py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {transactions.map((txn) => {
                    const st = String(txn.transactionStatus || "COMPLETED").toUpperCase();
                    const type = String(txn.transactionType || "DEPOSIT").toUpperCase();

                    return (
                      <tr key={txn.id} className="hover:bg-gray-50/50 transition">
                        {/* Transaction ID */}
                        <td className="py-4 px-3 font-mono font-bold text-slate-700">
                          #TXN-{txn.id}
                        </td>

                        {/* Type Badge */}
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              type === "DEPOSIT"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : type === "ESCROW_HOLD"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : type === "RELEASE"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : type === "REFUND"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {type}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-4 text-slate-800 font-semibold max-w-xs truncate">
                          {txn.description || "Wallet transaction entry"}
                        </td>

                        {/* Amount */}
                        <td className="py-4 font-bold text-sm">
                          <span
                            className={
                              type === "DEPOSIT" || type === "REFUND"
                                ? "text-emerald-600"
                                : "text-slate-900"
                            }
                          >
                            {type === "DEPOSIT" || type === "REFUND" ? "+" : "-"}₹
                            {Number(txn.amount || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              st === "COMPLETED" || st === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : st === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {st === "COMPLETED" || st === "SUCCESS" ? (
                              <CheckCircle2 size={12} />
                            ) : st === "PENDING" ? (
                              <Clock size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            <span>{st}</span>
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 text-gray-400 font-medium">
                          {txn.createdOn || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ADD FUNDS MODAL */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Add Wallet Funds</h3>
                <p className="text-xs text-gray-500 mt-0.5">Top up virtual currency into your wallet</p>
              </div>
              <button
                onClick={() => {
                  setShowAddFundsModal(false);
                  setFormError("");
                }}
                className="text-gray-400 hover:text-slate-900 p-1 transition"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddFundsSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Enter Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="e.g. 5000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Presets:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTopUpAmount(String(preset))}
                      className="py-2 bg-gray-50 hover:bg-blue-50 hover:text-[#0058be] border border-gray-200 rounded-xl text-xs font-bold text-slate-700 transition"
                    >
                      +₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Top-up</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}