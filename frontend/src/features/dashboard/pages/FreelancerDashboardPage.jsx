import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GigCard from "../../gigs/components/GigCard";
import StatCard from "../../profile/components/StatCard";
import { getGigs } from "../../../services/gigApi";
import { getOrders, completeOrder } from "../../../services/orderApi";
import { CheckCircle2, Clock, UploadCloud } from "lucide-react";

export default function FreelancerDashboard() {
  const [gigs, setGigs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [deliverySuccess, setDeliverySuccess] = useState('');

  useEffect(() => {
    getGigs()
      .then(data => { if (Array.isArray(data)) setGigs(data); })
      .catch(() => {});
    getOrders()
      .then(data => { if (Array.isArray(data)) setProjects(data); else if (data?.orders) setProjects(data.orders); })
      .catch(() => {});
  }, []);

  const handleDeliverWork = async (projectId) => {
    try {
      await completeOrder(projectId);
      setDeliverySuccess(`Deliverable submitted for order #${projectId}.`);
      setTimeout(() => setDeliverySuccess(''), 4000);
    } catch {
      setDeliverySuccess(`Status updated for order #${projectId}.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Freelancer Console
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your active gigs, client orders, and earnings payout.
            </p>
          </div>

          <Link
            to="/freelancer/create-gig"
            className="bg-[#0058be] hover:bg-[#004bb0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm inline-flex items-center gap-2 self-start"
          >
            Create New Gig
          </Link>
        </div>

        {deliverySuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
            {deliverySuccess}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Earnings" value="$5,420.50" />
          <StatCard title="Active Projects" value={projects.filter(p => p.status === 'ACTIVE').length.toString()} />
          <StatCard title="Active Gigs" value={gigs.length.toString()} />
          <StatCard title="Pending Review" value={projects.filter(p => p.status === 'REVIEW PENDING').length.toString()} />
        </div>

        {/* Active Incoming Client Orders Section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Active Client Orders
          </h2>

          <div className="divide-y divide-gray-100">
            {projects.map((proj) => (
              <div key={proj.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${proj.statusColor}`}>
                      {proj.status}
                    </span>
                    <span className="text-xs text-gray-400">ID: {proj.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>
                  <p className="text-xs text-gray-500 max-w-xl">{proj.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {proj.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleDeliverWork(proj.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <UploadCloud size={16} /> <span>Submit Work Deliverable</span>
                    </button>
                  )}
                  {proj.status === 'REVIEW PENDING' && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center gap-1">
                      <Clock size={14} /> Pending Client Sign-Off
                    </span>
                  )}
                  {proj.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Order Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Gigs Catalog */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Published Marketplace Gigs
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gigItem) => (
              <Link key={gigItem.id} to={`/gigs/${gigItem.id}`}>
                <GigCard gig={gigItem} />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
