// import React from 'react';

export default function TransactionHistory({ transactions, onSeeAllClick, showSeeAll = true }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-bold text-slate-900">Transaction Activity Ledger</h3>
        {showSeeAll && (
          <button 
            type="button"
            onClick={onSeeAllClick}
            className="text-xs font-semibold text-blue-600 hover:underline hover:text-blue-800 transition"
          >
            See All
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-50 overflow-hidden">
        {transactions.map((tx) => (
          <div key={tx.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-bold text-slate-800">{tx.type}</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[11px] text-gray-400 font-medium">{tx.id}</span>
                <span className="text-[11px] text-gray-300">•</span>
                <span className="text-[11px] text-gray-400 font-medium">{tx.date}</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-sm font-extrabold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                {tx.amount > 0 ? '+' : ''}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={`block text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded mt-1 ${tx.statusColor}`}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}