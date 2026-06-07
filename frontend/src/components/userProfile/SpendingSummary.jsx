// import React from 'react';

export default function SpendingSummary() {
  const monthlySpending = [
    { month: 'APR', height: 'h-12' },
    { month: 'MAY', height: 'h-20' },
    { month: 'JUN', height: 'h-16' },
    { month: 'JUL', height: 'h-28', active: true },
    { month: 'AUG', height: 'h-10' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-md font-bold text-slate-900 mb-6">Spending Summary</h3>
      
      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Total Managed Budget</p>
      <p className="text-3xl font-extrabold text-blue-600 tracking-tight mt-1">$12,840.00</p>
      
      <div className="flex items-end justify-between h-32 mt-8 mb-6 px-2">
        {monthlySpending.map((bar, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className={`w-10 rounded ${bar.height} ${bar.active ? 'bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300`}></div>
            <span className="text-[10px] font-bold text-gray-400 mt-3 tracking-wide">{bar.month}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Services Used</span>
          <span className="font-bold text-slate-900">14 Active</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Cost Saved (Pro)</span>
          <span className="font-bold text-emerald-600">-$1,240.00</span>
        </div>
      </div>

      <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-semibold py-3 rounded-xl transition">
        Download Report
      </button>
    </div>
  );
}