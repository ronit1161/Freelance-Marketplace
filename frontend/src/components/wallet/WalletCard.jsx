import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { api } from '../../services/api';

export default function WalletCard({ balance, onUpdateBalance }) {
  const [amount, setAmount] = useState('');

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!amount) return;
    const nextBalance = api.depositFunds(amount);
    onUpdateBalance(nextBalance);
    setAmount('');
  };

  const handleWithdrawal = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) > balance) return;
    const nextBalance = api.withdrawFunds(amount);
    onUpdateBalance(nextBalance);
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center space-x-3 text-gray-400 mb-2">
        <Wallet size={18} className="text-blue-600" />
        <span className="text-xs font-bold uppercase tracking-wider">Available Vault Balance</span>
      </div>

      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
        ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h2>

      {/* Action Fields Form */}
      <form className="mt-6 pt-6 border-t border-gray-50 space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Transaction Amount ($)</label>
          <input
            type="number"
            min="1"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDeposit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center transition space-x-1"
          >
            <ArrowDownLeft size={14} /> <span>Add Funds</span>
          </button>
          <button
            type="button"
            onClick={handleWithdrawal}
            disabled={!amount || parseFloat(amount) > balance}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center transition space-x-1"
          >
            <ArrowUpRight size={14} /> <span>Withdraw</span>
          </button>
        </div>
      </form>
    </div>
  );
}