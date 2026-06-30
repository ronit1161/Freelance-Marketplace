import HireCard from "../../components/profile/HireCard";
import ProjectCard from "../../components/client/ProjectCard";

export default function ClientProfile() {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Cover */}
            <div className="h-56 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="max-w-7xl mx-auto px-6">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8 -mt-20 relative">

                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

                        <img
                            src="https://i.pravatar.cc/200"
                            alt="Client"
                            className="w-36 h-36 rounded-full border-4 border-white object-cover"
                        />

                        <div className="flex-1">

                            <h1 className="text-4xl font-bold">
                                ABC Technologies
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Startup & SaaS Company
                            </p>

                            <div className="flex flex-wrap gap-6 mt-5 text-sm">

                                <span>⭐ 4.8 Client Rating</span>
                                <span>📍 Mumbai, India</span>
                                <span>🗓 Member Since 2024</span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8 mt-8">

                    {/* Left Side */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">

                            <h2 className="text-2xl font-semibold mb-4">
                                About Company
                            </h2>

                            <p className="text-gray-600 leading-7">
                                ABC Technologies builds SaaS products for businesses
                                worldwide. We frequently hire freelance developers,
                                UI/UX designers, and QA engineers for short and
                                long-term projects.
                            </p>

                        </section>

                        {/* Active Projects */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">

                            <h2 className="text-2xl font-semibold mb-6">
                                Active Projects
                            </h2>

                            <div className="space-y-4">

                                <ProjectCard
                                    title="React Admin Dashboard"
                                    budget="₹50,000"
                                    proposals="15"
                                />

                                <ProjectCard
                                    title="Mobile App UI Design"
                                    budget="₹25,000"
                                    proposals="8"
                                />

                                <ProjectCard
                                    title="Node.js Backend API"
                                    budget="₹70,000"
                                    proposals="22"
                                />

                            </div>

                        </section>

                        {/* Recent Hires */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">

                            <h2 className="text-2xl font-semibold mb-6">
                                Recent Hires
                            </h2>

                            <div className="space-y-4">

                                <HireCard name="John Smith" role="Full Stack Developer" />
                                <HireCard name="Sarah Wilson" role="UI/UX Designer" />
                                <HireCard name="David Brown" role="Backend Developer" />

                            </div>

                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        <div className="bg-white rounded-xl p-6 shadow-sm">

                            <h3 className="font-semibold text-lg mb-4">
                                Company Details
                            </h3>

                            <div className="space-y-3 text-gray-600">

                                <p>🏢 Company Size: 50-100</p>
                                <p>🌎 Remote Friendly</p>
                                <p>💼 25 Jobs Posted</p>
                                <p>✅ 18 Jobs Completed</p>

                            </div>

                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">

                            <h3 className="font-semibold text-lg mb-4">
                                Technologies
                            </h3>

                            <div className="flex flex-wrap gap-2">

                                <span className="px-3 py-1 bg-gray-100 rounded-full">
                                    React
                                </span>

                                <span className="px-3 py-1 bg-gray-100 rounded-full">
                                    Node.js
                                </span>

                                <span className="px-3 py-1 bg-gray-100 rounded-full">
                                    MongoDB
                                </span>

                                <span className="px-3 py-1 bg-gray-100 rounded-full">
                                    AWS
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
