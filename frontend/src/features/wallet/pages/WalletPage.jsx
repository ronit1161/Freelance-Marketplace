import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getWalletByUserId, topUpWallet, getWalletTransactions } from "../../../services/walletapi";
import TopUpModal from "../components/TopUpModal";
import TransactionTable from "../components/TransactionTable";
import {
  Wallet,
  Lock,
  Coins,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  PlusCircle,
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
      const [walletData, txnsData] = await Promise.all([
        getWalletByUserId(user.id).catch(() => null),
        getWalletTransactions(user.id).catch(() => []),
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(txnsData) ? txnsData : (txnsData?.content || []));
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

  const availableBal = wallet?.availableBalance !== undefined ? wallet.availableBalance : (wallet?.balance || 0);
  const heldBal = wallet?.heldBalance !== undefined ? wallet.heldBalance : 0;
  const totalBal = wallet?.totalBalance !== undefined ? wallet.totalBalance : availableBal + heldBal;

  const isFreelancer = user?.role?.toLowerCase() === "freelancer";
  const consoleLink = isFreelancer ? "/freelancer" : "/client";

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50/50 p-6 sm:p-10 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0058be] font-bold uppercase tracking-wider mb-1">
            <Wallet size={16} />
            <span>Escrow & Digital Wallet</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
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
            className="px-4 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
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
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS (Available, Held, Total Balance) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Available Balance</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              ₹{Number(availableBal).toFixed(2)}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Liquid funds for placing orders</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Coins size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Held (Escrow) Balance</p>
            <h2 className="text-3xl font-bold text-amber-600 mt-1">
              ₹{Number(heldBal).toFixed(2)}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Locked in active project orders</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Lock size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-xs">Total Balance</p>
            <h2 className="text-3xl font-bold text-[#0058be] mt-1">
              ₹{Number(totalBal).toFixed(2)}
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Combined digital assets</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center shrink-0">
            <Wallet size={22} />
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Read-only ledger of payments, escrow holds, and top-ups
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-[#0058be]" />
            <span>Loading ledger entries...</span>
          </div>
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </div>

      {/* ADD FUNDS MODAL */}
      <TopUpModal
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        topUpAmount={topUpAmount}
        setTopUpAmount={setTopUpAmount}
        isSubmitting={isSubmitting}
        formError={formError}
        onSubmit={handleAddFundsSubmit}
      />
    </div>
  );
}