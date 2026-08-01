import { useState } from "react";
import { createOrder } from "../../../services/orderApi";
import { X, FolderPlus, Loader2, AlertCircle } from "lucide-react";

export default function CreateProjectModal({ isOpen, onClose }) {
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState({ error: null, success: false, values: { freelancerId: "", gigId: "", requirements: "" } });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        try {
            await createOrder(payload);
            setState({ error: null, success: true, values: { freelancerId: "", gigId: "", requirements: "" } });
            e.target.reset();
            onClose();
        } catch (err) {
            setState({
                error: err.message || "Failed to submit request",
                success: false,
                values: payload,
            });
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center font-bold">
                            <FolderPlus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Post New Project</h2>
                            <p className="text-xs text-gray-500">Submit job details for freelancers</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {state.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{state.error}</span>
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="gigId" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Gig ID
                        </label>
                        <input
                            id="gigId"
                            name="gigId"
                            type="text"
                            required
                            placeholder="e.g. 112"
                            defaultValue={state.values.gigId || ""}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="requirements" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Project Requirements
                        </label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            rows="3"
                            required
                            placeholder="Describe scope, deliverables, and timeline..."
                            defaultValue={state.values.requirements || ""}
                            className="w-full px-[#3.5] py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-2.5 px-4 bg-[#0058be] hover:bg-[#004bb0] text-white font-semibold rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>Submit Request</span>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
