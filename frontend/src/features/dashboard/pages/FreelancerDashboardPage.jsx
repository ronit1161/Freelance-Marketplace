import { Link } from "react-router-dom";
import GigCard from "../../gigs/components/GigCard";
import StatCard from "../../profile/components/StatCard";
import OrderRow from "../../orders/components/OrderRow";

export default function FreelancerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome Back, Ronit
          </h1>

          <p className="text-gray-500 mt-2">
            Here's what's happening with your freelancing business.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <StatCard title="Total Earnings" value="₹45,000" />
          <StatCard title="Active Orders" value="8" />
          <StatCard title="Completed Orders" value="54" />
          <StatCard title="Pending Reviews" value="3" />
          <StatCard title="Active Gigs" value="5" />

        </div>


        {/* My Gigs */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              My Gigs
            </h2>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              <Link
                to={"create-gig"}
              >Create Gig</Link>
            </button>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            <Link to="/gig-details">
              <GigCard />
            </Link>

            <Link to="/gig-details">
              <GigCard />
            </Link>

            <Link to="/gig-details">
              <GigCard />
            </Link>

          </div>
        </section>


        {/* Recent Orders */}
        <section className="bg-white rounded-xl shadow-sm mt-10 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Recent Orders
          </h2>

          <div className="space-y-4">

            <OrderRow
              project="React Dashboard"
              client="John Doe"
              status="In Progress"
            />

            <OrderRow
              project="Portfolio Website"
              client="Sarah"
              status="Completed"
            />

            <OrderRow
              project="E-Commerce App"
              client="David"
              status="Pending"
            />

          </div>
        </section>

      </div>
    </div>
  );
}