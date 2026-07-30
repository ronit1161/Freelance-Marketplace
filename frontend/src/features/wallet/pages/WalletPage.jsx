import { useState } from "react";
import WalletCard from "../components/WalletCard";
import ClientNavBar from "../../dashboard/components/ClientNavBar";
import { PlusCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { addMoneyToWallet } from "../../../services/walletApi";


export default function WalletPage({ userId }) {
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState({ error: null, success: false, values: { amount: "" } });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        try {
            await addMoneyToWallet(userId, Number(payload.amount));
            // On success, clear the stored inputs
            setState({ error: null, success: true, values: { amount: "" } });
            e.target.reset(); // Reset the DOM form
        } catch (err) {
            // On failure, preserve the typed payload in state alongside the error message!
            setState({
                error: err.message,
                success: false,
                values: payload,
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Navigation bar */}
                <ClientNavBar />

                {/* Page Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Client Wallet</h1>
                        <p className="text-sm text-gray-500">Manage your available balance and escrow funds</p>
                    </div>
                </div>

                {/* Grid Layout: Wallet Balance Card & Add Funds Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Wallet Card */}
                    <div className="lg:col-span-2">
                        <WalletCard userId={userId} />
                    </div>

                    {/* Add Money Form Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                            <PlusCircle className="w-5 h-5 text-[#0058be]" />
                            <h2 className="text-lg font-bold text-gray-900">Add Funds</h2>
                        </div>

                        {state.success && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>Funds successfully added to your wallet!</span>
                            </div>
                        )}

                        {state.error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                <span>{state.error}</span>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Amount (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-semibold text-sm">
                                        ₹
                                    </span>
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        min="1"
                                        step="any"
                                        required
                                        placeholder="e.g. 5000"
                                        defaultValue={state.values.amount || ""}
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-2.5 px-4 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Add Money</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}