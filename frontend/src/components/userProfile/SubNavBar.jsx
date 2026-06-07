// import React from 'react';
import { LayoutDashboard, Briefcase, Wallet } from 'lucide-react';

export default function SubNavbar({ currentTab, setCurrentTab, projectCount }) {
  // Utility for active tab borders and typography weights
  const tabClass = (tabId) => `
    flex items-center space-x-2 pb-3 text-sm font-semibold transition-all relative border-b-2 whitespace-nowrap
    ${currentTab === tabId 
      ? 'text-blue-600 border-blue-600' 
      : 'text-gray-400 border-transparent hover:text-gray-600'}
  `;

  return (
    <div className="flex space-x-8 border-b border-gray-100 mb-8 pt-2 overflow-x-auto scrollbar-none">
      <button onClick={() => setCurrentTab('dashboard')} className={tabClass('dashboard')}>
        <LayoutDashboard size={16} /> <span>Dashboard</span>
      </button>
      <button onClick={() => setCurrentTab('orders')} className={tabClass('orders')}>
        <Briefcase size={16} /> <span>All Orders ({projectCount})</span>
      </button>
      <button onClick={() => setCurrentTab('wallet')} className={tabClass('wallet')}>
        <Wallet size={16} /> <span>Wallet & Metrics</span>
      </button>
    </div>
  );
}