// import React from 'react'

const GigCard = () => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">

            <img
                src="/gig.jpg"
                alt=""
                className="h-48 w-full object-cover"
            />

            <div className="p-5">

                <h3 className="font-semibold">
                    I will build a React Website
                </h3>

                <div className="flex justify-between mt-4">

                    <span className="text-yellow-500">
                        ★ 4.9
                    </span>

                    <span className="font-bold">
                        ₹5000
                    </span>

                </div>

            </div>

        </div>
    )
}

export default GigCard