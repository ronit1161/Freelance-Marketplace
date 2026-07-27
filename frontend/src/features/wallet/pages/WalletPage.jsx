import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import WalletCard from '../components/WalletCard';
import TransactionHistory from '../components/TransactionHistory';
import CreateProjectModal from '../../orders/components/CreateProjectModal';
import SubNavbar from '../../../components/layout/SubNavBar';
import { api } from '../../../services/api';

export default function ClientWallet() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(api.getProjects());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(api.getWalletBalance());
  const [transactions, setTransactions] = useState(api.getTransactionHistory());

  const handleCreateProject = (projectFormData) => {
    const createdProject = api.addProject(projectFormData);
    setProjects([createdProject, ...projects]);
  };

  const handleUpdateBalance = () => {
    setBalance(api.getWalletBalance());
    setTransactions(api.getTransactionHistory());
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Top Welcome Title Banner Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Adrian</h1>
          <p className="text-gray-500 mt-1">Manage your ongoing creative partnerships and find your next talent.</p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center shadow-sm transition"
          >
            <Plus size={16} className="mr-2" /> Post a New Request
          </button>
          
          <button 
            onClick={() => navigate('/gigs')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center transition"
          >
            <Search size={16} className="mr-2 text-blue-600" /> Search
          </button>
        </div>
      </div>

      {/* Navigation tab bar */}
      <SubNavbar projectCount={projects.length} />

      {/* Wallet Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
        <div className="lg:col-span-1">
          <WalletCard 
            balance={balance} 
            onUpdateBalance={handleUpdateBalance} 
          />
        </div>
        <div className="lg:col-span-2">
          <TransactionHistory 
            transactions={transactions} 
            showSeeAll={false}
          />
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={handleCreateProject} 
      />
    </div>
  );
}
