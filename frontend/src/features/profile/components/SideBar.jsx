import React from 'react'

const SideBar = () => {
    return (
        <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow-sm">

                <h3 className="font-bold mb-4">
                    Details
                </h3>

                <p>📍 Mumbai, India</p>
                <p>🗓 Member Since 2025</p>
                <p>🌐 English, Hindi</p>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">

                <h3 className="font-bold mb-4">
                    Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        React
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        Node.js
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        MongoDB
                    </span>

                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        Next.js
                    </span>

                </div>

            </div>

        </div>
    )
}

export default SideBar