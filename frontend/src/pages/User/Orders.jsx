import { useState } from 'react';
import { Search, Plus, ArrowLeft} from 'lucide-react';
import { api } from '../../Services/api';
import ProjectCard from '../../components/userProfile/ProjectCard';
import SpendingSummary from '../../components/userProfile/SpendingSummary';
import CreateProjectModal from '../../components/userProfile/CreateProjectModal';
import SubNavbar from '../../components/userProfile/SubNavBar';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import WalletCard from '../../components/wallet/WalletCard';

export default function Orders() {
  const [projects, setProjects] = useState(api.getProjects());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Wallet and financial ledger states
  const [balance, setBalance] = useState(api.getWalletBalance());
  const [transactions, setTransactions] = useState(api.getTransactionHistory());
  
  // Track toggle view mode within the wallet panel: 'default' | 'all-transactions'
  const [walletViewMode, setWalletViewMode] = useState('default');

  const handleCreateProject = (projectFormData) => {
    const createdProject = api.addProject(projectFormData);
    setProjects([createdProject, ...projects]);
  };

  const handleUpdateBalance = (newBalance) => {
    setBalance(newBalance);
    setTransactions(api.getTransactionHistory());
  };

  // Safe tab change wrapper ensuring wallet nested view resets gracefully 
  const handleTabChange = (targetTab) => {
    setCurrentTab(targetTab);
    setWalletViewMode('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      
      {/* Dynamic Heading Line Configuration based on View Sub-states */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          {currentTab === 'wallet' && walletViewMode === 'all-transactions' && (
            <button 
              onClick={() => setWalletViewMode('default')}
              className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition mb-2"
            >
              <ArrowLeft size={16} /> <span>Back to Wallet Dashboard</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {currentTab === 'wallet' && walletViewMode === 'all-transactions' 
              ? 'Transaction Statement History' 
              : 'Welcome back, Adrian'}
          </h1>
          <p className="text-gray-500 mt-1">
            {currentTab === 'wallet' && walletViewMode === 'all-transactions'
              ? 'Audit log record listings for all incoming deposits and platform expense items.'
              : 'Manage your ongoing creative partnerships and find your next talent.'}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center shadow-sm transition"
          >
            <Plus size={16} className="mr-2" /> Post a New Request
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center transition">
            <Search size={16} className="mr-2 text-blue-600" /> Find Talent
          </button>
        </div>
      </div>

      {/* Main Sub Tab Controller Layout */}
      <SubNavbar 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange} 
        projectCount={projects.length} 
      />

      {/* --- RENDER CONFIG SWITCHBOARD --- */}
      {currentTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
              <button onClick={() => setCurrentTab('orders')} className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="space-y-6">
            <SpendingSummary />
          </div>
        </div>
      )}

      {currentTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h2 className="text-xl font-bold text-slate-900">Project Catalog</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {currentTab === 'wallet' && (
        <div className="animate-in fade-in duration-200">
          {walletViewMode === 'all-transactions' ? (
            
            /* VIEW A: FULL WIDTH LEDGER LISTINGS */
            <div className="max-w-4xl mx-auto">
              <TransactionHistory 
                transactions={transactions} 
                showSeeAll={false} 
              />
            </div>

          ) : (
            
            /* VIEW B: DEFAULT SIDE-BY-SIDE CARD LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <WalletCard balance={balance} onUpdateBalance={handleUpdateBalance} />
              </div>
              <div className="lg:col-span-2">
                <TransactionHistory 
                  transactions={transactions.slice(0, 3)} // Show preview summary 
                  onSeeAllClick={() => setWalletViewMode('all-transactions')} 
                  showSeeAll={true}
                />
              </div>
            </div>

          )}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleCreateProject}
      />
    </div>
  );
}