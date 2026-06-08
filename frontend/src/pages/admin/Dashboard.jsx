import React from "react";

const Dashboard = () => {

    // Revenue Data for Graph
    const revenueData = [
        { day: "01", amount: 2400 },
        { day: "05", amount: 4100 },
        { day: "10", amount: 7200 },
        { day: "15", amount: 5400 },
        { day: "20", amount: 8600 },
        { day: "25", amount: 6400 },
        { day: "30", amount: 9800 },
    ];

    return (
        <div className="max-w-7xl m-auto min-h-screen bg-gray-50 p-10">

            <div className="flex justify-between items-center mb-10">

                <div>
                    <p className="uppercase text-sm text-gray-500">
                        Executive Suite
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        Platform Overview
                    </h1>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">

                    <button
                        className="
            px-5 py-2
            rounded-xl
            bg-white
            shadow-sm
            hover:scale-105
            transition-all
            duration-300"
                    >
                        Export Report
                    </button>



                </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-10">

                {/* Revenue */}
                <div
                    className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
          hover:shadow-xl
          hover:scale-105
          transition-all
          duration-300
          cursor-pointer"
                >
                    <p className="text-gray-500">Total Revenue</p>

                    <h2 className="text-3xl font-bold mt-2 hover:text-blue-600">
                        ₹1,28,430
                    </h2>

                    <span className="text-green-600 text-sm">
                        +12.4%
                    </span>
                </div>

                {/* Users */}
                <div
                    className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
          hover:shadow-xl
          hover:scale-105
          transition-all
          duration-300
          cursor-pointer"
                >
                    <p className="text-gray-500">Total Users</p>

                    <h2 className="text-3xl font-bold mt-2">
                        1,240
                    </h2>

                    <span className="text-green-600 text-sm">
                        +8.1%
                    </span>
                </div>

                {/* Gigs */}
                <div
                    className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
          hover:shadow-xl
          hover:scale-105
          transition-all
          duration-300
          cursor-pointer"
                >
                    <p className="text-gray-500">Active Gigs</p>

                    <h2 className="text-3xl font-bold mt-2">
                        4,892
                    </h2>

                    <span className="text-yellow-600 text-sm">
                        Stable
                    </span>
                </div>

                {/* Reports */}
                <div
                    className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
          hover:shadow-xl
          hover:scale-105
          transition-all
          duration-300
          cursor-pointer"
                >
                    <p className="text-gray-500">
                        Pending Reports
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        14
                    </h2>

                    <span className="text-red-500 text-sm">
                        -15%
                    </span>
                </div>

            </div>

            <div
                className="
        bg-blue-100
        rounded-3xl
        p-8
        shadow-sm
        mb-10"
            >

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h2 className="text-xl font-semibold">
                            Transaction Volume
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Last 30 days performance
                        </p>
                    </div>

                    <button
                        className="
            bg-blue-100
            text-blue-600
            px-4
            py-2
            rounded-xl"
                    >
                        Daily
                    </button>

                </div>

                {/* Graph */}

                <div className="flex items-end gap-4 h-72">

                    {revenueData.map((item, index) => (

                        <div
                            key={index}
                            className="flex flex-col items-center flex-1 group"
                        >

                            {/* Amount shown on hover */}

                            <span
                                className="
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-300
                text-xs
                mb-2
                font-semibold"
                            >
                                ₹{item.amount}
                            </span>

                            {/* Graph Bar */}

                            <div
                                className="
                bg-[#0058be]
                w-full
                rounded-t-xl
                hover:bg-blue-700
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer"
                                style={{
                                    height: `${item.amount / 40}px`
                                }}
                            ></div>

                            <span className="text-sm mt-2">
                                {item.day}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

            <div
                className="
        bg-white
        rounded-3xl
        p-8
        shadow-sm"
            >

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h2 className="text-xl font-semibold">
                            User Management
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Overview of platform users
                        </p>
                    </div>

                    <button
                        className="
                            bg-[#0058be]
                            text-white
                                px-5
                                py-2
                                rounded-xl
                                hover:scale-105
                                transition-all"
                    >
                        Add User
                    </button>

                </div>

                {/* Table */}

                <table className="w-full">

                    <thead>

                        <tr className="border-b">
                            <th className="text-left py-4">User</th>
                            <th className="text-left py-4">Status</th>
                            <th className="text-left py-4">Wallet</th>
                            <th className="text-left py-4">Role</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr
                            className="
              border-b
              hover:bg-blue-50
              transition-all
              duration-300"
                        >
                            <td className="py-4">Adrian Vane</td>

                            <td>
                                <span
                                    className="
                  bg-green-100
                  text-green-700
                  px-3
                  py-1
                  rounded-full
                  hover:scale-110
                  transition-all
                  inline-block"
                                >
                                    Active
                                </span>
                            </td>

                            <td>₹4,280</td>

                            <td>Freelancer</td>
                        </tr>

                        <tr
                            className="
              border-b
              hover:bg-blue-50
              transition-all
              duration-300"
                        >
                            <td className="py-4">Sarah Locke</td>

                            <td>
                                <span
                                    className="
                  bg-yellow-100
                  text-yellow-700
                  px-3
                  py-1
                  rounded-full"
                                >
                                    Pending
                                </span>
                            </td>

                            <td>₹0</td>

                            <td>Client</td>
                        </tr>

                        <tr
                            className="
              hover:bg-blue-50
              transition-all
              duration-300"
                        >
                            <td className="py-4">Marcus Kane</td>

                            <td>
                                <span
                                    className="
                  bg-green-100
                  text-green-700
                  px-3
                  py-1
                  rounded-full"
                                >
                                    Active
                                </span>
                            </td>

                            <td>₹12,450</td>

                            <td>Admin</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Dashboard;
