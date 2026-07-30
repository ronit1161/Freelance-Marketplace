
const WhyUsSection = () => {
  return (
    <>
      {/* Why Us */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold">Why Choose Our Marketplace?</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            <div>
              <h3 className="text-xl font-semibold">Verified Freelancers</h3>
              <p className="mt-3 text-blue-100">
                Work with trusted professionals.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="mt-3 text-blue-100">
                Safe and transparent transactions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="mt-3 text-blue-100">
                We're here whenever you need help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUsSection;
