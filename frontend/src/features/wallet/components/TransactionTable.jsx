import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs font-medium">
        No transaction records found in ledger.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <th className="py-3.5 px-3">Transaction ID</th>
            <th className="py-3.5">Type</th>
            <th className="py-3.5">Description</th>
            <th className="py-3.5">Amount</th>
            <th className="py-3.5">Status</th>
            <th className="py-3.5">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {transactions.map((txn) => {
            const st = String(txn.transactionStatus || "COMPLETED").toUpperCase();
            const type = String(txn.transactionType || "DEPOSIT").toUpperCase();

            return (
              <tr key={txn.id} className="hover:bg-gray-50/50 transition">
                <td className="py-4 px-3 font-mono font-bold text-slate-700">
                  #TXN-{txn.id}
                </td>
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
                <td className="py-4 text-slate-800 font-semibold max-w-xs truncate">
                  {txn.description || "Wallet transaction entry"}
                </td>
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
                    <span>{st}</span>
                  </span>
                </td>
                <td className="py-4 text-gray-400 font-medium">
                  {txn.createdOn || "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
