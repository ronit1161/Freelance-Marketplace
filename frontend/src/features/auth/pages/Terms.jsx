
const TermsAndConditions = () => {
  const sections = [
    { title: '1. Acceptance', content: 'By using Freelance Marketplace, you agree to these terms.' },
    { title: '2. User Accounts', content: 'You must be 18+ and are responsible for your account.' },
    { title: '3. User Roles', content: 'Client (post projects), Freelancer (offer services), Admin (manage platform).' },
    { title: '4. Projects & Payments', content: 'Clients pay freelancers for completed work. Terms must be agreed upon.' },
    { title: '5. User Conduct', content: 'No fraud, spam, or illegal activities. Be respectful.' },
    { title: '6. Termination', content: 'Accounts violating terms may be suspended.' },
    { title: '7. Disclaimer', content: 'Platform is "as is." Not liable for user disputes.' },
    { title: '8. Contact', content: '📧 support@freelancemarketplace.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Terms & Conditions</h1>
        <p className="text-center text-gray-500 text-sm mb-6 border-b pb-4">Last Updated: July 2026</p>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-800">{section.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{section.content}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 pt-4 border-t">
          © 2026 Freelance Marketplace. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;