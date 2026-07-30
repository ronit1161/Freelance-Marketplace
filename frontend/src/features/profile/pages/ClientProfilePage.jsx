import { useAuth } from "../../../context/AuthContext";
import HireCard from "../components/HireCard";
import { Building2, MapPin, Calendar, Star, CheckCircle2, Briefcase } from "lucide-react";

export default function ClientProfile() {
    const { user } = useAuth();
    const clientName = user?.name || user?.fullName || "ABC Technologies";
    const clientEmail = user?.email || "contact@abctech.com";

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 animate-in fade-in duration-200">
            {/* Cover Banner */}
            <div className="h-48 bg-gradient-to-r from-[#0058be] to-blue-700"></div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Profile Card Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 -mt-16 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="w-28 h-28 rounded-2xl bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-[#0058be] font-bold text-3xl shrink-0">
                            {clientName[0]?.toUpperCase()}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {clientName}
                                    </h1>
                                    <p className="text-gray-500 font-medium text-sm mt-1 flex items-center justify-center md:justify-start gap-1.5">
                                        <Building2 size={16} /> <span>Enterprise Client & Product Studio</span>
                                    </p>
                                </div>
                                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl self-center md:self-start flex items-center gap-1">
                                    <CheckCircle2 size={14} /> Verified Enterprise Account
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6 text-xs font-semibold text-gray-600 border-t pt-4 border-gray-100">
                                <span className="flex items-center gap-1.5"><Star size={15} className="text-amber-500 fill-amber-500" /> 4.9 Client Rating</span>
                                <span className="flex items-center gap-1.5"><MapPin size={15} className="text-gray-400" /> Mumbai, India</span>
                                <span className="flex items-center gap-1.5"><Calendar size={15} className="text-gray-400" /> Member Since 2024</span>
                                <span className="flex items-center gap-1.5"><Briefcase size={15} className="text-gray-400" /> {clientEmail}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">
                                About Organization
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We design and build enterprise-grade web and mobile SaaS products. We regularly partner with top freelance full-stack developers, UI/UX architects, and DevOps engineers for both short-term contracts and long-term retainer projects.
                            </p>
                        </section>

                        {/* Recent Hires */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Freelancer Collaborations
                            </h2>
                            <div className="space-y-3">
                                <HireCard name="Elena Rostova" role="Senior 3D & UI Architect" />
                                <HireCard name="John Smith" role="Full Stack React Engineer" />
                                <HireCard name="Sarah Wilson" role="Product Designer" />
                            </div>
                        </section>
                    </div>

                    {/* Right Column / Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                            <h3 className="font-bold text-base text-slate-900">
                                Company Snapshot
                            </h3>
                            <div className="space-y-3 text-xs font-medium text-gray-600">
                                <p className="flex items-center gap-2">🏢 Company Size: 50-100 employees</p>
                                <p className="flex items-center gap-2">🌐 Work Culture: 100% Remote</p>
                                <p className="flex items-center gap-2">📋 Projects Posted: 24 Gigs Funded</p>
                                <p className="flex items-center gap-2">✅ Milestone Completion Rate: 98%</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                            <h3 className="font-bold text-base text-slate-900">
                                Core Tech Ecosystem
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["React", "Node.js", "TypeScript", "Tailwind CSS", "AWS", "PostgreSQL"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
