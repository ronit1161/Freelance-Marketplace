import { Link } from "react-router-dom";
import GigCard from "../../components/profile/GigCard";
import CategoryCard from "../../components/client/CategoryCard";
import FreelancerCard from "./FreelancerCard";
import StepCard from "./StepCard";

export default function HomePage() {
    return (
        <div className="bg-gray-50">

            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

                <div className="max-w-7xl mx-auto px-6 py-28 text-center">

                    <h1 className="text-6xl font-bold">
                        Find the Perfect Freelancer
                    </h1>

                    <p className="mt-6 text-xl text-blue-100">
                        Connect with talented developers, designers,
                        writers, and marketers from around the world.
                    </p>

                    <div className="mt-10 max-w-2xl mx-auto flex">

                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="flex-1 px-5 py-4 rounded-l-lg text-black"
                        />

                        <button className="bg-black px-8 rounded-r-lg">
                            Search
                        </button>

                    </div>

                    <div className="mt-8 flex justify-center gap-4">

                        <Link
                            to={"/signup"}
                        >
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
                                Hire Talent
                            </button>
                        </Link>

                        <Link 
                            to={"/signup"}
                        >
                            <button className="border border-white px-6 py-3 rounded-lg font-semibold">
                                Become a Freelancer
                            </button>
                        </Link>

                    </div>

                </div>

            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-6 py-20">

                <h2 className="text-3xl font-bold mb-10">
                    Popular Categories
                </h2>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">

                    <CategoryCard title="Web Development" />
                    <CategoryCard title="Mobile Apps" />
                    <CategoryCard title="UI/UX Design" />
                    <CategoryCard title="Graphic Design" />
                    <CategoryCard title="Content Writing" />
                    <CategoryCard title="Digital Marketing" />

                </div>

            </section>


            {/* How it works */}
            <section className="bg-white py-20">

                <div className="max-w-6xl mx-auto px-6">

                    <h2 className="text-3xl font-bold text-center mb-16">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">

                        <StepCard
                            number="01"
                            title="Post a Job"
                            description="Tell us what you need."
                        />

                        <StepCard
                            number="02"
                            title="Hire Talent"
                            description="Review proposals and choose."
                        />

                        <StepCard
                            number="03"
                            title="Get Work Done"
                            description="Track progress and pay securely."
                        />

                    </div>

                </div>

            </section>


            {/* Why Us */}
            <section className="bg-blue-600 text-white py-20">

                <div className="max-w-6xl mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold">
                        Why Choose Our Marketplace?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10 mt-12">

                        <div>
                            <h3 className="text-xl font-semibold">
                                Verified Freelancers
                            </h3>
                            <p className="mt-3 text-blue-100">
                                Work with trusted professionals.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold">
                                Secure Payments
                            </h3>
                            <p className="mt-3 text-blue-100">
                                Safe and transparent transactions.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold">
                                24/7 Support
                            </h3>
                            <p className="mt-3 text-blue-100">
                                We're here whenever you need help.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}