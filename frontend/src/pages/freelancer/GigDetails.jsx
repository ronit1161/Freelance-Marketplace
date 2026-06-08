import React from "react";

const GigDetails = () => {
    return (
        <div className="bg-gray-50 min-h-screen px-10 py-8">

            {/* Breadcrumb */}
            <p className="text-sm text-gray-500 mb-4">
                Creative & Design &gt; Editorial Layout
            </p>

            <div className="grid grid-cols-3 gap-8">

                {/* LEFT SIDE */}
                <div className="col-span-2">

                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-8">
                        I will design a premium editorial layout
                        for your digital magazine
                    </h1>

                    {/* Seller Info */}
                    <div className="flex justify-between items-center mb-8">

                        <div className="flex items-center gap-4">

                            <img
                                src="https://i.pravatar.cc/50"
                                alt=""
                                className="w-12 h-12 rounded-full"
                            />

                            <div>
                                <h3 className="font-semibold">
                                    Alex Studio
                                </h3>

                                <p className="text-sm text-gray-500">
                                    ⭐ 4.9 (124 Reviews)
                                </p>
                            </div>

                        </div>

                        <button className="border px-5 py-2 rounded-lg hover:bg-gray-100">
                            Save
                        </button>

                    </div>

                    {/* Main Gig Image */}

                    <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                        alt=""
                        className="
              w-full
              h-[450px]
              object-cover
              rounded-2xl
              shadow-md
              mb-10"
                    />

                    {/* About Section */}

                    <div className="mb-10">

                        <h2 className="text-2xl font-bold mb-4">
                            About This Gig
                        </h2>

                        <p className="text-gray-600 leading-8">
                            Elevate your brand with a publication that
                            feels like a collector's item. I create
                            professional editorial layouts with strong
                            typography, visual hierarchy and responsive
                            structure.
                        </p>

                    </div>

                    {/* Feature Cards */}

                    <div className="grid grid-cols-2 gap-6 mb-10">

                        <div
                            className="
              bg-white
              p-6
              rounded-2xl
              hover:shadow-lg
              hover:scale-105
              transition-all"
                        >
                            <h3 className="font-bold mb-3">
                                The Aesthetic
                            </h3>

                            <p className="text-gray-500">
                                A blend of modern minimalism and
                                premium magazine styling.
                            </p>
                        </div>

                        <div
                            className="
              bg-white
              p-6
              rounded-2xl
              hover:shadow-lg
              hover:scale-105
              transition-all"
                        >
                            <h3 className="font-bold mb-3">
                                Precision Layout
                            </h3>

                            <p className="text-gray-500">
                                Carefully crafted spacing, typography
                                and alignment for maximum readability.
                            </p>
                        </div>

                    </div>

                    {/* Why Choose */}

                    <div>

                        <h2 className="text-2xl font-bold mb-4">
                            Why Choose Alex Studio?
                        </h2>

                        <ul className="space-y-3">

                            <li>✅ 10+ years of design experience</li>

                            <li>
                                ✅ Direct collaboration and revisions
                            </li>

                            <li>
                                ✅ Print-ready and web-ready delivery
                            </li>

                        </ul>

                    </div>

                </div>

                {/* RIGHT SIDE PRICING CARD */}

                <div>

                    <div
                        className="
            bg-white
            rounded-2xl
            shadow-md
            p-6
            sticky
            top-8"
                    >

                        <div className="flex gap-4 mb-6">

                            <button
                                className="
                flex-1
                border-b-2
                border-blue-600
                pb-2
                font-semibold"
                            >
                                Standard
                            </button>

                            <button className="flex-1 text-gray-500">
                                Premium
                            </button>

                        </div>

                        <div className="flex justify-between mb-6">

                            <h3 className="font-bold">
                                Standard Package
                            </h3>

                            <span className="text-3xl font-bold">
                                $150
                            </span>

                        </div>

                        <p className="text-gray-500 mb-6">
                            Perfect for boutique digital launches.
                        </p>

                        <ul className="space-y-4 mb-8">

                            <li>⏱️ 2 Day Delivery</li>

                            <li>🔄 3 Revisions</li>

                            <li>📄 5 Designed Pages</li>

                            <li>🎨 Source File Included</li>

                            <li>💬 Commercial Use</li>

                        </ul>

                        <button
                            className="
              w-full
              bg-[#0058be]
              text-white
              py-3
              rounded-xl
              hover:scale-105
              transition-all"
                        >
                            Order Now
                        </button>

                        <button
                            className="
              w-full
              mt-4
              border
              py-3
              rounded-xl
              hover:bg-gray-100"
                        >
                            Contact Seller
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default GigDetails;