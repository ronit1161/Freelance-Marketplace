import { useWallet } from '../../Hooks/useWallet';
import { Wallet, Lock, Coins, AlertCircle, Loader2 } from 'lucide-react';

export default function WalletCard({ userId }) {
    const { wallet, loading, error } = useWallet(userId);

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[160px]">
                <Loader2 className="w-6 h-6 text-[#0058be] animate-spin" />
                <span className="ml-2.5 text-sm text-gray-500 font-medium">Loading wallet details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
            </div>
        );
    }

    if (!wallet) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-500 text-sm font-medium text-center">
                No wallet details found.
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#003b82] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-700/50">
            {/* Decorative glow */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Wallet className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-wider font-semibold text-blue-200">Client Wallet</h3>
                        <p className="text-sm font-medium text-white">{wallet.user?.firstName} {wallet.user?.lastName}</p>
                    </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium mb-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                        Available
                    </div>
                    <p className="text-xl font-bold text-white">₹{wallet.availableBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium mb-1">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        Held (Escrow)
                    </div>
                    <p className="text-xl font-bold text-amber-300">₹{wallet.heldBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium mb-1">
                        <Wallet className="w-3.5 h-3.5 text-blue-400" />
                        Total Balance
                    </div>
                    <p className="text-xl font-bold text-blue-100">₹{wallet.totalBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
}